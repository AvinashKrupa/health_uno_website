
import { Col, Row } from "react-bootstrap";
import React from "react";
import ProfilePictureColumn from "./EditPatientProfileColumn";
import { getData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import PatientEditProfile from "./PatientEditProfile";
import Invite from "../invite/Invite";
import UploadReport from "./UploadReport";
import Chat from "../../../chat/Chat";


const PatientProfile = (props) => {
    console.log('props: ', props);
    const type = props.match.params.type

    const userInfo = JSON.parse(getData('userInfo'));
    return (
        <Col lg="10" sm="10" xs="10" >
            <Row>
                <Col lg="3">
                    <ProfilePictureColumn doctorName={`${userInfo.first_name} ${userInfo.last_name}`} doctorId={'22'} doctorMobile={userInfo.mobile_number} />
                </Col>
                <Col lg="9">
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
                </Col>
            </Row>
        </Col>

    );
};
export default PatientProfile;
