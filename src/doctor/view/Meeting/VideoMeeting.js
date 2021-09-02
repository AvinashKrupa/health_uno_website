import {help, meeting} from "../../../constants/PatientImages";
import {Button, Col, Image, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";
import {API, post} from "../../../api/config/APIController";
import {back_icon, camera_off_icon, camera_on_icon, mic_off_icon, mic_on_icon} from "../../../constants/DoctorImages";

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

    function stopMic(){
        if(tracks.length){
            tracks[0].enabled = !micStatus
        }
    }
    function stopVideo(){
        if(tracks.length) {
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
                            {!renderTestButtons &&
                            <Image
                                src={meeting}
                                alt="Patient Image"
                                className="meeting-video"
                            />
                            }
                            {renderTestButtons && <div className="meeting-video">
                                {
                                    streams.map(s => <Video stream={s}/>)
                                }
                            </div>}
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
                                </>
                                }
                            </div>
                            <div className='doctor-meeting-button-container'>
                                {!renderTestButtons && <Button className="doctor-meeting-test-button" onClick={() => checkPermissions()}>
                                    Test Video and Audio
                                </Button>}
                                <Button className="doctor-meeting-join-meeting-button" onClick={() => {window.open(`https://dev.healthuno.com:6005/${props.match.params.appointment_id}`)}}>
                                    Join Meeting
                                </Button>
                            </div>
                            {renderTestButtons && (<div className="doctor-meeting-cancel-container">
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
};

export default VideoMeeting;
