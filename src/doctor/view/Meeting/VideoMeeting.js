import {help, meeting} from "../../../constants/PatientImages";
import {Button, Col, Image, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";
import {API, post} from "../../../api/config/APIController";
import {back_icon, camera_off_icon, mic_on_icon} from "../../../constants/DoctorImages";

const VideoMeeting = (props) => {
    let [appointmentDetail, setAppointmentDetail] = useState([]);
    let [havePermissions, setHavePermissions] = useState(false);
    let [renderTestButtons, setRenderTestButtons] = useState(false);

    useEffect(() => {
        getAppointmentDetail();
        return () => {
        };
    }, [props.match.params.appointment_id]);

    const {addToast} = useToasts();

    function checkPermissions() {
        const permissions = navigator.mediaDevices.getUserMedia({audio: true, video: true})
        permissions.then((stream) => {
            addToast('Permission has been granted to use Mic and Camera', {appearance: 'success'})
            setHavePermissions(true)
            setRenderTestButtons(true)
        })
            .catch((err) => {
                setHavePermissions(false)
                addToast('Permission denied to use Mic and Camera', {appearance: "error"});
            });
    }

    function getAppointmentDetail() {
        let params = {
            appointment_id: props.match.params.appointment_id,
        };
        post(API.APPOINTMENT_DETAIL_API, params)
            .then(response => {
                if (response.status === 200) {
                    setAppointmentDetail(response.data.data);
                } else {
                    addToast(response.data.message, {appearance: "error"});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: "error"});
            });
    }

    return (
        <>
            {appointmentDetail &&
            <Row>
                <Col lg='1' sm='1' xs='1'/>
                <Col lg="10" sm="10" xs='10'>
                    <Row className='back-navigation'>
                        <div className="back-nav-container">
                            <img src={back_icon} alt='back_icon-img' onClick={() => props.history.goBack()}></img>
                            <span>Appointments Details</span>
                        </div>
                    </Row>
                    <div className="doctor-meeting-page-container">
                        <div className="doctor-meeting-page-video-container">
                            <Image
                                src={meeting}
                                alt="Patient Image"
                                className="meeting-video"
                            />
                            <div className="doctor-meeting-page-help">
                                <Image
                                    src={help}
                                    alt="Help Circle"
                                    className="doctor-meeting-need-help-button"
                                    style={{marginRight: "16px"}}
                                />
                                Need Help?
                            </div>
                        </div>
                        <div className="doctor-meeting-page-column-content">
                            <div className='doctor-meeting-patient-info-container'>
                                {renderTestButtons && <div className="meeting-testing-button-container">
                                    <Button className="testing-button">
                                        <img className="testing-icon" src={mic_on_icon}/>Mic is On
                                    </Button>
                                    <Button className="testing-button" style={{marginTop: '16px'}}>
                                        <img className="testing-icon" src={camera_off_icon}/>Camera is On
                                    </Button>
                                </div>}
                                {!renderTestButtons && <>
                                    <span className="meeting-with-text">Meeting with</span>
                                    <div className="patient-name">
                                        {`${appointmentDetail?.patient?.user?.first_name} ${appointmentDetail?.patient?.user?.last_name}`}
                                    </div>
                                    <div className="patient-description patient-description-title ">
                                        Purpose: <span
                                        className="patient-description-detail">{appointmentDetail?.reason}</span>
                                    </div>
                                </>
                                }
                            </div>
                            <div className='doctor-meeting-button-container'>
                                <Button className="doctor-meeting-test-button" onClick={() => checkPermissions()}>
                                    Test Video and Audio
                                </Button>
                                <Button className="doctor-meeting-join-meeting-button">
                                    Join Meeting
                                </Button>
                            </div>
                            {renderTestButtons && (<div className="doctor-meeting-cancel-container">
                                <Button className="doctor-meeting-cancel-button"
                                        onClick={() => setRenderTestButtons(false)}>
                                    Cancel
                                </Button>
                            </div>)}
                        </div>
                    </div>
                </Col>
            </Row>
            }
        </>
    );
};

export default VideoMeeting;
