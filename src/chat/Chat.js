import React, {Component} from 'react';
import MessagePane from "./MessagePane";
class Chat extends Component {
    render() {
        return (
            <div>
                <div className="page-wrapper">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-8">
                                <div className="chat-window">
                                    <MessagePane receiver_id={"yatish"} openModal={(id) => this.openModal(id)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
