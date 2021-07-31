// import "./RegistrationPage1";
import { Container, Row, Col, Image } from "react-bootstrap";
import patientIcon from "../assets/patient-form-icon.png";
import RegistrationComponent from "./RegistrationComponent";
import {Link} from 'react-router-dom';

const Registration = () => {
  return (
    <Container className='registration-container'>
      <Row className='heading'>
        <Link to='/otp'><i class="fas fa-arrow-left"></i><span>Complete Profile</span></Link>
      </Row>
      <Row>
        <Col className="col-md-3">
          <Image
            style={{ display: "block", margin: "0 auto", position: 'relative' }}
            src={patientIcon}
            alt="Icon"
          ></Image>
          <i className="fas fa-camera"></i>
          <div className="text-center">
            <p>Upload your profile picture.</p>
            <p style={{ fontSize: "10px" }}>Dimensions 120px x 120px</p>
          </div>
        </Col>
        <Col className="col-md-8">
          <RegistrationComponent />
        </Col>
      </Row>
    </Container>
  );
};
export default Registration;