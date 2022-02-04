import { Image, Button } from "react-bootstrap";
import thank_you from "../../assets/thank_you-min.png";
import arrow from "../../assets/blackArrow.svg";
import orange_tick from "../../assets/success.png";

const ThankYou = (props) => {
  return (
    <>
      <div>
        <button
          style={{ marginLeft: "7%" }}
          className="back-button-text"
        >
          <img
            src={arrow}
            alt="back_icon-img"
            className="back-button"
            style={{marginBottom: '5px'}}
            onClick={() => props.history.push(`/patient/appointments`)}
          ></img>
          <span>Back</span>
        </button>
      </div>
      <div>
        <Image
          style={{ width: "40%", marginLeft: "30%" }}
          alt="confirmation image"
          className="thankYou_image"
          src={thank_you}
        ></Image>
        <Image
          style={{ width: "5%", marginLeft: "48%", marginBottom: "3%" }}
          alt="orange tick"
          src={orange_tick}
        ></Image>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontWeight: "bold", fontSize: "25px" }}>Thank You</p>
        <p style={{fontSize: "20px" }}>Your appointment has been scheduled</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <Button
          style={{ width: "fit-content", backgroundColor: "#28A3DA", fontSize: "20px" }}
          onClick={() => props.history.push("/patient/appointments")}
        >
          View Appointment
        </Button>
      </div>
    </>
  );
};

export default ThankYou;