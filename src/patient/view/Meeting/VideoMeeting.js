import { meeting, help } from "../../../constants/PatientImages";
import { Row, Col, Button, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { API, post } from "../../../api/config/APIController";
import {
  back_icon,
  camera_off_icon,
  camera_on_icon,
  mic_off_icon,
  mic_on_icon,
} from "../../../constants/DoctorImages";
import React from "react";
import MeetingTimer from "../../../commonComponent/MeetingTimer";

const Video = ({ stream }) => {
  const localVideo = React.createRef();
  useEffect(() => {
    if (localVideo.current) localVideo.current.srcObject = stream;
  }, [stream, localVideo]);

  return (
    <div>
      <video className="meeting-video" ref={localVideo} autoPlay />
    </div>
  );
};

const VideoMeeting = (props) => {
  useEffect(() => {
    getDoctorDetails();
    return () => {};
  }, [props.match.params.doctor_id]);
  let [appointmentDetail, setAppointmentDetail] = useState([]);
  let [havePermissions, setHavePermissions] = useState(false);
  let [renderTestButtons, setRenderTestButtons] = useState(false);
  let [micStatus, setMicStatus] = useState(false);
  let [videoStatus, setVideoStatus] = useState(false);
  const [streams, setStreams] = useState([]);
  const [tracks, setTracks] = useState([]);
  let [meetingError, setMeetingError] = useState('');
  let [timerSeconds, setTimerSeconds] = useState(0);
  const [enableMeetingButton, setEnableMeetingButton] = useState(false);

    useEffect(() => {
        canJoinAppointmentDetails()
    }, []);

  useEffect(() => {
        getAppointmentDetail();
        return () => {
        };
    }, [props.location?.state?.appointment_id]);

  const { addToast } = useToasts();
  const [doctorDetails, setDoctorDetails] = useState();

  function getAppointmentDetail() {
    let params = {
      appointment_id: props.location?.state?.appointment_id,
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

  function joinAppointment() {
    post(API.JOIN_APPOINTMENT, {appointment_id:props.location?.state?.appointment_id}, true)
        .then((response) => {
          if (response.status === 200) {
              window.open(response.data.data.meeting_url);
              setTimeout(()=> getAppointmentDetail(), 5000)
          } else {
            setMeetingError(response.data.message);
            addToast(response.data.message, { appearance: "error" });
          }
        })
        .catch((error) => {
          addToast(error.response.data.message, { appearance: "error" });
        });
  }
    function canJoinAppointmentDetails() {
        post(API.CAN_JOIN_APPOINTMENT, {appointment_id:props.location?.state?.appointment_id}, true)
            .then((response) => {
                if (response.status === 200) {
                    setTimerSeconds(response.data.data.seconds * 1000);
                    addToast(response.data.message, { appearance: "info" });
                } else {
                    setMeetingError(response.data.message);
                    addToast(response.data.message, { appearance: "error" });
                }
            })
            .catch((error) => {
                addToast(error.response.data.message, { appearance: "error" });
            });
    }

  function endAppointment() {
    post(API.END_APPOINTMENT, {appointment_id:props.location?.state?.appointment_id}, true)
        .then((response) => {
          if (response.status === 200) {
            addToast(response.data.message, { appearance: "success" });
          } else {
            setMeetingError(response.data.message);
            addToast(response.data.message, { appearance: "error" });
          }
        })
        .catch((error) => {
          addToast(error.response.data.message, { appearance: "error" });
        });
    props.history.goBack()

  }

  function openMeeting(){
      if(!props.location?.state?.appointment_id) {
        addToast("Please go back on appointment page and again join the meeting ", {
          appearance: "error",
        });
        return;
      }
      joinAppointment();
  }

    function handleEnableButton() {
        setEnableMeetingButton(true)
    }

  useEffect(() => {
    stopVideo();
  }, [videoStatus]);

  useEffect(() => {
    stopMic();
  }, [micStatus]);

  useEffect(() => {
    getDoctorDetails();
    return () => {};
  }, [props.match.params.doctor_id]);

  function stopMic() {
    if (tracks.length) {
      tracks[0].enabled = !micStatus;
    }
  }
  function stopVideo() {
    if (tracks.length) {
      tracks[1].enabled = !videoStatus;
    }
  }

  function checkPermissions() {
    const permissions = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    permissions
      .then((stream) => {
        addToast("Permission has been granted to use Mic and Camera", {
          appearance: "success",
        });
        setHavePermissions(true);
        setRenderTestButtons(true);
        setStreams([...streams, stream]);
        const tracks = stream.getTracks();
        setTracks(tracks);
      })
      .catch((err) => {
        setHavePermissions(false);
        addToast("Please enable permissions and refresh the page", {
          appearance: "error",
        });
      });
  }

  function getDoctorDetails() {
    post(API.GET_DOCTOR_DETAILS, {
      doctor_id: props.match.params.doctor_id,
      include_similar: true,
    })
      .then((response) => {
        if (response.status === 200) {
          setDoctorDetails(response.data.data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  return (
    <>
      {doctorDetails && (
        <Row>
          <Col lg="1" sm="1" xs="1" />
          <Col className="meeting-page-column-content-container">
            {/* <Row className='back-navigation'>
                  <Link to='/patient/appointments'><i class="fas fa-arrow-left"></i><span>Appointment Details</span></Link>
                </Row> */}
            <button className="back-nav-container back-navigation">
              <img
                src={back_icon}
                alt="back_icon-img"
                onClick={() => props.history.goBack()}
              ></img>
              <span>Appointments Details</span>
            </button>
            <Row className="meeting-page-content-wrapper-container">
              <Col className="meeting-page-column-image">
                {!renderTestButtons && (
                  <Image
                    src={doctorDetails.dp}
                    alt="Patient Image"
                    className="meeting-video"
                  />
                )}
                {renderTestButtons && (
                  <div className="meeting-video">
                    {streams.map((s) => (
                      <Video stream={s} />
                    ))}
                  </div>
                )}
                <p className="meeting-page-text-below-image">
                  <Image
                    src={help}
                    alt="Help Circle"
                    calssName="meeting-page-help-circle"
                    style={{ marginRight: "16px" }}
                  />
                  Need Help?
                </p>
              </Col>
              <Col className="meeting-page-column-content">
                <Row className="doctor-meeting-patient-info-container">
                  {renderTestButtons && (
                    <div className="meeting-testing-button-container">
                      <Button
                        className="testing-button"
                        onClick={() => setMicStatus(!micStatus)}
                      >
                        {!micStatus && (
                          <>
                            <img className="testing-icon" src={mic_on_icon} />
                            <span>Mic is On</span>
                          </>
                        )}
                        {micStatus && (
                          <>
                            <img className="testing-icon" src={mic_off_icon} />
                            <span>Mic is Off</span>
                          </>
                        )}
                      </Button>
                      <Button
                        className="testing-button"
                        onClick={() => setVideoStatus(!videoStatus)}
                        style={{ marginTop: "16px" }}
                      >
                        {videoStatus && (
                          <>
                            <img
                              className="testing-icon"
                              src={camera_off_icon}
                            />
                            <span>Camera is Off</span>
                          </>
                        )}
                        {!videoStatus && (
                          <>
                            <img
                              className="testing-icon"
                              src={camera_on_icon}
                            />
                            <span>Camera is On</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </Row>
                <Row style={{ marginTop: "13px" }}>
                  {!renderTestButtons && (
                    <div className="meeting-detail-text">
                      <Row>
                        <span className="meeting-page-text-grey">
                          Meeting with
                        </span>
                      </Row>
                      <Row>
                        <span className="meeting-page-text-speciality">
                          {doctorDetails.specialities[0]}
                        </span>
                      </Row>
                      <Row>
                        <span className="meeting-page-text-doctor-name">
                          {`Dr ${doctorDetails.first_name} ${doctorDetails.last_name}`}
                        </span>
                      </Row>
                      <Row>
                        <span className="meeting-page-text-doctor-info">
                          {`${doctorDetails.city}, ${doctorDetails.country} | ${doctorDetails.exp} Y Exp`}
                        </span>
                      </Row>
                        <Row>
                            <div>
                                {appointmentDetail.status !== "completed" && (
                                    <div className="video-meeting-timer-container">{ timerSeconds && <MeetingTimer date={Date.now() + timerSeconds} handleEnableButton={handleEnableButton}></MeetingTimer> }</div>)
                                }
                            </div>
                        </Row>
                    </div>
                  )}
                  <Row className="meeting-button" xs="2">
                      {appointmentDetail.status === 'scheduled' && !renderTestButtons && (
                        <Button
                          className="meeting-page-button-white"
                          onClick={() => checkPermissions()}
                        >
                          Test Video and Audio
                        </Button>
                      )}
                      {appointmentDetail.status === 'scheduled' && renderTestButtons && (
                        <Button
                          className="meeting-page-button-white"
                          onClick={() => {
                            setStreams([]);
                            setRenderTestButtons(false);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                      {appointmentDetail.status !=="ongoing" &&  <Button disabled={!(enableMeetingButton || appointmentDetail.status ==="ongoing")}  className="meeting-page-button meeting-page-button-blue"
                        onClick={() => openMeeting()}
                      >
                        Join Meeting
                      </Button>}
                      {appointmentDetail.status ==="ongoing" &&  <Button className="meeting-page-button meeting-page-button-blue"
                        onClick={() => openMeeting()}
                      >
                        Rejoin Meeting
                      </Button>}
                      {appointmentDetail.status ==="ongoing" && <Button className="meeting-page-button-red meeting-page-button"
                                                                        onClick={() => endAppointment()}>
                        End Meeting
                      </Button>}
                  </Row>
                  <Row>
                    {!!meetingError && <div style={{textAlign: "center"}} className="error-text">{meetingError}</div>}
                  </Row>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};

export default VideoMeeting;
