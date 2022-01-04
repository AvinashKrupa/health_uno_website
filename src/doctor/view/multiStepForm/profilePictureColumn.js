import { useState } from "react";
import {doctor} from "../../../constants/DoctorImages";
import { Image, Container, Row } from "react-bootstrap";
import UploadImage from "../../../commonComponent/Upload";
import ImageUpload from "../../../commonComponent/ImageUpload/ImageUpload";


const ProfilePictureColumn = (props) => {
  const[ image, setImage ]= useState();
 
  const handleImage = (file)=> {
     setImage(file)
     props.setImage(file)
  }

  return (
    <Container>
      <div className="profile-picture">
        <ImageUpload classname="upload-image" getImage={handleImage}/>
        <Image src={image? image :doctor} className="profile-picture-image" />
      </div>
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
