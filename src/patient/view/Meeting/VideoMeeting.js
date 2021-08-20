import {meeting, help} from "../../../constants/PatientImages";
import { Row, Col, Button, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { API, post } from "../../../api/config/APIController";
import {Link} from 'react-router-dom'

const VideoMeeting = (props) => {
  useEffect(() => {
    getDoctorDetails();
    return () => {};
}, [props.match.params.doctor_id]);

const { addToast } = useToasts();
const [doctorDetails, setDoctorDetails] = useState();

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
                <Row className='back-navigation'>
                  <Link to='/patient/appointments'><i class="fas fa-arrow-left"></i><span>Appointment Details</span></Link>
                </Row>
                <Row className="meeting-page-content-wrapper-container">
                  <Col className="meeting-page-column-image">
                    <Image
                      src={meeting}
                      alt="Patient Image"
                      className="meeting-page-patient-image"
                    />
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
                    <Row style={{ marginTop: "13px" }}>
                      <div className='meeting-detail-text' >
                        <Row>
                          <span className="meeting-page-text-grey">Meeting with</span>
                        </Row>
                        <Row>
                          <span className="meeting-page-text-speciality">
                            Heart Specialist
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
                      <Row className='meeting-button'>
                          <Button className="meeting-page-button-white">
                            Test Video and Audio
                          </Button>
                          <Button className="meeting-page-button-blue">
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