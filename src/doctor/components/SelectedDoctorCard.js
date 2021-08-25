import {API, get, post} from '../../api/config/APIController';
import {Card, CardContent, CardMedia} from "@material-ui/core";
import {RiDeleteBinLine} from 'react-icons/ri'
import addDoctorStore from "../store/addDoctorStore";
import {useToasts} from "react-toast-notifications";
import {delete_icon} from "../../constants/DoctorImages";

const SelectedDoctorCard = (props) => {

    const {addToast} = useToasts();

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
                                <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                                    <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
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
                                    <div className="name">{props.name}</div>
                                    <div className="description">{props?.details}</div>
                                </div>
                                <div style={{marginLeft:"4%"}}>
                                    <img src={delete_icon} onClick={()=>props.removeSelectedDoctor()}/>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </>
    );
};
export default SelectedDoctorCard;
