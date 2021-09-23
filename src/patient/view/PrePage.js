

import React, { useContext, useState } from "react";
import {
    Container,
    Row,
    Col,
    Dropdown,
    Button,
    DropdownButton,
    FormControl,
    InputGroup,
    Image,
} from "react-bootstrap";


const PrePage = ({history}) => {


    return (
        <div className="landingPrePage">
        <Container>
        <Row className="PrePageDesign">
            <Col>
            <div className="boxLeft">
                <div>
                  <img alt='logo' src={process.env.PUBLIC_URL + '/assets/doctor.png'}></img>
                </div>
                
                <div className="boxTextStyle">
                    <h4>Are you a Doctor?</h4>
                    <p>Please select the following button to </p> <p>register as a doctor</p>
                    <Button variant="primary">I am a Doctor</Button>
                </div>
            </div>
            
            </Col>
            <Col>
            <div className="boxRight">
                <div>
                <img alt='logo' src={process.env.PUBLIC_URL + '/assets/patient.png'}></img>
                </div>
                <div className="boxTextStyle">
                    <h4>Are you a Patient?</h4>
                    <p>Please select the following button to </p> <p> register as a patient</p>
                    <Button variant="primary">I am a Patient</Button>
                </div>

            </div>
            </Col>
        </Row>
        
        </Container>
        </div>
    );
};

export default PrePage;
