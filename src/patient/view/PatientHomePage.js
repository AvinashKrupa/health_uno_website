import DoctorCard from "../commonComponentPatient/DoctorCard";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import SpecialityCard from "../commonComponentPatient/SpecialityCard";
import {doctorCard, heart, brain, tooth} from '../../constants/PatientImages';

const PatientHomePage = (props) => {
  return (
    <>
      <Row>
        <Col lg="1" />
        <Col lg="10">
          <Row style={{ marginTop: "33px" }}>
            <Col>
              <InputGroup>
                <i className="fas fa-search patient-homepage-search-icon"></i>

                <Form.Control
                  className="patient-homepage-search"
                  type="text"
                  placeholder="Search doctors"
                />
              </InputGroup>
            </Col>
            <Col className="patient-homepage-text-h5">
              {/* <LocationIcon className="patient-homepage-icons" />
              <span style={{ marginLeft: "15px" }}>Chennai, India</span>
              <BellIcon
                className="patient-homepage-icons"
                style={{ marginLeft: "57px" }}
              /> */}
            </Col>
          </Row>
          <Row style={{ marginTop: "32px" }}>
            <Col>
              <Row className="patient-homepage-motion-images"></Row>
            </Col>
          </Row>
          <Row style={{ marginTop: "42px", marginBottom: "32px" }}>
            <Col>
              <span className="patient-homepage-text-h4">Specialities</span>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <span className="patient-homepage-link-text ">View All</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <SpecialityCard icon={heart} label="Cardiology" />
            </Col>
            <Col>
              <SpecialityCard icon={brain} label="Neurology" />
            </Col>
            <Col>
              <SpecialityCard icon={tooth} label="Dentist" />
            </Col>
            <Col>
              <SpecialityCard icon={heart} label="Cardiology" />
            </Col>
            <Col>
              <SpecialityCard icon={brain} label="Neurology" />
            </Col>
            <Col>
              <SpecialityCard icon={tooth} label="Dentist" />
            </Col>
            <Col>
              <SpecialityCard icon={heart} label="Cardiology" />
            </Col>
          </Row>
          <Row style={{ marginTop: "42px", marginBottom: "32px" }}>
            <Col>
              <span className="patient-homepage-text-h4">Top Consultants</span>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <span className="patient-homepage-link-text ">View All</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <DoctorCard
                image={doctorCard}
                name="Dr A B"
                fees="2000"
                details="Gujarat, India | 5 Y Exp"
                qualifications={["Cardiology", "Orthology"]}
              />
            </Col>
            <Col>
              <DoctorCard
                image={doctorCard}
                name="Dr A B"
                fees="2000"
                details="Gujarat, India | 5 Y Exp"
                qualifications={["Cardiology", "Orthology"]}
              />
            </Col>
            <Col>
              <DoctorCard
                image={doctorCard}
                name="Dr A B"
                fees="2000"
                details="Gujarat, India | 5 Y Exp"
                qualifications={["Cardiology", "Orthology"]}
              />
            </Col>
          </Row>
        </Col>
        <Col lg="1" />
      </Row>
    </>
  );
};

export default PatientHomePage;  
