import { Card, CardContent, CardMedia } from "@material-ui/core";
import {calendar,clock} from "../../constants/DoctorImages";
import {Link} from 'react-router-dom';
import {Image} from "react-bootstrap";
import {icon_man} from "../../constants/PatientImages";

const PatientAppointmentCard = (props) => {
  return (
    <>
    <Card className="patient-appointment-container">
        <div className="image-container">
            <img src={props?.image}/>
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
            <div style={{display:"flex", flexDirection:"row", justifyContent: "space-between", alignItems: "baseline", marginLeft: 20}}>
                <div className="" >
                    <Image src={calendar} />
                </div>
                <span className="time-info space-10">{props.onDate}</span>
            </div>
            </div>


        </div>


        {/*<div style={{display: 'flex', flexDirection: 'row'}}>*/}
        {/*  <div style={{backgroundColor: 'pink', margin:20}}>*/}
        {/*  <CardMedia className="doctor-card-image" image={props?.image}></CardMedia>*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <CardContent>*/}
        {/*        <span className="doctor-card-doctor-name">{props.name}</span>*/}
        {/*        <span className="doctor-card-doctor-details">{props?.details}</span>*/}
        {/*        <span>*/}
        {/*          <span className="doctor-card-fee-label">Fee:</span>*/}
        {/*          <span className="doctor-card-fee-value">Rs {props.fees}</span>{" "}*/}
        {/*        </span>*/}
        {/*        /!*<span style={{marginTop: "5px" }}>*!/*/}
        {/*        /!*<span*!/*/}
        {/*        /!*    className="doctor-card-specialization-text"*!/*/}
        {/*        /!*    style={{  marginTop: "10px" }}*!/*/}
        {/*        /!*  >*!/*/}
        {/*        /!*    {*!/*/}
        {/*        /!*      props?.qualifications.map((s) => {*!/*/}
        {/*        /!*          return(<span key={s} style={{ padding: '5px', marginRight: '10px'}} className='doctor-card-specialization-container'>{s}</span>)*!/*/}
        {/*        /!*      })*!/*/}
        {/*        /!*    }*!/*/}

        {/*        /!*  </span>*!/*/}
        {/*        /!*</span>*!/*/}
        {/*        /!*<Link to={`/patient/doctorDetails/${props.id}`}>*!/*/}
        {/*        /!*  <span className="doctor-card-details-link">View Details</span>*!/*/}
        {/*        /!*</Link>*!/*/}
        {/*    </CardContent>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </Card>
    </>
  );
};
export default PatientAppointmentCard;
