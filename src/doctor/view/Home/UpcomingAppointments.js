import {Col, Row} from "react-bootstrap";
import {API, post} from '../../../api/config/APIController';
import React, {useEffect, useState} from "react";
import {useToasts} from 'react-toast-notifications';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import useSearchStore from '../../store/searchStore';
import SearchInputWithIcon from '../../../commonComponent/SearchInputWithIcon';
import TopConsultantsFilter from '../../../patient/commonComponentPatient/TopConsultantsFilter'
import PatientAppointmentCard from "../../components/PatientAppointmentCard";
import DatePicker from "react-datepicker";
import moment from "moment";

const UpcomingAppointments = (props) => {
  let timer = null;
  const {addToast} = useToasts();
  let [searchText, setSearchText] = useState(useSearchStore(state => state.searchText));
  let [appointments, setAppointments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  return (
      // <TopConsultantsFilter sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} callBackFilter={callBackFilter}>
        <div>
          <Row className='top-consultants-container'>
            <Col lg="1" sm="1" xs='1'/>
            <Col lg="10" sm="10" xs='10'>
              <Row className='back-navigation'>
                <Link to='/doctor/home'><i class="fas fa-arrow-left"></i><span>Upcoming Appointments</span></Link>
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
                <div className="patient-slot-booking-cal">
                  <div className="slot-calendar" style={{display: 'flex', flexDirection: 'row', paddingTop: '10px'}}>
                    <DatePicker
                        selected={new Date(currentDate)}
                        onChange={(date) => setCurrentDate(date)}
                        maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15)}
                        minDate={new Date(new Date().getFullYear(), new Date().getMonth(), 15)}
                        placeholderText="Select a date before 30 days in the future"

                    />
                    <i className="fas fa-calendar-alt fa-calendar-alt-slot"></i>
                  </div>
                </div>
                {/*<Button onClick={toggleSidebar} style={{marginTop: '33px'}}>*/}
                {/*  <img src={filter} alt='filter-img' style={{height: '26px', width: '24px'}}></img>*/}
                {/*</Button>*/}
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
              </Row>
            </Col>
            <Col lg="1" sm="1" xs='1'/>
          </Row>
        </div>
      // </TopConsultantsFilter>

  );
};

export default UpcomingAppointments;
