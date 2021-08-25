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
              <Col lg="10" sm="10" xs='10'>
                  <Row className='back-navigation'>
                      <div className="back-nav-container">
                          <img src={back_icon} alt='back_icon-img' onClick={()=>props.history.goBack()}></img>
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
                                style={{ marginRight: "16px" }}
                            />
                            Need Help?
                        </div>
                    </div>


                  <div className="doctor-meeting-page-column-content">
                    {/*<Row style={{ marginTop: "13px" }}>*/}
                      <div className='' >
                          <span className="meeting-with-text">Meeting with</span>
                          <div className="patient-name">
                          {`${appointmentDetail?.patient?.user?.first_name} ${appointmentDetail?.patient?.user?.last_name}`}
                          </div>
                            <div className="patient-description patient-description-title ">
                                Purpose: <span className="patient-description-detail">{appointmentDetail?.reason}</span>
                            </div>
                      </div>
                      <div className='doctor-meeting-button-container'>
                          <Button className="doctor-meeting-test-button">
                            Test Video and Audio
                          </Button>
                          <Button className="doctor-meeting-join-meeting-button">
                            Join Meeting
                          </Button>
                      </div>
                    {/*</Row>*/}
                  </div>
                </div>
              </Col>
          </Row>
        }
    </>
  );
};

export default VideoMeeting;
