import {Button, Col, Image, Row} from "react-bootstrap";
import {API, post} from '../../../api/config/APIController';
import React, {forwardRef, useEffect, useState} from "react";
import {useToasts} from 'react-toast-notifications';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import useSearchStore from '../../store/searchStore';
import SearchInputWithIcon from '../../../commonComponent/SearchInputWithIcon';
import PatientAppointmentCard from "../../components/PatientAppointmentCard";
import DatePicker from "react-datepicker";
import moment from "moment";
import {calendar, clock, plus_icon} from "../../../constants/DoctorImages";
import {Card} from "@material-ui/core";

const AppointmentDetail = (props) => {
  let timer = null;
  const {addToast} = useToasts();
  let [searchText, setSearchText] = useState(useSearchStore(state => state.searchText));
  let [appointmentDetail, setAppointmentDetail] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    getAppointmentDetail();
    return () => {};
  }, [props.match.params.appointment_id]);

  // useEffect(() => {
  //   getAppointmentDetail();
  // }, [searchText]);
  //
  // useEffect(() => {
  //   getAppointmentDetail();
  // }, [currentDate]);


  function callBackFilter(data) {
    getAppointmentDetail(data.sortBy, data.min, data.max, data.selectedLanguages);
  }

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


  return (
        <div>
          <Row>
            <Col lg="1" sm="1" xs='1'/>
            <Col lg="10" sm="10" xs='10'>
              <Row className='back-navigation'>
                <div style={{backgroundColor: '', display:"flex", flexDirection: "row", justifyContent:"space-between"}}>
                    <div style={{cursor: 'pointer'}}>
                        <i onClick={()=>props.history.goBack()} class="fas fa-arrow-left"></i>
                        <span style={{marginLeft:10}}>Appointments Details</span>
                    </div>
                </div>
              </Row>
                <Row style={{ marginTop: "32px",  }}>
                    <Col>
                        <div className="appointment-detail-card-container">
                            <div className="image-container">
                                <img src={appointmentDetail?.patient?.user?.dp} style={{
                                    maxWidth:"100%",
                                    maxHeight:"100%"
                                }}/>
                            </div>
                            <div className="detail-container">
                                <div className="field-container" style={{justifyContent: "space-between"}}>
                                    <div className="patient-name">{`${appointmentDetail?.patient?.user?.first_name} ${appointmentDetail?.patient?.user?.last_name}`}</div>
                                    <div style={{marginRight:'2%'}}>
                                        <Button className="view-report-button">
                                            View Reports
                                        </Button>
                                    </div>
                                </div>

                                <div className="field-container">
                                    <div className="field-title">Age:</div>
                                    <div className="field-description">{`${moment().diff(appointmentDetail?.patient?.user?.dob, 'years',false)} years`}</div>
                                    {/*<div className="field-description">{moment(appointmentDetail?.patient?.user?.dob).format("DD - MM - YYYY")}</div>*/}
                                </div>

                                <div className="field-container">
                                    <div className="field-title">Purpose:</div>
                                    <div className="field-description">Headache</div>
                                </div>



                                <div className="field-container">
                                    <div style={{display:"flex", flexDirection:"row", justifyContent: "space-between", alignItems: "baseline"}}>
                                        <div className="" >
                                            <Image src={clock} />
                                        </div>
                                        <div className="field-description">{appointmentDetail?.time?.slot}</div>
                                        <div className="appointment-calendar-container">
                                            <div className="appointment-calendar-image-icon" >
                                                <Image src={calendar} />
                                            </div>
                                            <div className="field-description">{moment(appointmentDetail?.time?.date).format("DD - MM - YYYY")}</div>
                                        </div>
                                    </div>
                                </div>


                                <div className="field-container">
                                    <div className="field-title">Comments: </div>
                                    <div className="field-description" style={{width: '80%'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa cursus mauris magna eget vel, iaculis libero. Viverra eleifend ultrices et feugiat.</div>
                                </div>
                            </div>
                        </div>
                        <div className="row-add-doctor">
                            <div className="row-add-doctor-text">Add Doctor</div>
                            <div><Image src={plus_icon} /></div>
                        </div>

                        <div style={{ display:"flex", justifyContent: "center"} }>
                            <Button className="initiate-call-button-container">
                                Initiate Call
                            </Button>
                        </div>
                    </Col>
                </Row>
              {/*<Row style={{display: 'flex', flexDirection: 'row'}} className='top-consultants-card-container'>*/}
              {/*  {appointmentDetail.map((doctor) => {*/}
              {/*    return (*/}
              {/*        <Grid container item lg={4} md={6} sm={6} xs={12} spacing={1}>*/}
              {/*          <PatientAppointmentCard*/}
              {/*              key={doctor._id}*/}
              {/*              id={doctor._id}*/}
              {/*              image={doctor.dp}*/}
              {/*              // name={`${doctor.first_name} ${doctor.last_name}`}*/}
              {/*              name={`${doctor.first_name}`}*/}
              {/*              purpose={doctor.reason}*/}
              {/*              status={doctor.status}*/}
              {/*              onTime={doctor.time.slot}*/}
              {/*              onDate={doctor.time.date}*/}
              {/*          />*/}
              {/*        </Grid>*/}
              {/*    )*/}
              {/*  })}*/}
              {/*  {!appointmentDetail.length &&*/}
              {/*    <div className="empty-list-container">*/}
              {/*      <h4>No appointments found</h4>*/}
              {/*    </div>*/}
              {/*  }*/}
              {/*</Row>*/}
            </Col>
            <Col lg="1" sm="1" xs='1'/>
          </Row>
        </div>
  );
};

export default AppointmentDetail;
