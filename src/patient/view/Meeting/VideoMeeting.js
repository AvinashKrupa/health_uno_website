import {meeting, help, blackArrow} from "../../../constants/PatientImages";
import { Row, Col, Button, Image } from "react-bootstrap";

const VideoMeeting = () => {
  return (
    <>
      <Row>
      <Col lg='1' sm='1' xs='1' />
        <Col className="meeting-page-column-content-container">
          <Row>
            <span className="meeting-page-text-heading">
              <Image
                src={blackArrow}
                alt="Left Arrow"
                className="meeting-page-left-arrow"
                style={{ marginRight: "16px", marginLeft: "24px" }}
              />
              Appointment Details
            </span>
          </Row>
          <Row className="meeting-page-content-wrapper-container">
            <Col className="meeting-page-column-image">
              <Image
                src={meeting}
                alt="Patient Image"
                className="meeting-page-patient-image"
              />
              <p className="meeting-page-text-below-image">
                <Image
                  src={help}
                  alt="Help Circle"
                  calssName="meeting-page-help-circle"
                  style={{ marginRight: "16px" }}
                />
                Need Help?
              </p>
            </Col>
            <Col className="meeting-page-column-content">
              <Row style={{ marginTop: "13px" }}>
                <Row>
                  <span className="meeting-page-text-grey">Meeting with</span>
                </Row>
                <Row>
                  <span className="meeting-page-text-speciality">
                    Heart Specialist
                  </span>
                </Row>
                <Row>
                  <span className="meeting-page-text-doctor-name">
                    Dr Earl Dasen
                  </span>
                </Row>
                <Row>
                  <span className="meeting-page-text-doctor-info">
                    Texas, USA | 6 Y Exp
                  </span>
                </Row>
                <Row>
                  <Col>
                    <Button className="meeting-page-button-white">
                      Test Video and Audio
                    </Button>
                  </Col>
                  <Col>
                    <Button className="meeting-page-button-blue">
                      Join Meeting
                    </Button>
                  </Col>
                </Row>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default VideoMeeting;