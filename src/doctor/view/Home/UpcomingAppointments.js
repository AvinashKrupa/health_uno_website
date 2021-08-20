import {Col, Image, Row} from "react-bootstrap";
import {API, post} from '../../../api/config/APIController';
import React, {useEffect, useState} from "react";
import {useToasts} from 'react-toast-notifications';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import useSearchStore from '../../store/searchStore';
import SearchInputWithIcon from '../../../commonComponent/SearchInputWithIcon';
import PatientAppointmentCard from "../../components/PatientAppointmentCard";
import DatePicker from "react-datepicker";
import moment from "moment";
import {calendar_blue} from "../../../constants/DoctorImages";

const UpcomingAppointments = (props) => {
  let timer = null;
  const {addToast} = useToasts();
  let [searchText, setSearchText] = useState(useSearchStore(state => state.searchText));
  let [appointments, setAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    getUpcomingAppointments();
  }, [searchText]);

  useEffect(() => {
    getUpcomingAppointments();
  }, [currentDate]);


  function callBackFilter(data) {
    getUpcomingAppointments(data.sortBy, data.min, data.max, data.selectedLanguages);
  }

  function getUpcomingAppointments() {
    let params = {
      limit: 20,
      page: 1,
      sort_order: 'asc',
      sort_key: "created_at",
      search_text: searchText,
      date: currentDate,
      status: [
        // "pending",
        "scheduled",
        // "cancelled",
        // "rejected",
        "ongoing",
        // "completed"
      ]
    };
    post(API.DOCTOR_GET_APPOINTMENTS_API, params)
        .then(response => {
          if (response.status === 200) {
            setAppointments(response.data.data.docs);
          } else {
            addToast(response.data.message, {appearance: "error"});
          }
        })
        .catch(error => {
          addToast(error.response.data.message, {appearance: "error"});
        });
  }

  function debounce(txt) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      setSearchText(txt);
    }, 1000);
  }

  return (
        <div>
          <Row className='top-consultants-container'>
            <Col lg="1" sm="1" xs='1'/>
            <Col lg="10" sm="10" xs='10'>
              <Row className='back-navigation'>
                <div style={{backgroundColor: '', display:"flex", flexDirection: "row", justifyContent:"space-between"}}>
                <Link to='/doctor/home'><i class="fas fa-arrow-left"></i><span>{props.location.state.title}</span></Link>
                  <div className="calendar-container">
                    <DatePicker
                        selected={new Date(currentDate)}
                        onChange={(date) => setCurrentDate(date)}
                        maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15)}
                        minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 15)}
                        placeholderText="Select a date before 30 days in the future"

                    />
                    <Image src={calendar_blue} />
                  </div>
                </div>
              </Row>
              <div className='search-container' style={{display: "flex", justifyContent: 'space-between'}}>
                <SearchInputWithIcon
                    col='12'
                    placeholder="Search patients"
                    defaultValue={searchText}
                    className='patient-homepage-search'
                    onChange={(e) => debounce(e)}
                >
                </SearchInputWithIcon>
              </div>

              <Row style={{display: 'flex', flexDirection: 'row'}} className='top-consultants-card-container'>
                {appointments.map((doctor) => {
                  return (
                      <Grid container item lg={4} md={6} sm={6} xs={12} spacing={1}>
                        <PatientAppointmentCard
                            key={doctor._id}
                            id={doctor._id}
                            image={doctor.dp}
                            // name={`${doctor.first_name} ${doctor.last_name}`}
                            name={`${doctor.first_name}`}
                            purpose={doctor.reason}
                            status={doctor.status}
                            onTime={doctor.time.slot}
                            onDate={doctor.time.date}
                        />
                      </Grid>
                  )
                })}
                {!appointments.length &&
                  <div className="empty-list-container">
                    <h4>No appointments found</h4>
                  </div>
                }
              </Row>
            </Col>
            <Col lg="1" sm="1" xs='1'/>
          </Row>
        </div>
  );
};

export default UpcomingAppointments;
