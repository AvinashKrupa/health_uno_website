import { Row } from "react-bootstrap";
import { Card, CardMedia } from "@material-ui/core";
const SpecialityCard = (props) => {
  const { icon, label } = props;
  return (
    <>
      <Card className="speciality-card-container">
        <Row>
          <Row>
            <CardMedia className="speciality-card-image" image={icon} />
          </Row>
          <Row style={{ textAlign: "center" }}>
            <span className="speciality-card-text">{label}</span>
          </Row>
        </Row>
      </Card>
    </>
  );
};

export default SpecialityCard;