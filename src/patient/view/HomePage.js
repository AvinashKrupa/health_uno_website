import React from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  FormControl,
  InputGroup,
  Button,
  Image,
} from "react-bootstrap";
import backgroundImage from "./../assets/Group.png";
import logo from "./../assets/logo.png";
import Frame from "./../assets/Frame.svg";
import Doctor from "./../assets/Doctor.svg";
import Plant from "./../assets/Plant.svg";
import {H3, H1} from '../CommonComponent/H3'

const Homepage = () => {
  return (
    <Container fluid>
      <Row className='login-container'>
        <Col className='left-nav'>
          <Row>
            <Col lg='10' md='10' sm='12' className="text-container">

              <div className='description'>
                <Image src={Doctor}
                ></Image>
                <div>
                  <H3 text='Book any Doctor you want'></H3>
                  <p>
                    Search doctors based on Speciality, Location, Language
                  </p>
                </div>
              </div>

              <div className='description'>
                <Image src={Frame}
                ></Image>
                <div>
                  <H3 text='Book Virtual Appointment '></H3>
                  <p>
                    Book an online appointment with the consultant of your choice and consult them privately at your own place of choice.
                  </p>
                </div>
              </div>

              <div className='description'>
                <Image src={Plant}
                ></Image>
                <div>
                  <H3 text='Book virtual Appointments with AYUSH doctors'></H3>
                  <p>
                    Book  virtual Appointments with AYUSH doctors and get medicines delivered to your doorstep.
                  </p>
                </div>
              </div>
            </Col>  
            <Col lg='1' md='8' sm='0'></Col>
          </Row>
          <Row className='doctor-image' >
            <Col  lg='1'></Col>
            <Col  lg='8'> <Image src={backgroundImage}></Image></Col>
            <Col  lg='2'></Col>
          </Row>
        </Col>
        <Col className='form'>
          <div>
              <div className='logo'>
                  <Image src={logo}></Image>
              </div>
              <div className='right-nav'>
                <H1 text={'Hello there !'}></H1>
                <H3 text={'Welcome'}></H3>
                <p> Sign in to continue with your mobile number </p>
                <InputGroup size="sm" style={{ maxWidth: "350px" }}>
                  <DropdownButton variant="outline-secondary" title="+91">
                    <Dropdown.Item>+91</Dropdown.Item>
                  </DropdownButton>
                  <FormControl type="number" />
                  <p className="description-small">
                    A 4 digit OTP will be sent through SMS to verify your mobile
                    number
                  </p>
                </InputGroup>
                <Button className="button"> Continue </Button>
              </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Homepage;