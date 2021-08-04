import {doctor} from "../../../constants/DoctorImages";
import { Image, Container, Row } from "react-bootstrap";

const profilePictureColumn = () => {
  return (
    <Container>
      <Row>
        <Image src={doctor} className="profile-picture-image" />
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

export default profilePictureColumn;
