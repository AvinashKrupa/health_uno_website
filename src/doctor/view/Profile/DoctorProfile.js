import {Col, Row} from "react-bootstrap";
import React from "react";
import ProfilePictureColumn from "./EditProfilePictureColumn";
import EditProfilePage from "./DoctorEditProfile";
import Invite from "../../../patient/view/invite/Invite";
import Chat from "../../../chat/Chat";
import UpdateSchedule from "./UpdateSchedule";
import AboutUs from "../../../commonComponent/AboutUs";

const DoctorProfile = (props) => {
    const type = props.match.params.type

    return (
        <Col lg="10" sm="10" xs="10" >
            <Row>
                <Col lg="3">
                    <ProfilePictureColumn/>
                </Col>
                <Col lg='9' id="second-page">
                    {
                        type === 'editProfile' && (
                            <EditProfilePage></EditProfilePage>
                        )
                    }
                    {
                        type === 'updateSchedule' && (
                            <UpdateSchedule></UpdateSchedule>
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
                        type === 'about' && (
                            <AboutUs></AboutUs>
                        )
                    }
                </Col>
            </Row>
        </Col>
    );
};
export default DoctorProfile;
