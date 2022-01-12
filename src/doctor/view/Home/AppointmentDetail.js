import {Button, Col, Image, Row} from "react-bootstrap";
import {API, post} from '../../../api/config/APIController';
import React, {useEffect, useState} from "react";
import {useToasts} from 'react-toast-notifications';
import moment from "moment";
import {back_icon, calendar, clock, plus_icon} from "../../../constants/DoctorImages";
import addDoctorStore from "../../store/addDoctorStore";
import SelectedDoctorCard from "../../components/SelectedDoctorCard";
import {capitalizeFirstLetter, getTimer} from "../../../utils/utilities";
import Timer from "../../../commonComponent/Timer";
import {getColorForAppointmentStatus} from "../../../utils/Colors";
import {getData} from "../../../storage/LocalStorage/LocalAsyncStorage";

const AppointmentDetail = (props) => {
    const doctor_id = JSON.parse(getData('additional_info'))._id;
    const {addToast} = useToasts();
    let [appointmentDetail, setAppointmentDetail] = useState([]);
    let [addDoctor, setAddDoctor] = useState(addDoctorStore(state => state.selectedDoctor));
    const [enableMeetingButton, setEnableMeetingButton] = useState(false);

    function handleEnableButton() {
        setEnableMeetingButton(true)
    }

    const removeSelectedDoctor = () => {
        let params = {
            appointment_id: appointmentDetail._id,
            doctor_id: additional_doc[0]._id,
        };
        post(API.REMOVE_ADDITIONAL_DOCTOR, params)
            .then(response => {
                if (response.status == 200) {
                    setAddDoctor({});
                    addToast(response.data.message, {appearance: 'success'});
                } else {
                    addToast(response.data.message, {appearance: "error"});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: "error"});
            });
    }

    useEffect(() => {
        getAppointmentDetail();
        return () => {
        };
    }, [props.match.params.appointment_id]);

    useEffect(() => {
        getAppointmentDetail();
        return () => {
        };
    }, [addDoctor]);

    function getAppointmentDetail() {
        let params = {
            appointment_id: props.match.params.appointment_id,
        };
        post(API.APPOINTMENT_DETAIL_API, params)
            .then(response => {
                if (response.status === 200) {
                    setAppointmentDetail(response.data.data);
                } else {
                    addToast(response.data.message, {appearance: "error"});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: "error"});
            });
    }
    const timerEnable = appointmentDetail && getTimer(`${appointmentDetail?.time?.date} ${appointmentDetail?.time?.slot}`);
    const {additional_doc} = appointmentDetail || []

    function renderDoctorInfoTitle(){
        if(!!additional_doc?.length && ["cancelled", "completed"].includes(appointmentDetail.status)){
            if(additional_doc[0]?._id !== doctor_id){
                return 'Invited Doctor'
            }else {
                return'Primary Doctor'
            }
        }else {
            return null
        }
    }
    function renderDoctorInfo(){
        if(!!additional_doc?.length){
            if(additional_doc[0]?._id !== doctor_id){
                return (<div className='selected-doctor-main-container'>
                    <SelectedDoctorCard
                        id={additional_doc[0]._id}
                        image={additional_doc[0].dp}
                        name={`${additional_doc[0].first_name} ${additional_doc[0].last_name}`}
                        fees={appointmentDetail.fee}
                        details={`${additional_doc[0].address.city}, ${additional_doc[0].address.country} | ${additional_doc[0].exp} Y Exp`}
                        qualifications={additional_doc[0].specialities}
                        appointmentId={appointmentDetail._id}
                        removeSelectedDoctor={removeSelectedDoctor}
                        appointmentStatus={appointmentDetail.status}
                        showRemoveAction={(!["cancelled", "completed"].includes(appointmentDetail.status) && additional_doc[0]?._id !== doctor_id)}
                    />
                </div>)
            }else {
                return(<div className='selected-doctor-main-container'>
                    <SelectedDoctorCard
                        id={appointmentDetail?.doctor?._id}
                        image={appointmentDetail?.doctor?.dp}
                        name={`${appointmentDetail?.doctor?.first_name} ${appointmentDetail?.doctor?.last_name}`}
                        fees={appointmentDetail.fee}
                        details={`${appointmentDetail?.doctor?.address.city}, ${appointmentDetail?.doctor?.address.country} | ${appointmentDetail?.doctor?.exp} Y Exp`}
                        qualifications={appointmentDetail?.doctor?.specialities}
                        appointmentId={appointmentDetail._id}
                        removeSelectedDoctor={removeSelectedDoctor}
                        appointmentStatus={appointmentDetail.status}
                        showRemoveAction={false}
                    />
                </div>)
            }
        }else {
            return null
        }
    }

    return (
        <div>
            <Row>
                <Col lg="1" sm="1" xs='1'/>
                <Col lg="10" sm="10" xs='10'>
                    <Row className='back-navigation'>
                        <div className="back-nav-container-dr">
                            <img src={back_icon} alt='back_icon-img' onClick={() => props.history.push('/doctor/appointments')}></img>
                            <span>Appointments Details</span>
                        </div>
                    </Row>
                    <Row style={{marginTop: "32px",}}>
                        <Col>
                            <div className="appointment-detail-card-container">
                                <div className="image-container">
                                    <img src={appointmentDetail?.patient?.user?.dp} style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        borderRadius: "50%"
                                    }}/>
                                </div>
                                <div className="detail-container">
                                    <div className="field-container" style={{justifyContent: "space-between"}}>
                                        <div
                                            className="patient-name rrr">{`${appointmentDetail?.patient?.user?.first_name} ${appointmentDetail?.patient?.user?.last_name}`}</div>
                                        <div style={{marginRight: '2%'}}>
                                            <Button className="view-report-button"
                                                    onClick={() => props.history.push(`/doctor/reports/${appointmentDetail?.patient?._id}`)}>
                                                View Reports
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Status:</div>
                                        {appointmentDetail?.status && <div style={{color: getColorForAppointmentStatus(appointmentDetail.status)}}
                                              className="field-description">{capitalizeFirstLetter(appointmentDetail?.status)}</div>}
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Age:</div>
                                        <div
                                            className="field-description">{`${moment().diff(appointmentDetail?.patient?.user?.dob, 'years', false)} years`}</div>
                                        {/*<div className="field-description">{moment(appointmentDetail?.patient?.user?.dob).format("DD - MM - YYYY")}</div>*/}
                                    </div>

                                    <div className="field-container">
                                        <div className="field-title">Purpose:</div>
                                        <div className="field-description">{appointmentDetail?.reason}</div>
                                    </div>


                                    <div className="field-container">
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            alignItems: "baseline"
                                        }}>
                                            <div className="">
                                                <Image src={clock}/>
                                            </div>
                                            <div className="field-description">{appointmentDetail?.time?.slot}</div>
                                            <div className="appointment-calendar-container">
                                                <div className="appointment-calendar-image-icon">
                                                    <Image src={calendar}/>
                                                </div>
                                                <div
                                                    className="field-description">{moment(appointmentDetail?.time?.date).format("DD - MM - YYYY")}</div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="field-container">
                                        <div className="field-title">Comments:</div>
                                        <div className="field-description" style={{width: '80%'}}>{appointmentDetail?.complaints}</div>
                                    </div>
                                </div>
                            </div>
                            <h2 className="sub-title">{renderDoctorInfoTitle()}</h2>
                            {["scheduled","ongoing"].includes(appointmentDetail.status) && !additional_doc?.length && <div className="row-add-doctor"
                                                             onClick={() => props.history.push(`/doctor/select/${appointmentDetail?._id}`)}>
                                <div className="row-add-doctor-text">Add Doctor</div>
                                <div><Image src={plus_icon}/></div>
                            </div>}
                            {renderDoctorInfo()}
                            {/*{["completed"].includes(appointmentDetail.status) && !additional_doc?.length && <div className="no-doctor-found">*/}
                            {/*    <div className="row-add-doctor-text">No additional doctor was present</div>*/}
                            {/*</div>}*/}
                            {["completed"].includes(appointmentDetail.status) && !appointmentDetail.prescription?.length &&
                            <div className="row-add-doctor" onClick={() =>
                                props.history.push({
                                    pathname: `/doctor/addPrescription/${appointmentDetail?._id}`,
                                    state: {
                                        patientName: `${appointmentDetail?.patient?.user?.first_name} ${appointmentDetail?.patient?.user?.last_name}`,
                                        patientAge: moment().diff(appointmentDetail?.patient?.user?.dob, 'years', false),
                                        patientWeight: appointmentDetail?.patient?.weight,
                                        patientHeight: appointmentDetail?.patient?.height,
                                    }
                                })
                            }>
                                <div className="row-add-doctor-text">Add Prescription</div>
                                <div><Image src={plus_icon}/></div>
                            </div>}
                            {["completed"].includes(appointmentDetail.status) && !!appointmentDetail.prescription?.length &&
                            <div className="edit-prescription-button" onClick={() => null}>
                                <div className="row-add-doctor-text">Prescription already Added</div>
                            </div>}

                            {appointmentDetail.status !== "completed" && (
                                <div className="meeting-timer-container">{ timerEnable && <Timer time={appointmentDetail?.time?.utc_time} handleEnableButton={handleEnableButton}></Timer> }</div>)
                                }
                            {["scheduled","ongoing"].includes(appointmentDetail.status) && <div className="bottom-container">
                                <Button className="initiate-call-button-container"
                                        disabled={!(enableMeetingButton || appointmentDetail.status ==="ongoing")}
                                        onClick={() => {
                                            props.history.push(`/doctor/videoMeeting/${appointmentDetail?._id}`)
                                        }}
                                >
                                    {additional_doc?.length && additional_doc[0]?._id !== doctor_id ?'Initiate Call':'Join Call'}
                                </Button>
                            </div>}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default AppointmentDetail;
