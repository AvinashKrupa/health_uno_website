import moment from 'moment';
import React, {Component} from 'react';
import { getData } from '../storage/LocalStorage/LocalAsyncStorage';

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: props.messages || [],
        }
    }

    componentDidMount() {
        // document.body.classList.add('chat-page');

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            messages: nextProps.messages,
        });
    }

    componentWillUnmount() {
        // document.body.classList.remove('chat-page');
    }

    render() {
        console.log('this.state.messages', this.state.messages);
        return (
            <div className="chat-body">
                <div className="chat-scroll">
                    <ul className="list-unstyled">
                        {this.state.messages.map(message => {
                            return (
                                <li className={message.sender._id === JSON.parse(getData('userInfo'))._id ? "media sent" : "media received"}>
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
