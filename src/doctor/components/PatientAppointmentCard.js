import { Card } from "@material-ui/core";
import {calendar,clock} from "../../constants/DoctorImages";
import {Link} from 'react-router-dom';
import {Image} from "react-bootstrap";

const PatientAppointmentCard = (props) => {
  return (
    <>
    <Card className="patient-appointment-container" onClick={() =>{
        console.log('user clicked' );
    }}>
        <div className="image-container">
            <img src={props?.image} style={{
                maxWidth:"100%",
                maxHeight:"100%"
            }}/>
        </div>
        <div className="content-container">
            <div style={{display:"flex", flexDirection:"row", marginBottom: "10px"}}>
                <div style={{flex:1}}>
                    <span className="patient-name">{props.name}</span>
                </div>
                <div style={{flex:1}}>
                    <div className="status-info">{props.status}</div>
                </div>
            </div>

            <div style={{marginBottom: "15px"}}>
                <span className="purpose-info">Purpose: <span className="grey">{props.purpose}</span></span>
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
export default PatientAppointmentCard;
