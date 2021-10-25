import { Row } from "react-bootstrap";
import { Card, CardMedia } from "@material-ui/core";
const SpecialityCard = (props) => {
  const { icon, label, setSearchText } = props;
  return (
    <Card className="speciality-card-container card-hover-effect" onClick={(e) => setSearchText(label)}>
      <div>
          <CardMedia className="speciality-card-image" image={icon} />
        <div style={{ textAlign: "center" }}>
          <span className="speciality-card-text">{label}</span>
        </div>
      </div>
    </Card>
  );
};

export default SpecialityCard;
