import { Card } from "@material-ui/core";
import {calendar,clock} from "../../constants/DoctorImages";
import {Image} from "react-bootstrap";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const PatientAppointmentCard = (props) => {
  return (
    <>
    <Card className="patient-appointment-container" onClick={() =>  props.history.push(`/doctor/appointmentDetail/${props.id}`)}>
        <div className="image-container">
            <img src={props?.image} style={{
                maxWidth:"100%",
                maxHeight:"100%"
            }}/>
        </div>
        <div className="content-container">
            <div style={{display:"flex", flexDirection:"row", marginBottom: "10px"}}>
                <div style={{flex:1}}>
                    <div className="patient-name text-tooltip">{props.name}</div>
                </div>
                <div style={{flex:1}}>
                    <div className="status-info">{props.status}</div>
                </div>
            </div>

            <div style={{marginBottom: "15px"}}>
                <div className="purpose-info">Purpose: <span className="grey text-tooltip" style={{marginLeft: "2px"}}>{props.purpose}</span></div>
            </div>
            <div style={{display:"flex", flexDirection:"row",}}>
            <div style={{display:"flex", flexDirection:"row", justifyContent: "space-between", alignItems: "baseline"}}>
                <div className="" >
                    <Image src={clock} />
                </div>
                <span className="time-info space-10">{props.onTime}</span></div>
            <div className="appointment-calendar-container">
                <div className="appointment-calendar-image-icon" >
                    <Image src={calendar} />
                </div>
                <span className="time-info space-10">{props.onDate}</span>
            </div>
            </div>
        </div>
      </Card>
    </>
  );
};
export default withRouter(PatientAppointmentCard);
