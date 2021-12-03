import React from "react";
import {Button, Col, Container, Row,} from "react-bootstrap";


const PrePage = ({history}) => {
    const userType = localStorage.getItem("USER_TYPE");
    const token = localStorage.getItem("ACCESS_TOKEN");
    if(token){
        if(userType && userType == 1 ){
            history.push("/patient/home");
        }
        else if (userType && userType ==2){
            history.push ("/doctor/home");
        }
    }

    return (
        <div className="landingPrePage">
            <Container>
                <Row className="PrePageDesign">
                    <Col className="no-padding">
                        <div className="boxLeft" onClick={() => history.push(`/doctor/`)}>
                            <div>
                                <img alt='logo' src={process.env.PUBLIC_URL + '/assets/doctor.png'}></img>
                            </div>

                            <div className="boxTextStyle">
                                <h4>Are you a Doctor?</h4>
                                <p>Please select the following button to </p> <p>register as a doctor</p>
                                <Button variant="primary" onClick={() => history.push(`/doctor/`)}>I am a
                                    Doctor</Button>
                            </div>
                        </div>

                    </Col>
                    <Col className="no-padding">
                        <div className="boxRight" onClick={() => history.push(`/patient/`)}>
                            <div>
                                <img alt='logo' src={process.env.PUBLIC_URL + '/assets/patient.png'}></img>
                            </div>
                            <div className="boxTextStyle">
                                <h4>Are you a Patient?</h4>
                                <p>Please select the following button to </p> <p> register as a patient</p>
                                <Button variant="primary" onClick={() => history.push(`/patient/`)}>I am a
                                    Patient</Button>
                            </div>

                        </div>
                    </Col>
                </Row>

            </Container>
        </div>
    );
};

export default PrePage;
