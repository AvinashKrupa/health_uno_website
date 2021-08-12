import { Card, CardContent, CardMedia } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import {Link} from 'react-router-dom';

const DoctorCard = (props) => {
  const { image, name, details, id } = props;
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
                <Row>
                  <span
                    className="doctor-card-specialization-text"
                    style={{ marginLeft: "34px" }}
                  >
                    {
                      props.qualifications.map((s) => {
                          return(<span key={s} style={{ padding: '5px', marginRight: '10px'}} className='doctor-card-specialization-container'>{s}</span>)
                      })
                    }

                  </span>
                </Row>
                <Row>
                  <span className="doctor-card-doctor-name">{name}</span>
                </Row>
                <Row>
                  <span className="doctor-card-doctor-details">{details}</span>
                </Row>
                <Row style={{ marginTop: "30px" }}>
                <Link to={`/patient/doctorDetails/${id}`}>
                  <span className="doctor-card-details-link">View Details</span>
                </Link>
                </Row>
              </Row>
            </CardContent>
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default DoctorCard;