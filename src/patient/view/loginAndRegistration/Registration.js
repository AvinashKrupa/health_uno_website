// import "./RegistrationPage1";
import { Container, Row, Col, Image } from "react-bootstrap";
import patientIcon from "../../assets/patient-form-icon.png";
import RegistrationComponent from "./RegistrationComponent";
import {Link} from 'react-router-dom';
import UploadImage from "../../../commonComponent/Upload"
import { useState } from "react";
import ImageUpload from "../../../commonComponent/ImageUpload/ImageUpload";

const Registration = () => {
    const[ image, setImage ]= useState();
    const handleImage = (file)=>{
    setImage(file)
    }

  return (
    <Container className='registration-container'>
      <Row className='heading'>
        <Link to='/patient/otp'><i class="fas fa-arrow-left"></i><span>Complete Profile</span></Link>
      </Row>
      <Row>
        <Col className="col-md-3">
          <div className="profile-picture">
          <ImageUpload  classname="upload-image" getImage={handleImage}/>
          <Image
          className="profile-picture-image"
            style={{ display: "block", margin: "50px auto ", position: 'relative', height: '160px', width: '160px' }}
            src={ image ? image : patientIcon }
            alt="Icon"
          ></Image>
          </div>

          <div className="text-center">
            <p>Upload your profile picture.</p>
            <p style={{ fontSize: "10px" }}>Dimensions 120px x 120px</p>
          </div>
        </Col>
        <Col className="col-md-8">
          <RegistrationComponent image={image} />
        </Col>
      </Row>
    </Container>
  );
};
export default Registration;
