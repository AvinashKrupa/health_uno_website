import _ from "lodash";
import React, {Component} from 'react';
import {ChatType, getNewSocket} from "./SocketManager";
import MessageList from "./MessageList";
import {API, post} from '../api/config/APIController';
import {getData} from '../storage/LocalStorage/LocalAsyncStorage';
import {send} from '../constants/PatientImages';
import {Image} from 'react-bootstrap';
import moment from "moment";

class MessagePane extends Component {
    constructor(props) {
        super(props);

        this.state = {
            room_id: null,
            selectedConv: props.selectedConv,
            user_id: JSON.parse(getData('userInfo'))._id,
            text: "",
            messages: [],
            socketObj: null,
            pageId: 1,
            totalMessages: null,
            shouldScrollMore: true,
            loading: false,
        }
    }

    getRoomId = () => {
        const compare = this.state.user_id.localeCompare(this.props.receiver_id)
        if (compare < 0) {
            return `${this.state.user_id + "_" + this.props.receiver_id}`;
        } else if (compare > 0) {
            return `${this.props.receiver_id + "_" + this.state.user_id}`;
        }
    }


    async componentDidMount() {
        document.body.classList.add('chat-page');
        this.initializeChatWithUser()
        await this.loadMessagesForUser(this.state.pageId)

        if(this.props.appointment_id){
            this.setState({text:`Hi, This is my appointment id ${this.props.appointment_id}. I need help! `})
        }

    }

    loadMessagesForUser = async (pageId) => {
        try {
            console.log('GETMESSAGES');
            this.setState({
                loading:true,
            })
            const response = await post(API.GETMESSAGES, {"limit": 10, "page": pageId, room_id: this.getRoomId()});
            if (response.status === 200) {
                console.log('response: ', response);
                if (!this.state.messages.length) {
                    const result = response.data.data.docs.reverse();
                    this.setState({
                        messages: result,
                        pageId: pageId+1,
                        totalMessages: response.data.data.total,
                        shouldScrollMore: this.state.messages.length < response.data.data.total ,
                        loading:false,
                    })
                } else {
                    const result = _.concat(response.data.data.docs.reverse(),this.state.messages,)
                    this.setState({
                        loading:false,
                        messages:result,
                        pageId: pageId+1,
                        shouldScrollMore: this.state.messages.length < response.data.data.total ,
                    })
                }

                return Promise.resolve()
            }
        } catch (e) {
            this.setState({
                loading:false,
            })
            console.log("Error>>>", e)
        }
    }

    initializeChatWithUser() {
        let socketObj = getNewSocket()
        const userType = JSON.parse(getData('USER_TYPE'));

        socketObj.auth = {
            user_id: this.state.user_id,
            chat_type: userType === 1 ? ChatType.CHAT_TYPE_PATIENT_TO_SUPPORT : ChatType.CHAT_TYPE_DOC_TO_SUPPORT,
            receiver_id: this.props.receiver_id,
            conversation_id: ''
        };
        socketObj.connect();

        socketObj.on("connect", () => {
            console.log("socket connected>>>")
        })
        socketObj.on("onConversation", ({conversation_id, room_id}) => {
            this.setState({room_id: room_id})
            // attach the session ID to the next reconnection attempts
            socketObj.auth = {...socketObj.auth, conversation_id};
            // store it in the localStorage
            localStorage.setItem("conversation_id", conversation_id);
            socketObj.room_id = room_id;
        });

        socketObj.on('onNewMessage', data => {
            console.log('onNewMessage>>>>', data);
            let messages = JSON.parse(JSON.stringify(this.state.messages))
            messages.push(data)
            this.setState({
                messages: messages,
            })
        });


        socketObj.on('disconnect', response => {
            console.log("disconnected>>>>")
        });

        this.setState({socketObj: socketObj})
    }

    sendMessage() {
        if (this.state.socketObj && this.state.text !== '') {
            console.log("Sending Message>>>", this.state.text)

            let finalMessage = {
                message: this.state.text,
                sender: {_id: this.state.user_id, name: this.state.user_id, avatar: ""},
                created_at: moment().utc().toDate()
            }
            this.state.socketObj.emit("sendMessage", finalMessage);
            let messages = this.state.messages;
            messages.push(finalMessage);
            this.setState({text: "", messages: messages}, () => this.refs.messageList.scrollToBottom())
        }

    }

    handleTextChange(e) {
        this.setState({text: e.target.value})
    }

    componentWillUnmount() {
        let socketObj = this.state.socketObj
        if (socketObj) {
            socketObj.off("onConversation")
            socketObj.off("onNewMessage")
            socketObj.off("connect")
            socketObj.off("disconnect")
            socketObj.disconnect()
        }
        document.body.classList.remove('chat-page');
    }

    render() {
        return (
            <div className="chat-cont-right">
                <div className="chat-header">
                    HealthUno Healthcare India Pvt Ltd.
                    <div className="media">
                        <div className="media-img-wrap">
                            <div className="avatar avatar-online">
                            </div>
                        </div>
                        <div className="media-body">
                        </div>
                    </div>
                </div>
                <MessageList ref="messageList" messages={this.state.messages} user_id={this.state.user_id}
                             loadMessagesForUser={this.loadMessagesForUser} pageId={this.state.pageId} shouldScrollMore={this.state.shouldScrollMore} loadingChatIndicator={this.state.loading}/>
                <div className="chat-footer">
                    <div className="message-type">
                        <form>
                            <input type="text" value={this.state.text} placeholder="Type something"
                                   onChange={(e) => this.handleTextChange(e)}/>
                            <button onClick={(e) => {
                                e.preventDefault();
                                this.sendMessage()
                            }}>
                                send <Image className="vector" src={send}/>
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        );
    }
}

export default MessagePane;
