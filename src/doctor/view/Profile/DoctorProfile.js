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
        <div className='form-wizard edit-profile-container'>
            <Row>
                <Col lg="4">
                    <ProfilePictureColumn/>
                </Col>
                <Col lg='6' id="second-page">
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
                <Col lg='2'> </Col>
            </Row>
        </div>

    );
};
export default DoctorProfile;
