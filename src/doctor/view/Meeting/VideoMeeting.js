/* eslint-disable jsx-a11y/anchor-is-valid */
import { help } from "../../../constants/PatientImages";
import { Col, Image, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { API, post } from "../../../api/config/APIController";
import {
  back_icon,
  camera_off_icon,
  camera_on_icon,
  mic_off_icon,
  mic_on_icon,
} from "../../../constants/DoctorImages";
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
  let [appointmentDetail, setAppointmentDetail] = useState([]);
  let [renderTestButtons, setRenderTestButtons] = useState(false);
  let [micStatus, setMicStatus] = useState(false);
  let [videoStatus, setVideoStatus] = useState(false);
  const [streams, setStreams] = useState([]);
  const [tracks, setTracks] = useState([]);
  let [timerSeconds, setTimerSeconds] = useState(0);
  const [enableMeetingButton, setEnableMeetingButton] = useState(false);

  useEffect(() => {
    canJoinAppointmentDetails();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    stopVideo();
  }, [videoStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (streams.length) {
        handleBack();
      }
    };
  }, [streams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    stopMic();
  }, [micStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getAppointmentDetail();
    return () => {};
  }, [props.match.params.appointment_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const { addToast } = useToasts();

  function joinAppointment() {
    post(
      API.JOIN_APPOINTMENT,
      { appointment_id: props.match.params.appointment_id },
      true
    )
      .then((response) => {
        if (response.status === 200) {
          window.open(response.data.data.meeting_url);
          setTimeout(() => getAppointmentDetail(), 5000);
        } else {
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
      { appointment_id: props.match.params.appointment_id },
      true
    )
      .then((response) => {
        if (response.status === 200) {
          setTimerSeconds(response.data.data.seconds * 1000);
          addToast(response.data.message, { appearance: "info" });
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function stopMic() {
    if (tracks.length) {
      tracks[0].enabled = !micStatus;
    }
  }

  function openMeeting() {
    joinAppointment();
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
        setRenderTestButtons(true);
        setStreams([...streams, stream]);
        const tracks = stream.getTracks();
        setTracks(tracks);
      })
      .catch((err) => {
        addToast("Please enable permissions and refresh the page", {
          appearance: "error",
        });
      });
  }

  function getAppointmentDetail() {
    let params = {
      appointment_id: props.match.params.appointment_id,
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

  const handleBack = () => {
    if (streams.length) {
      streams[0].getTracks().forEach(function (track) {
        track.stop();
      });
      setTracks([]);
      setStreams([]);
      setRenderTestButtons(false);
    }
    props.history.push(`/doctor/appointmentDetail/${props.match.params.appointment_id}`);
  };

  function handleEnableButton() {
    setEnableMeetingButton(true);
  }

  return (
    <>
      {appointmentDetail && (
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
                      src={appointmentDetail?.patient?.user?.dp}
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
                  className="meeting-help-text"
                  onClick={() => {
                    props.history.push({
                      pathname: `/doctor/profile/support`,
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
                          <img alt="mic_on" src={mic_on_icon} />
                          <span>Mic is On</span>
                        </>
                      )}
                      {micStatus && (
                        <>
                          <img alt="mic_off" src={mic_off_icon} />
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
                          <img alt="camera_off" src={camera_off_icon} />
                          <span>Camera is Off</span>
                        </>
                      )}
                      {!videoStatus && (
                        <>
                          <img alt="camera_on" src={camera_on_icon} />
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
                        Join Consultation
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
                    <span className="meeting-doctor-name">{`${appointmentDetail?.patient?.user?.first_name} ${appointmentDetail?.patient?.user?.last_name}`}</span>
                  </Row>
                  <Row>
                    <div className="doctor-meeting-page-patient-purpose" style={{marginTop: "1%"}}>
                      Purpose:{" "}
                      <span className="doctor-meeting-page-patient-purpose detail">
                        {appointmentDetail?.reason}
                      </span>
                    </div>
                  </Row>
                  <Row>
                    <div className="video-meeting-timer-container">
                      {appointmentDetail.status !== "completed" && (
                        <div className="meeting-timer-container">
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
                          Join Consultation
                        </button>
                      ) : (
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
                          Join Consultation
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
