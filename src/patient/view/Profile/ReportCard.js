import { Grid } from "@material-ui/core";
import { Row, Col, Button } from "react-bootstrap";

const ReportCard = (props) => {
  return (
    <>
    <Grid container item lg={4}  md={6} sm={6} xs={12} spacing={1}>
      <Col>
        <Row className="report-card-container">
          <Col className="padding-0">
            <Row>
              <span className="report-card-text-location">
                {props.location || "Medilabs, Chennai"}
              </span>
            </Row>
            <Row>
              <span className="report-card-text-title">
                {props.title || "Prescriptions"}
              </span>
            </Row>
            <Row>
              <span className="report-card-text-date-and-time">
                {props.dateAndTime || "31 July 21 , 4:10 pm"}
              </span>
            </Row>
          </Col>
          <Col className="padding-0">
            <Row>
              <Button className="report-card-button">View</Button>
            </Row>
          </Col>
        </Row>
      </Col>
      </Grid>
    </>
  );
};
export default ReportCard;