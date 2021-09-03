import {meeting, help} from "../../../constants/PatientImages";
import { Row, Col, Button, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { API, post } from "../../../api/config/APIController";
import {Link} from 'react-router-dom'
import { back_icon, camera_off_icon, camera_on_icon, mic_off_icon, mic_on_icon } from "../../../constants/DoctorImages";
import React from "react";

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

    const { addToast } = useToasts();
    const [doctorDetails, setDoctorDetails] = useState();

    useEffect(() => {
            stopVideo()
    }, [videoStatus]);

    useEffect(() => {
        stopMic()
    }, [micStatus]);

    useEffect(() => {
      getDoctorDetails();
        return () => {
        };
    }, [props.match.params.doctor_id]);

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

    function getDoctorDetails() {
      post(API.GET_DOCTOR_DETAILS, {doctor_id: props.match.params.doctor_id, include_similar: true })
      .then(response => {
          if (response.status === 200) {
          setDoctorDetails(response.data.data);
          } else {
          addToast(response.data.message, { appearance: 'error' });
          }
      })
      .catch(error => {
          addToast(error.response.data.message, { appearance: 'error' });
      });
    }

  return (
    <>
        { doctorDetails && 
          <Row>
            <Col lg='1' sm='1' xs='1' />
              <Col className="meeting-page-column-content-container">
                {/* <Row className='back-navigation'>
                  <Link to='/patient/appointments'><i class="fas fa-arrow-left"></i><span>Appointment Details</span></Link>
                </Row> */}
                <button className="back-nav-container back-navigation">
                    <img src={back_icon} alt='back_icon-img' onClick={() =>  props.history.goBack()}></img>
                    <span>Appointments Details</span>
                </button>
                <Row className="meeting-page-content-wrapper-container">
                  <Col className="meeting-page-column-image">
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
                    <Row className='doctor-meeting-patient-info-container'> 
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
                    </Row>
                    <Row style={{ marginTop: "13px" }}>
                    {!renderTestButtons &&
                      <div className='meeting-detail-text' >
                        <Row>
                          <span className="meeting-page-text-grey">Meeting with</span>
                        </Row>
                        <Row>
                          <span className="meeting-page-text-speciality">
                            {doctorDetails.specialities[0]}
                          </span>
                        </Row>
                        <Row>
                          <span className="meeting-page-text-doctor-name">
                          {`Dr ${doctorDetails.first_name}, ${doctorDetails.last_name}`}
                          </span>
                        </Row>
                        <Row>
                          <span className="meeting-page-text-doctor-info">
                          {`${doctorDetails.city}, ${doctorDetails.country} | ${doctorDetails.exp} Y Exp`} 
                          </span>
                        </Row>
                      </div>
}
                      <Row className='meeting-button'>
                      {!renderTestButtons &&
                          <Button className="meeting-page-button-white" onClick={() => checkPermissions()}>
                            Test Video and Audio
                          </Button>
                      }
                      {renderTestButtons && 
                              <Button className="meeting-page-button-white" onClick={() => {
                                            setStreams([]);
                                            setRenderTestButtons(false)
                                        }}>
                              Cancel
                              </Button>
              }
                          <Button className="meeting-page-button-blue" onClick={() => {window.open(`https://dev.healthuno.com:6005/${props.match.params.appointment_id}`)}}>
                            Join Meeting
                          </Button>
                      </Row>
                    </Row>
                    
                  </Col>
                </Row>
              </Col>
          </Row>
        }
    </>
  );
};

export default VideoMeeting;