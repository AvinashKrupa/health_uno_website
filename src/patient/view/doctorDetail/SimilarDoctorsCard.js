import { Card, CardContent, CardMedia } from "@material-ui/core";
import {Link} from 'react-router-dom';

const DoctorCard = (props) => {
    const similarDoctorContainer = props.from ==='doctor' ? 'doctor-card-container select-doctor' : 'doctor-card-container';
  return (
    <>
    <Card className={similarDoctorContainer} onClick={()=>props.from ==='doctor' ? props.onDoctorSelect(props) : null}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>
          <CardMedia className="doctor-card-image" image={props?.image}></CardMedia>
          </div>
          <div>
            <CardContent>
                <span className="doctor-card-doctor-name">{props.name}</span>
                <span className="doctor-card-doctor-details">{props?.details}</span>
                <span>
                  <span className="doctor-card-fee-label">Fee:</span>
                  <span className="doctor-card-fee-value">Rs {props.fees}</span>{" "}
                </span>
                <span style={{marginTop: "5px" }}>
                <span
                    className="doctor-card-specialization-text"
                    style={{  marginTop: "10px" }}
                  >
                    {
                      props?.qualifications.map((s) => {
                          return(<span key={s} style={{ padding: '5px', marginRight: '10px'}} className='doctor-card-specialization-container'>{s}</span>)
                      })
                    }

                  </span>
                </span>
                {props.from !=='doctor' && <Link to={`/patient/doctorDetails/${props.id}`}>
                    <span className="doctor-card-details-link">View Details</span>
                </Link>}
            </CardContent>
          </div>
        </div>
      </Card>
    </>
  );
};
export default DoctorCard;
