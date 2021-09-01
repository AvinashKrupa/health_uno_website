import React, {Component} from 'react';
import Iframe from "react-iframe";

class AboutUs extends Component {
    render() {
        return (
            <div className="about-us-container">
                <Iframe url="https://healthuno.com/#s"
                        width="100%"
                        height="100%"
                        id="about-us-iframe"
                        loading="eager"
                />
            </div>
        );
    }
}

export default AboutUs;
