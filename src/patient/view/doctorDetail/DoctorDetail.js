import { Row, Col, Image, Table, Button } from "react-bootstrap";
import {Link} from "react-router-dom";
import SimilarDoctorsCard from "./SimilarDoctorsCard";
import ColorCard from "./ColorCard";
import { useEffect, useState } from "react";
import {API, post} from '../../../api/config/APIController';
import { useToasts } from 'react-toast-notifications';

const DoctorDetails = (props) => {

    useEffect(() => {
        getDoctorDetails();
        return () => {};
    }, [props.match.params.doctor_id]);

    const { addToast } = useToasts();
    const [doctorDetails, setDoctorDetails] = useState();

    function getDoctorDetails() {
        post(API.GETDOCTORDETAILS, {doctor_id: props.match.params.doctor_id, include_similar: true })
        .then(response => {
            if (response.status === 200) {
            setDoctorDetails(response.data.data);
            } else {
            addToast(response.data.message, { appearance: 'error' });
            }
        })
        .catch(error => {
            addToast(error.response.data.message, { appearance: 'error' });
        });
    }

    return (
        <>
        <Row>
            <Col lg="1" md='1' sm='1' xs='2'/>
            <Col lg="11"  md='11' sm='11'  xs='8' className='doctor-detail-container'>
                {
                    doctorDetails && 
                    <>
                        <Row style={{ marginBottom: "50px" }} className='doctor-back-navigation'>
                        <Row className='back-navigation'>
                            <Link to='/patient/home'><i class="fas fa-arrow-left"></i><span>Top Consultants</span></Link>
                        </Row>
                        </Row>
                        <Row>
                            <Col lg="8">
                            <Row>
                                <Col lg="3">
                                    <Image src={doctorDetails.dp}
                                        style={{height: '150px',
                                        width: '150px',
                                        borderRadius: '78px',
                                        border: '1px solid #000000',
                                    }}/> 
                                </Col>
                                <Col lg="9" style={{ paddingRight: "70px" }}>
                                <Row>
                                    <span
                                    className="doctor_details_h3"
                                    style={{ marginBottom: "6px" }}
                                    >
                                    {`Dr ${doctorDetails.first_name} ${doctorDetails.last_name}`}
                                    </span>
                                </Row>
                                <Row>
                                    <span className="doctor_details_color_h5">
                                        {
                                            doctorDetails.specialities.map((s) => {
                                                return(<span key={s} style={{ padding: '5px', marginRight: '10px'}} className='doctor-card-specialization-container'>{s}</span>)
                                            })
                                        }
                                    </span>
                                </Row>
                                <Row style={{ marginTop: "20px", marginBottom: "48px" }}>
                                {doctorDetails &&  <ColorCard fee={doctorDetails.fee} exp={doctorDetails.exp} total_patients={doctorDetails.total_patients}/>}
                                </Row>
                                <Row>
                                    <span
                                    className="doctor_details_h4"
                                    style={{ marginBottom: "10px" }}
                                    >
                                    About Doctor
                                    </span>
                                </Row>
                                <Row>
                                    <span
                                    className="doctor_details_h5"
                                    style={{
                                        marginBottom: "32px",
                                        color: "rgba(143, 143, 143, 1)",
                                    }}
                                    >
                                        {doctorDetails.desc}
                                    </span>
                                </Row>
                                <Row>
                                    <span
                                    className="doctor_details_h4"
                                    style={{ marginBottom: "10px" }}
                                    >
                                    Working Time
                                    </span>
                                </Row>
                                <Row>
                                    <span
                                    className="doctor_details_h5"
                                    style={{
                                        fontSize: "14px",
                                        marginBottom: "143px",
                                        color: "rgba(143, 143, 143, 1)",
                                    }}
                                    >
                                       <Table striped bordered hover >
                                            <thead> </thead>
                                            <tbody>
                                                {
                                                    Object.keys(doctorDetails.day).map((key) => {
                                                        return(
                                                            <tr>
                                                            <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                                                                { 
                                                                
                                                                doctorDetails.day[key] ?
                                                                    <td>{`${doctorDetails.shift.shift1.start} AM  -
                                                                        ${parseInt(doctorDetails.shift.shift2.end.split(':')[0]) - 12}:
                                                                        ${doctorDetails.shift.shift2.end.split(':')[1]} PM`}</td> :
                                                                    <td>Service Not Available</td> 
                                                                }
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </span>
                                </Row>
                                <Row>
                                    <Button className="doctor_details_button" onClick={(e) => props.history.push(`/patient/bookSlot/${props.match.params.doctor_id}`)}>
                                        <span className="doctor_details_h5">
                                            Book Appointment
                                        </span>
                                    </Button>
                                </Row>
                                </Col>
                            </Row>
                            </Col>
                            <Col lg="4">
                            <Row>
                                <span
                                className="doctor_details_h3"
                                style={{ marginBottom: "17px" }}
                                >
                                Similar Doctors
                                </span>
                                {
                                    doctorDetails.similar_doctors.map((doctor) => {
                                        return(
                                            <SimilarDoctorsCard
                                                id={doctor._id}
                                                image={doctor.dp}
                                                name={`${doctor.first_name} ${doctor.last_name}`}
                                                fees="2000"
                                                details={`${doctor.city}, ${doctor.country} | 5 Y ${doctor.exp}`}
                                                qualifications={doctor.specialities}
                                            />
                                        )
                                    })
                                }
                            </Row>
                            </Col>
                        </Row>
                    </>
                }
            </Col>
        </Row>
        </>
    );
};
export default DoctorDetails;