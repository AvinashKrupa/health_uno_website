import React, {Component} from 'react';
import MessagePane from "./MessagePane";
class Chat extends Component {
    render() {
        return (
            <div style={{marginTop: '70px'}}>
                <div className="page-wrapper">
                    <div className="container-fluid">
                        <div className="row">
                            <div>
                                <div className="chat-window">
                                        <MessagePane receiver_id={"612363d240eef4f51b11e4de"} openModal={(id) => this.openModal(id)}/>
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
