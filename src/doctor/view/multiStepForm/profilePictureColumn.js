import { useState } from "react";
import {doctor} from "../../../constants/DoctorImages";
import { Image, Container, Row } from "react-bootstrap";
import UploadImage from "../../../commonComponent/Upload";


const ProfilePictureColumn = (props) => {
  const[ image, setImage ]= useState();
 
  const handleImage = (file)=> {
     setImage(file)
     props.setImage(file)
  }

  return (
    <Container>
      <Row className="profile-picture">
        <Image src={image? image :doctor} className="profile-picture-image" />
        <UploadImage getImage={handleImage}/>
      </Row>
      <Row>
        <span className="profile-picture-text">
          Upload your profile picture
        </span>
      </Row>
      <Row>
        <span className="profile-picture-text-small">
          Dimensions 120px X 120px
        </span>
      </Row>
    </Container>
  );
};

export default ProfilePictureColumn;
