import {help, meeting} from "../../../constants/PatientImages";
import {Button, Col, Image, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";
import {API, post} from "../../../api/config/APIController";
import {back_icon, camera_off_icon, camera_on_icon, mic_off_icon, mic_on_icon} from "../../../constants/DoctorImages";
import MeetingTimer from "../../../commonComponent/MeetingTimer";

const Video = ({stream}) => {
    const localVideo = React.createRef();
    useEffect(() => {
        if (localVideo.current) localVideo.current.srcObject = stream;
    }, [stream, localVideo]);

    return (
        <div>
            <video className="meeting-video" ref={localVideo} autoPlay/>
        </div>
    );
};

const VideoMeeting = (props) => {
    let [appointmentDetail, setAppointmentDetail] = useState([]);
    let [havePermissions, setHavePermissions] = useState(false);
    let [renderTestButtons, setRenderTestButtons] = useState(false);
    let [micStatus, setMicStatus] = useState(false);
    let [videoStatus, setVideoStatus] = useState(false);
    const [streams, setStreams] = useState([]);
    const [tracks, setTracks] = useState([]);
    let [timerSeconds, setTimerSeconds] = useState(0);
    let [meetingError, setMeetingError] = useState('');
    const [enableMeetingButton, setEnableMeetingButton] = useState(false);

    useEffect(() => {
        canJoinAppointmentDetails()
    }, []);

    useEffect(() => {
        stopVideo()
    }, [videoStatus]);

    useEffect(() => {
        stopMic()
    }, [micStatus]);

    useEffect(() => {
        getAppointmentDetail();
        return () => {
        };
    }, [props.match.params.appointment_id]);

    const {addToast} = useToasts();

    function joinAppointment() {
        post(API.JOIN_APPOINTMENT, {appointment_id: props.match.params.appointment_id}, true)
            .then((response) => {
                if (response.status === 200) {
                    window.open(response.data.data.meeting_url);
                    setTimeout(() => getAppointmentDetail(), 5000)
                } else {
                    setMeetingError(response.data.message);
                    addToast(response.data.message, {appearance: "error"});
                }
            })
            .catch((error) => {
                addToast(error.response.data.message, {appearance: "error"});
            });
    }

    function canJoinAppointmentDetails() {
        post(API.CAN_JOIN_APPOINTMENT, {appointment_id: props.match.params.appointment_id}, true)
            .then((response) => {
                if (response.status === 200) {
                    setTimerSeconds(response.data.data.seconds * 1000);
                    addToast(response.data.message, {appearance: "info"});
                } else {
                    setMeetingError(response.data.message);
                    addToast(response.data.message, {appearance: "error"});
                }
            })
            .catch((error) => {
                addToast(error.response.data.message, {appearance: "error"});
            });
    }

    function endAppointment() {
        post(API.END_APPOINTMENT, {appointment_id: props.match.params.appointment_id}, true)
            .then((response) => {
                if (response.status === 200) {
                    addToast(response.data.message, {appearance: "success"});
                } else {
                    setMeetingError(response.data.message);
                    addToast(response.data.message, {appearance: "error"});
                }
            })
            .catch((error) => {
                addToast(error.response.data.message, {appearance: "error"});
            });
        props.history.goBack()

    }

    function stopMic() {
        if (tracks.length) {
            tracks[0].enabled = !micStatus
        }
    }

    function openMeeting() {
        joinAppointment();
    }

    function stopVideo() {
        if (tracks.length) {
            tracks[1].enabled = !videoStatus
        }
    }

    function checkPermissions() {
        const permissions = navigator.mediaDevices.getUserMedia({audio: true, video: true})
        permissions.then((stream) => {
            addToast('Permission has been granted to use Mic and Camera', {appearance: 'success'})
            setHavePermissions(true)
            setRenderTestButtons(true)
            setStreams([...streams, stream]);
            const tracks = stream.getTracks();
            setTracks(tracks)
        })
            .catch((err) => {
                setHavePermissions(false)
                addToast('Please enable permissions and refresh the page', {appearance: "error"});
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

    function handleEnableButton() {
        setEnableMeetingButton(true)
    }

    return (
        <>
            {appointmentDetail &&
            <Row>
                <Col lg='1' sm='1' xs='1'/>
                <Col lg="10" sm="10" xs='10' style={{marginTop: "32px", marginLeft: "30px"}}>
                    <Row className='back-navigation'>
                        <div className="back-nav-container-dr">
                            <img src={back_icon} alt='back_icon-img' onClick={() => props.history.goBack()}></img>
                            <span>Appointments Details</span>
                        </div>
                    </Row>
                    <div className="doctor-meeting-page-container">
                        <div className="doctor-meeting-page-video-container">
                            {!renderTestButtons &&
                            <Image
                                src={appointmentDetail?.patient?.user?.dp}
                                alt="Patient Image"
                                className="meeting-video"
                            />
                            }
                            {renderTestButtons && <div className="meeting-video">
                                {
                                    streams.map(s => <Video stream={s}/>)
                                }
                            </div>}
                            <a href="javascript:void(0)" className="meeting-page-text-below-image" onClick={() => {
                                props.history.push('/doctor/profile/support')
                            }}>
                                <Image
                                    src={help}
                                    alt="Help Circle"
                                    calssName="meeting-page-help-circle"
                                    style={{ marginRight: "16px" }}
                                />
                                Need Help?
                            </a>
                        </div>
                        <div className="doctor-meeting-page-column-content">
                            <div className='doctor-meeting-patient-info-container'>
                                {renderTestButtons && <div className="meeting-testing-button-container">
                                    <Button className="testing-button" onClick={() => setMicStatus(!micStatus)}>
                                        {!micStatus && <><img className="testing-icon"
                                                              src={mic_on_icon}/><span>Mic is On</span></>}
                                        {micStatus && <><img className="testing-icon" src={mic_off_icon}/><span>Mic is Off</span></>}
                                    </Button>
                                    <Button className="testing-button" onClick={() => setVideoStatus(!videoStatus)}
                                            style={{marginTop: '16px'}}>
                                        {videoStatus && <><img className="testing-icon"
                                                               src={camera_off_icon}/><span>Camera is Off</span></>}
                                        {!videoStatus && <><img className="testing-icon" src={camera_on_icon}/><span>Camera is On</span></>}
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
                                    <div className='video-meeting-timer-container'>
                                        {appointmentDetail.status !== "completed" && (
                                            <div className="meeting-timer-container">{timerSeconds &&
                                            <MeetingTimer date={Date.now() + timerSeconds}
                                                          handleEnableButton={handleEnableButton}></MeetingTimer>}</div>)
                                        }
                                    </div>
                                </>
                                }
                            </div>
                            <div className='doctor-meeting-button-container'>
                                {appointmentDetail.status === 'scheduled' && !renderTestButtons &&
                                <Button className="doctor-meeting-test-button" onClick={() => checkPermissions()}>
                                    Test Video and Audio
                                </Button>}
                                {appointmentDetail.status !== "ongoing" &&
                                <Button style={{ marginLeft: '10px' }} disabled={!(enableMeetingButton || appointmentDetail.status === "ongoing")}
                                        className="doctor-meeting-join-meeting-button" onClick={() => openMeeting()}>
                                    Join Meeting
                                </Button>}
                                {appointmentDetail.status === "ongoing" &&
                                <Button className="doctor-meeting-join-meeting-button"
                                        onClick={() => openMeeting()}
                                >
                                    Rejoin Meeting
                                </Button>}
                                {appointmentDetail.status === "ongoing" &&
                                <Button className="doctor-meeting-join-meeting-button"
                                        style={{backgroundColor: '#F15D4A', marginLeft: '10px' }}
                                        onClick={() => endAppointment()}>
                                    End Meeting
                                </Button>}
                            </div>
                            {!!meetingError &&
                            <div style={{textAlign: "center"}} className="error-text">{meetingError}</div>}
                            {appointmentDetail.status === 'scheduled' && renderTestButtons && (
                                <div className="doctor-meeting-cancel-container">
                                    <Button className="doctor-meeting-cancel-button"
                                            onClick={() => {
                                                setStreams([]);
                                                setRenderTestButtons(false)
                                            }}>
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
}
;

export default VideoMeeting;
