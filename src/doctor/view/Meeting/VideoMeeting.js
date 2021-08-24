import {meeting, help} from "../../../constants/PatientImages";
import { Row, Col, Button, Image } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { API, post } from "../../../api/config/APIController";
import {back_icon, calendar_blue} from "../../../constants/DoctorImages";

const VideoMeeting = (props) => {
    let [appointmentDetail, setAppointmentDetail] = useState([]);

    useEffect(() => {
        getAppointmentDetail();
        debugger
        return () => {};
    }, [props.match.params.appointment_id]);

const { addToast } = useToasts();

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
        { appointmentDetail &&
          <Row>
            <Col lg='1' sm='1' xs='1' />
              <Col className="meeting-page-column-content-container">
                  <Row className='back-navigation'>
                      <div className="back-nav-container">
                          <img src={back_icon} alt='back_icon-img' onClick={()=>props.history.goBack()}></img>
                          <span>Appointments Details</span>
                      </div>
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
                          <span className="meeting-page-text-patient-name meeting-page-text-doctor-name">
                          {`${appointmentDetail?.patient?.user?.first_name} ${appointmentDetail?.patient?.user?.last_name}`}
                          </span>
                        </Row>
                        <Row>
                            <div className="meeting-page-purpose meeting-page-purpose-title ">
                                Purpose: <span className="meeting-page-purpose-description">{appointmentDetail?.reason}</span>
                            </div>
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
