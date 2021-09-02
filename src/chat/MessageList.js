import moment from 'moment';
import React, {Component} from 'react';
import { getData } from '../storage/LocalStorage/LocalAsyncStorage';

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: props.messages || [],
            user_id: props.user_id
        }
    }

    componentDidMount() {
        document.body.classList.add('chat-page');
        this.scrollToBottom()

    }
    componentDidUpdate() {
        this.scrollToBottom()

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            messages: nextProps.messages,
        });
    }

    componentWillUnmount() {
        document.body.classList.remove('chat-page');
    }

    scrollToBottom = () => {
        const {messageList} = this.refs;
        messageList.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }

    render() {
        console.log('this.state.messages', this.state.messages);
        return (
            <div className="chat-body">
                <div className="chat-scroll">
                    <ul className="list-unstyled" ref={"messageList"}>
                        {this.state.messages.map(message => {
                            return (
                                <li key={message._id} className={message.sender._id === this.state.user_id ? "media sent" : "media received"}>
                                    <div className="media-body">
                                        <div className="msg-box">
                                            <div>
                                                <p>{message.message}</p>

                                            </div>
                                        </div>
                                        <ul className="chat-msg-info">
                                            <li>
                                                <div className="chat-time">
                                                    <span>{moment(message.created_at).format('LT')}</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default MessageList;
