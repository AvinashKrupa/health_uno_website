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
  }, [stream, localVideo]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <video className="meeting-window" ref={localVideo} autoPlay />
    </div>
  );
};

const VideoMeeting = (props) => {
  useEffect(() => {
    getDoctorDetails();
    return () => {};
  }, [props.match.params.doctor_id]); // eslint-disable-line react-hooks/exhaustive-deps
  let [appointmentDetail, setAppointmentDetail] = useState([]);
  let [havePermissions, setHavePermissions] = useState(false);
  let [renderTestButtons, setRenderTestButtons] = useState(false);
  let [micStatus, setMicStatus] = useState(false);
  let [videoStatus, setVideoStatus] = useState(false);
  const [streams, setStreams] = useState([]);
  const [tracks, setTracks] = useState([]);
  let [meetingError, setMeetingError] = useState("");
  let [timerSeconds, setTimerSeconds] = useState(0);
  const [enableMeetingButton, setEnableMeetingButton] = useState(false);
  const { addToast } = useToasts();
  const [doctorDetails, setDoctorDetails] = useState();

  useEffect(() => {
    canJoinAppointmentDetails();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (streams.length) {
        handleBack();
      }
    };
  }, [streams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getAppointmentDetail();
    return () => {};
  }, [props.location?.state?.appointment_id]); // eslint-disable-line react-hooks/exhaustive-deps

  function getAppointmentDetail() {
    let params = {
      appointment_id: props.location?.state?.appointment_id,
    };
    post(API.APPOINTMENT_DETAIL_API, params)
      .then((response) => {
        if (response.status === 200) {
          setAppointmentDetail(response.data.data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function joinAppointment() {
    post(
      API.JOIN_APPOINTMENT,
      { appointment_id: props.location?.state?.appointment_id },
      true
    )
      .then((response) => {
        if (response.status === 200) {
          window.open(response.data.data.meeting_url);
          setTimeout(() => getAppointmentDetail(), 5000);
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
    post(
      API.CAN_JOIN_APPOINTMENT,
      { appointment_id: props.location?.state?.appointment_id },
      true
    )
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
    post(
      API.END_APPOINTMENT,
      { appointment_id: props.location?.state?.appointment_id },
      true
    )
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
    props.history.goBack();
  }

  function openMeeting() {
    if (!props.location?.state?.appointment_id) {
      addToast(
        "Please go back on appointment page and again join the meeting ",
        {
          appearance: "error",
        }
      );
      return;
    }
    joinAppointment();
  }

  function handleEnableButton() {
    setEnableMeetingButton(true);
  }

  useEffect(() => {
    stopVideo();
  }, [videoStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    stopMic();
  }, [micStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getDoctorDetails();
    return () => {};
  }, [props.match.params.doctor_id]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleBack = () => {
    if (streams.length) {
      streams[0].getTracks().forEach(function (track) {
        track.stop();
      });
      setTracks([]);
      setStreams([]);
      setRenderTestButtons(false);
    }
    props.history.push('/patient/appointments');
  };

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
          <Row>
            <button className="video-meeting-back-button-text">
              <Image
                src={back_icon}
                alt="back_icon-Image"
                onClick={() => handleBack()}
              ></Image>
              <span>&nbsp;&nbsp;Appointments Details</span>
            </button>
          </Row>
          <Row className="video-meeting-content">
            <Col md={10} sm={10} xs={10} lg={5}>
              <Row>
                {!renderTestButtons && (
                  <div className="meeting-image">
                    <Image
                      src={doctorDetails.dp}
                      alt="Patient Image"
                      className="meeting-window"
                    />
                  </div>
                )}
                {renderTestButtons && (
                  <div className="meeting-test-window">
                    <div className="meeting-window">
                      {streams.map((s) => (
                        <Video stream={s} />
                      ))}
                    </div>
                  </div>
                )}
              </Row>
              <Row>
                <a
                  href="javascript:void(0)"
                  className="meeting-help-text"
                  onClick={() => {
                    props.history.push({
                      pathname: `/patient/profile/support`,
                      state: {
                        appointment_id: props.location?.state?.appointment_id,
                      },
                    });
                  }}
                >
                  <Image src={help} alt="help circle" />
                  &nbsp; &nbsp;Need Help?
                </a>
              </Row>
            </Col>
            <Col md={12} sm={12} xs={10} lg={5}>
              {renderTestButtons && (
                <div className="meeting-details">
                  <Row style={{ marginTop: "5%" }}>
                    <button
                      className="meeting-mic-btn"
                      onClick={() => setMicStatus(!micStatus)}
                    >
                      {!micStatus && (
                        <>
                          <img src={mic_on_icon} />
                          <span>Mic is On</span>
                        </>
                      )}
                      {micStatus && (
                        <>
                          <img src={mic_off_icon} />
                          <span>Mic is Off</span>
                        </>
                      )}
                    </button>
                  </Row>
                  <Row>
                    <button
                      className="meeting-camera-btn"
                      onClick={() => setVideoStatus(!videoStatus)}
                    >
                      {videoStatus && (
                        <>
                          <img src={camera_off_icon} />
                          <span>Camera is Off</span>
                        </>
                      )}
                      {!videoStatus && (
                        <>
                          <img src={camera_on_icon} />
                          <span>Camera is On</span>
                        </>
                      )}
                    </button>
                  </Row>
                  <Row style={{ marginTop: "20%" }}>
                    <Col>
                      <button
                        className="meeting-btn-white"
                        onClick={() => {
                          handleBack();
                        }}
                      >
                        Cancel
                      </button>
                    </Col>
                    <Col>
                      <button
                        className="meeting-btn-blue"
                        disabled={
                          !(
                            enableMeetingButton ||
                            appointmentDetail.status === "ongoing"
                          )
                        }
                        onClick={() => openMeeting()}
                      >
                        Join meeting
                      </button>
                    </Col>
                  </Row>
                </div>
              )}
              {!renderTestButtons && (
                <div className="meeting-details">
                  <Row>
                    <span className="meeting-text">Meeting with</span>
                  </Row>
                  <Row>
                    <span className="meeting-doctor-speciality">
                      {doctorDetails.specialities[0]}
                    </span>
                  </Row>
                  <Row>
                    <span className="meeting-doctor-name">{`Dr ${doctorDetails.first_name} ${doctorDetails.last_name}`}</span>
                  </Row>
                  <Row>
                    <span className="meeting-doctor-information">{`${doctorDetails.city}, ${doctorDetails.country} | ${doctorDetails.exp} Y Exp`}</span>
                  </Row>
                  <Row>
                    <div className="meeting-timer">
                      {appointmentDetail.status !== "completed" && (
                        <div>
                          {timerSeconds && (
                            <MeetingTimer
                              date={Date.now() + timerSeconds}
                              handleEnableButton={handleEnableButton}
                            ></MeetingTimer>
                          )}
                        </div>
                      )}
                    </div>
                  </Row>
                  <Row>
                    <Col>
                      {console.log("status", appointmentDetail.status)}
                      
                        <button
                          className="meeting-btn-white"
                          onClick={() => checkPermissions()}
                        >
                          Test audio and video
                        </button>
                      </Col>
                      <Col>
                      {appointmentDetail.status === "ongoing" ? (
                        <button
                          className="meeting-btn-blue"
                          onClick={() => openMeeting()}
                        >
                          Join meeting
                        </button>) : (
                          <button
                          className="meeting-btn-blue"
                          disabled={
                            !(
                              enableMeetingButton ||
                              appointmentDetail.status === "ongoing"
                            )
                          }
                          onClick={() => openMeeting()}
                        >
                          Join meeting
                        </button>
                      )}
                    </Col>
                  </Row>
                </div>
              )}
            </Col>
          </Row>
        </Row>
      )}
    </>
  );
};

export default VideoMeeting;
