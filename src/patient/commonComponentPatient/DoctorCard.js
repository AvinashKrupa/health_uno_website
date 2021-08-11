import { Card, CardContent, CardMedia } from "@material-ui/core";

const DoctorCard = (props) => {
  const { image, name, fees, qualifications, details, link } = props;
  return (
    <>
      <Card className="doctor-card-container">
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>
            <CardMedia className="doctor-card-image" image={image}></CardMedia>
          </div>
          <div>
            <CardContent>
                <span className="doctor-card-doctor-name">{name}</span>
                <span className="doctor-card-doctor-details">{details}</span>
                <span>
                  <span className="doctor-card-fee-label">Fee:</span>
                  <span className="doctor-card-fee-value">Rs {fees}</span>{" "}
                </span>
                <span style={{marginTop: "5px" }}>
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

            </CardContent>
          </div>
        </div>
      </Card>
    </>
  );
};
export default DoctorCard;