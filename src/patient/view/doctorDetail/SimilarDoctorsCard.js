import { Card, CardContent, CardMedia } from "@material-ui/core";
import { Button, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const SimilarDoctorsCard = (props) => {
  const language = props.language.map(function (item, index) {
    return (
      (
        <span key={index} style={{ marginLeft: "0px" }} className="doctor-card-fee-value">
          {(index ? ", " : "") + item}
        </span>
      ) || <span className="doctor-card-fee-value">Not Mentioned</span>
    );
  });

  const handleBookAppointment = (e) => {
    e.stopPropagation();
    props.history.push(`/patient/slotBooking/${props.id}`);
  };

  function getTimeString(time) {
    let _txt = '';
    let hours = parseInt(time/60);
    let minutes = time-hours*60;
    if(hours>0){
      _txt+=hours+'hrs : ';
    }
    if(minutes>0){
      _txt+=minutes+'mins';
    }
    return _txt;
  }

  const similarDoctorContainer =
    props.from === "doctor"
      ? "doctor-card-container select-doctor"
      : "doctor-card-container card-hover-effect";
  return (
    <>
      <Card
        className={similarDoctorContainer}
        onClick={() =>
          props.from === "doctor"
            ? props.onDoctorSelect(props)
            : props.history.push(`/patient/doctorDetails/${props.id}`)
        }
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <CardMedia
              className="doctor-card-image"
              image={props?.image}
            ></CardMedia>
            {
              !props?.next_avail_slot_time && <p className="text-danger">&nbsp;&nbsp;Not available for today</p>
            }
            {
              props?.next_avail_slot_time && <p>&nbsp;&nbsp;<span className="doctor-card-fee-label">Consult in </span><span className="doctor-card-details-button">{getTimeString(props?.next_avail_slot_time)}</span></p>
            }
          </div>
          <div>
            <CardContent>
              <span className="doctor-card-doctor-name text-tooltip">
                {props.name}
              </span>
              <span className="doctor-card-doctor-details">
                {props?.details}
              </span>
              <span>
                <span className="doctor-card-fee-label">Fee:</span>
                <span className="doctor-card-fee-value">
                  Rs {props.fees}
                </span>{" "}
              </span>
              {props.language && (
                <span>
                  <span className="doctor-card-fee-label">Language:</span>
                  <span className="doctor-card-fee-value">{language}</span>{" "}
                </span>
              )}
              <span style={{ marginTop: "5px" }}>
                <span
                  className="doctor-card-specialization-text"
                  style={{ marginTop: "10px" }}
                >
                  {props?.qualifications.map((s) => {
                    return (
                      <span
                        key={s}
                        style={{ padding: "5px", marginRight: "10px" }}
                        className="doctor-card-specialization-container"
                      >
                        {s}
                      </span>
                    );
                  })}
                </span>
              </span>
              {props.from !== "doctor" && (
                <InputGroup>
                  <Button
                    onClick={handleBookAppointment}
                    className="doctor-card-book-now-button"
                  >
                    Book now
                  </Button>
                  {props.from !== "doctor" && (
                    <Link to={`/patient/doctorDetails/${props.id}`}>
                      <button className="doctor-card-details-button">
                        View Details
                      </button>
                    </Link>
                  )}
                </InputGroup>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </>
  );
};
export default withRouter(SimilarDoctorsCard);
