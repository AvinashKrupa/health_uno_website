
import { Col, Row } from "react-bootstrap";
import React from "react";
import ProfilePictureColumn from "./EditPatientProfileColumn";
import { getData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import PatientEditProfile from "./PatientEditProfile";
import Invite from "../invite/Invite";
import UploadReport from "./UploadReport";
import Chat from "../../../chat/Chat";
import AboutUs from "../../../commonComponent/AboutUs";


const PatientProfile = (props) => {
    const type = props.match.params.type

    const userInfo = JSON.parse(getData('userInfo'));
    return (
        <Col lg="10" sm="10" xs="10" >
            <Row>
                <Col lg="2">
                    <ProfilePictureColumn img={userInfo.dp}  doctorName={`${userInfo.first_name} ${userInfo.last_name}`} doctorId={'22'} doctorMobile={userInfo.mobile_number} />
                </Col>
                <Col lg="9" id="second-page">
                    {
                        type === 'editProfile' && (
                            <PatientEditProfile></PatientEditProfile>
                        )
                    }
                    {
                        type === 'invite' && (
                            <Invite></Invite>
                        )
                    }
                    {
                        type === 'support' && (
                            <Chat></Chat>
                        )
                    }
                    {
                        type === 'uploadReport' && (
                            <UploadReport></UploadReport>
                        )
                    }
                    {
                        type === 'about' && (
                            <AboutUs></AboutUs>
                        )
                    }
                </Col>
            </Row>
        </Col>

    );
};
export default PatientProfile;
