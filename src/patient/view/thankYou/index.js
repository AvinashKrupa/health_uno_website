import { Row, Col, Image, Button } from "react-bootstrap";
import thank_you from "../../assets/thank_you-min.png";
import arrow from "../../assets/blackArrow.svg";
import orange_tick from "../../assets/success.png";

const ThankYou = (props) => {
  const { state } = props.location;
  if(!state){
    props.history.push('/')

  }
  return (
      <Row className="thank_you_content">
        <Col>
          <Row>
            <Col>
              <button className="back-button-text ms-5">
                <img
                  src={arrow}
                  alt="back_icon-img"
                  className="back_botton_img mb-2"
                  onClick={() => props.history.push(`/patient/appointments`)}
                ></img>
                <span>Back</span>
              </button>
            </Col>
          </Row>
          <Row className="text-center">
            <Col>
              <Image
                className="thank_you_image"
                alt="confirmation image"
                src={thank_you}
              ></Image>
            </Col>
          </Row>
          <Row className="text-center">
            <Col>
              <Image alt="orange tick" src={orange_tick}></Image>
            </Col>
          </Row>
          <Row className="text-center">
            <span className="thank_you_text_big">Thank You</span>
            <span className="thank_you_text_small">
              Your appointment has been scheduled
            </span>
          </Row>
          <Row className="text-center">
            <Col>
              <Button
                className="view_appointments_button"
                onClick={() => props.history.push("/patient/appointments")}
              >
                View Appointment
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
  );
};

export default ThankYou;
