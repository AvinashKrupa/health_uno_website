import {Card, CardContent, CardMedia} from "@material-ui/core";
import {delete_icon} from "../../constants/DoctorImages";
import {getData} from "../../storage/LocalStorage/LocalAsyncStorage";

const SelectedDoctorCard = (props) => {
    const doctor_id = JSON.parse(getData('additional_info'))._id;

    return (
        <>
            <Card className="selected-doctor-container">
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <div className="image-profile-container">
                        <CardMedia className="image" image={props?.image}></CardMedia>
                    </div>
                    <div>
                        <CardContent>
                            <div style={{display:"flex", flexDirection:"row"}}>
                                <div style={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                    <div className="name">{props.name}</div>
                                    <div className="description">{props?.details}</div>
                                    <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}>
                                    <span
                                        // className="doctor-card-specialization-text"
                                        style={{marginTop: "10px"}}
                                    >
                                    {
                                        props?.qualifications.map((s) => {
                                            return (<span key={s} style={{padding: '5px', marginRight: '10px'}}
                                                          className='specialities-text'>{s}</span>)
                                        })
                                    }
                                </span>
                                    </div>
                                </div>
                                {(!["cancelled", "completed"].includes(props.appointmentStatus) && props.id !== doctor_id) && <div>
                                    <img className="delete-button" src={delete_icon}
                                         onClick={() => props.removeSelectedDoctor()}/>
                                </div>}
                            </div>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </>
    );
};
export default SelectedDoctorCard;
