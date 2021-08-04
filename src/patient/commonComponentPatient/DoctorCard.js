import { Card, CardContent, CardMedia } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";

const DoctorCard = (props) => {
  const { image, name, fees, qualifications, details, link } = props;
  return (
    <>
      <Card className="doctor-card-container">
        <Row>
          <Col lg="4">
            <CardMedia className="doctor-card-image" image={image}></CardMedia>
          </Col>
          <Col lg="8">
            <CardContent>
              <Row>
                <span className="doctor-card-doctor-name">{name}</span>
                <span className="doctor-card-doctor-details">{details}</span>
                <span>
                  <span className="doctor-card-fee-label">Fee:</span>
                  <span className="doctor-card-fee-value">Rs {fees}</span>{" "}
                </span>
                <span style={{ marginLeft: "24px", marginTop: "5px" }}>
                  {qualifications.map((value) => (
                    <span className="doctor-card-specialization-container">
                      <span className="doctor-card-specialization-text">
                        {value}
                      </span>
                    </span>
                  ))}
                </span>
                <a href={link}>
                  <span className="doctor-card-details-link">View Details</span>
                </a>
              </Row>
            </CardContent>
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default DoctorCard;