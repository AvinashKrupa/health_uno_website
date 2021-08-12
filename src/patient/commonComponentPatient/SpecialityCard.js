import { Row } from "react-bootstrap";
import { Card, CardMedia } from "@material-ui/core";
const SpecialityCard = (props) => {
  const { icon, label, setSearchText } = props;
  return (
    <Card className="speciality-card-container">
      <div>
          <CardMedia className="speciality-card-image" image={icon} />
        <div style={{ textAlign: "center" }}>
          <span className="speciality-card-text" style={{cursor: 'pointer'}} onClick={(e) => setSearchText(label)}>{label}</span>
        </div>
      </div>
    </Card>
  );
};

export default SpecialityCard;