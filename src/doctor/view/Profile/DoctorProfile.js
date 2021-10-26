import {Col, Row} from "react-bootstrap";
import React,{useState} from "react";
import ProfilePictureColumn from "./EditDoctorProfileColumn";
import EditProfilePage from "./DoctorEditProfile";
import Invite from "../../../patient/view/invite/Invite";
import Chat from "../../../chat/Chat";
import UpdateSchedule from "./UpdateSchedule";
import AboutUs from "../../../commonComponent/AboutUs";
import FAQ from "../../../FAQ";

const DoctorProfile = (props) => {
    const type = props.match.params.type
    const [profilePic,setProfilePic]=useState("");
    const [reloadSideColumn, setReloadSideColumn] = useState(false);


    return (
        <Col lg="11" sm="11" xs="11" >
            <Row>
                <Col lg="2" style={{ marginRight: '20px' }}>
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
                        type === 'faq' && (
                            <FAQ isProfile={true}></FAQ>
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
