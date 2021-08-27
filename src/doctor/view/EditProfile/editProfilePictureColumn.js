import {doctor} from "../../../constants/DoctorImages";
import {Col, Container, Image, Row} from "react-bootstrap";
import React from "react";

const editProfilePictureColumn = (props) => {
    return (
        <Container className="profile-left-Column">
            <Row>
                <h2 className="profile-tile-text">Profile</h2>
            </Row>
            <Row>
                <Image src={doctor} className="profile-picture-image"/>
            </Row>
            <Row className="profile-container">
                <Col lg="10">
                    <span className="doctor-name">Dr {props.doctorName}</span>
                </Col>
                <Col lg="10">
                    <span className="doctor-detail">+91 - {props.doctorMobile} | Id: #{props.doctorId}</span>
                </Col>
                <Col lg="12">




                    <div style={{
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "space-between",
                        marginLeft: '10%',
                        marginRight: '10%'
                    }}>
                        <div className="doctor-appointment-count-container">
                            <Row className="doctor-detail-appointment">
                                <div>Completed Appointments</div>

                            </Row>
                            <Row className="doctor-detail-appointment-count">
                                <div>{props.appointmentStats.completed}</div>
                            </Row>
                        </div>
                        <div className="doctor-appointment-count-container">
                            <Row className="doctor-detail-appointment">
                                <div>Scheduled Appointment</div>
                            </Row>
                            <Row className="doctor-detail-appointment-count">
                                <div>{props.appointmentStats.scheduled}</div>
                            </Row>
                        </div>






                    </div>
                    {/*<div style={{*/}
                    {/*    flexDirection: "row",*/}
                    {/*    display: "flex",*/}
                    {/*    justifyContent: "space-between",*/}
                    {/*    marginLeft: '20%',*/}
                    {/*    marginRight: '20%'*/}
                    {/*}}>*/}
                    {/*    */}
                    {/*    */}
                    {/*</div>*/}

                </Col>
            </Row>
            <Row>
            </Row>
        </Container>
    );
};

export default editProfilePictureColumn;
