import { Card } from "@material-ui/core";
import {icon_man, icon_badge, icon_money} from "../../../constants/PatientImages";
import { Row, Col, Image, InputGroup } from "react-bootstrap";

const ColorCards = (props) => {
  const totalConsultation = props.total_consultations < 10 ? '10': props.total_consultations;
  return (
    <Row>
        <Col lg="4" md='6' sm='6' xs='12'>
            <div className='circle-card-icon'>
                <InputGroup>
                    <div className="color_card_circle" style={{ background: "#b8509e" }} >
                        <Image src={icon_man} />
                    </div>
                </InputGroup>
            </div>
            <Card className="color_card_container_1">
                <Row className='circle-card-content' >
                    <span className="color_card_text_h3">{totalConsultation}</span>
                    <span className="color_card_text_h4">Consultations</span>
                </Row>
            </Card>
        </Col>

        <Col lg="4" md='6' sm='6' xs='12'>
             <div className='circle-card-icon'>
                <InputGroup>
                    <div className="color_card_circle"style={{ background: "#28A3DA" }} >
                        <Image src={icon_badge} />
                    </div>
                </InputGroup>
            </div>
            <Card className="color_card_container_2">
                <Row className='circle-card-content'>
                    <span className="color_card_text_h3">{props.exp} Yrs</span>
                    <span className="color_card_text_h4">Experience</span>
                </Row>
            </Card>
        </Col>

        <Col lg="4" md='6' sm='6' xs='12'>
            <div className='circle-card-icon'>
                <InputGroup>
                    <div className="color_card_circle" style={{ background: "#12B829" }}>
                        <Image src={icon_money} />
                    </div>
                </InputGroup>
             </div>
            <Card className="color_card_container_3">
                <Row  className='circle-card-content'>
                <span className="color_card_text_h3">₹{props.fee}</span>
                <span className="color_card_text_h4">Fee</span>
                </Row>
            </Card>
        </Col>
    </Row>
  );
};
export default ColorCards;
