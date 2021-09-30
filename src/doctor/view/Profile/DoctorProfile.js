import {Col, Row} from "react-bootstrap";
import React,{useState} from "react";
import ProfilePictureColumn from "./EditDoctorProfileColumn";
import EditProfilePage from "./DoctorEditProfile";
import Invite from "../../../patient/view/invite/Invite";
import Chat from "../../../chat/Chat";
import UpdateSchedule from "./UpdateSchedule";
import AboutUs from "../../../commonComponent/AboutUs";

const DoctorProfile = (props) => {
    const type = props.match.params.type
    const [profilePic,setProfilePic]=useState("");
    const [reloadSideColumn, setReloadSideColumn] = useState(false);


    return (
        <Col lg="10" sm="10" xs="10" >
            <Row>
                <Col lg="3">
                    <ProfilePictureColumn setProfilePic ={setProfilePic} setReloadSideColumn={setReloadSideColumn} reloadSideColumn={reloadSideColumn}/>
                </Col>
                <Col lg='9' id="second-page">
                    {
                        type === 'editProfile' && (
                            <EditProfilePage profilePic={profilePic} setReloadSideColumn={setReloadSideColumn}></EditProfilePage>
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
