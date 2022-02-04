import { Card, CardMedia } from "@material-ui/core";
const SpecialityCard = (props) => {
  const { icon, label, onPress } = props;
  return (
    <Card className="speciality-card-container card-hover-effect" onClick={(e) => onPress()}>
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
