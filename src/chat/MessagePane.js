import React, {Component} from 'react';
import {ChatType, getNewSocket} from "./SocketManager";
import MessageList from "./MessageList";
import { API, post } from '../api/config/APIController';
import { getData } from '../storage/LocalStorage/LocalAsyncStorage';
import { send } from '../constants/PatientImages';
import { Image } from 'react-bootstrap';

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
        }
    }

    getRoomId = () => {
        const compare = this.state.user_id.localeCompare(this.props.receiver_id)
        if (compare < 0) {
            return  this.state.user_id +"_" +this.props.receiver_id;
        } else if (compare > 0) {
            return  this.state.receiver_id +"_" +this.props.user_id;
        }
    }


    async componentDidMount() {
        document.body.classList.add('chat-page');
        this.initializeChatWithUser()
        try {
            console.log('GETMESSAGES');
            post(API.GETMESSAGES, { room_id: this.getRoomId()}).then(response => {

                if (response.status === 200) {
                    console.log('response: ', response);
                    this.setState({messages: response.data.data.docs.reverse()})
                  } else {
                    // addToast(response.data.message, { appearance: 'error' });
                  }

            })
            .catch(error => {
                console.log('error:post ', error);
            // addToast(error.response.data.message, { appearance: 'error' });
            });
        } catch (e) {
            console.log("Error>>>", e)
        }
    }

    initializeChatWithUser() {
        let socketObj = getNewSocket()
        const userType = JSON.parse(getData('USER_TYPE'));

        socketObj.auth = {
            user_id: this.state.user_id,
            chat_type: userType === 1 ?ChatType.CHAT_TYPE_PATIENT_TO_SUPPORT: ChatType.CHAT_TYPE_DOC_TO_SUPPORT,
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
                created_at: new Date().toDateString()
            }
            this.state.socketObj.emit("sendMessage", finalMessage);
            let messages = this.state.messages;
            messages.push(finalMessage);
            this.setState({text: "", messages: messages})
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
                <MessageList messages={this.state.messages} user_id={this.state.user_id}/>
                <div className="chat-footer">
                     <div className="message-type">
                    <form>
                      <input type="text" value={this.state.text} placeholder="Type something" onChange={(e) => this.handleTextChange(e)}/>
                      <button onClick={(e) => {
                                e.preventDefault();
                                this.sendMessage()
                            }}>
                        send <Image className="vector" src={send}  />
                      </button>
                    </form>
                  </div>

                </div>
            </div>
        );
    }
}

export default MessagePane;
