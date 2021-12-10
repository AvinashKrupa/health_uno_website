
import { Col, Row } from "react-bootstrap";
import React, {useState, useEffect} from "react";
import ProfilePictureColumn from "./EditPatientProfileColumn";
import { getData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import PatientEditProfile from "./PatientEditProfile";
import Invite from "../invite/Invite";
import UploadReport from "./UploadReport";
import Chat from "../../../chat/Chat";
import FAQ from '../../../FAQ/PatientFAQ'
import AboutUs from "../../../commonComponent/AboutUs";
import TermsAndCondition from "../../../commonComponent/TermsandConditions";


const PatientProfile = (props) => {
    useEffect( () => {
        const accessToken = getData('ACCESS_TOKEN');
        if (!accessToken) {
            props.history.push(`/`);
            return;
        }
    }, []);
    const type = props.match.params.type;
    const [reloadSideColumn, setReloadSideColumn] = useState(false);

    const userInfo = JSON.parse(getData('userInfo'));
    const additionalInfo = JSON.parse(getData('additional_info'));
    return (
        <Col lg="11" sm="11" xs="11" >
            <Row>
                <Col lg="2">
                    <ProfilePictureColumn img={userInfo?.dp}  doctorName={`${userInfo?.first_name} ${userInfo?.last_name}`} userId={additionalInfo?.huno_id} doctorMobile={userInfo?.mobile_number}
                                          setReloadSideColumn={setReloadSideColumn} reloadSideColumn={reloadSideColumn}/>
                </Col>
                <Col lg="9" id="second-page">
                    {
                        type === 'editProfile' && (
                            <PatientEditProfile setReloadSideColumn={setReloadSideColumn}></PatientEditProfile>
                        )
                    }
                    {
                        type === 'invite' && (
                            <Invite huno_id={additionalInfo?.huno_id}></Invite>
                        )
                    }
                    {
                        type === 'support' && (
                            <Chat></Chat>
                        )
                    }
                    {
                        type === 'terms' && (
                            <TermsAndCondition></TermsAndCondition>
                        )
                    }
                    {
                        type === 'faq' && (
                            <FAQ isProfile={true}></FAQ>
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
