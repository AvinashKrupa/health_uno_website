import React, {Component} from 'react';
import Iframe from "react-iframe";

class ReferInvite extends Component {
    render() {
        return (
            <div className="refer-invite-container">
                <Iframe url={`${process.env.REACT_APP_BASE_URL}refer_invite`}
                        width="100%"
                        height="100%"
                        id="about-us-iframe"
                        loading="eager"
                />
            </div>
        );
    }
}

export default ReferInvite;
