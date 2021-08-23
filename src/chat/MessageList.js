import React, {Component} from 'react';

class MessageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: props.messages || [],
        }
    }

    componentDidMount() {
        document.body.classList.add('chat-page');

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            messages: nextProps.messages,
        });
    }

    componentWillUnmount() {
        document.body.classList.remove('chat-page');
    }

    render() {
        return (
            <div className="chat-body">
                <div className="chat-scroll">
                    <ul className="list-unstyled">
                        {this.state.messages.map(message => {
                            return (
                                <li className={message.fromSelf ? "media sent" : "media received"}>
                                    {message.sender.dp && message.sender.dp !== "" && <div className="avatar">
                                        <img src={message.sender.dp} alt="User" className="avatar-img rounded-circle"/>
                                    </div>}
                                    <div className="media-body">
                                        <div className="msg-box">
                                            <div>
                                                <p>{message.message}</p>
                                                
                                            </div>
                                        </div>
                                        <ul className="chat-msg-info">
                                                    <li>
                                                        <div className="chat-time">
                                                            <span>{message.created_at}</span>
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
