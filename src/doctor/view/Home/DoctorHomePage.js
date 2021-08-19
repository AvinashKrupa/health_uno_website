import DoctorCard from "../../../patient/commonComponentPatient/DoctorCard";
import { Row, Col } from "react-bootstrap";
import SpecialityCard from "../../../patient/commonComponentPatient/SpecialityCard";
import { API, get, post } from "../../../api/config/APIController";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { useState } from "react";
import CarouselComponent from "../../../commonComponent/CarouselComponent";
import Grid from "@material-ui/core/Grid";
import useSearchStore from "../../store/searchStore";
import SearchInputWithIcon from "../../../commonComponent/SearchInputWithIcon";
import SimilarDoctorsCard from "./../../../patient/view/doctorDetail/SimilarDoctorsCard";
import moment from "moment";
import patientSlotBookingStore from "../../../patient/store/patientSlotBookingStore";
import HorizontalCalendarForDoctor from "../../components/HorizontalCalendarForDoctor";
import {getData} from "../../../storage/LocalStorage/LocalAsyncStorage";
import PatientAppointmentCard from "../../components/PatientAppointmentCard";

const DoctorHomePage = (props) => {
  let timer = null;
  const { addToast } = useToasts();
  const userInfo = JSON.parse(getData('userInfo'));
  const setSearchText = useSearchStore((state) => state.setSearchText);
  let [specialities, setSpecialities] = useState([]);
  let [slider, setSlider] = useState([]);
  let [consultants, setConsultant] = useState([]);
  const setDate = patientSlotBookingStore((state) => state.setDate);
  const [currentDate, setCurrentDate] = useState(`${moment(patientSlotBookingStore((state) => state.date)).format('YYYY-MM-DD')}`,'YYYY-MM-DD');
  const [selectedDay, setSelectedDay] = useState(moment(currentDate).format('DD'));

  useEffect(() => {
    setSearchText('')
    getHomeContent();
    getDoctorAppointments();
  }, []);

  function getHomeContent() {
    get(API.DOCTOR_HOME_CONTENT_API)
      .then((response) => {
        if (response.status === 200) {
          setSlider(response.data.data.slider);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function getDoctorAppointments() {
    post(API.DOCTOR_GET_APPOINTMENTS_API, {
      limit: 20,
      page:1,
      sort_order: "desc",
      sort_key: "created_at",
      status: [
        "pending",
        "scheduled",
        "cancelled",
        "rejected",
        "ongoing",
        "completed"
      ]
    }, true)
      .then((response) => {
        if (response.status === 200) {
          setConsultant(response.data.data.docs);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function debounce(txt) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      setSearchText(txt);
      props.history.push("/doctor/upcomingAppointments");
    }, 1000);
  }

  const onDateSelect = (dateNumber, date) => {
    const selectedDate = `${moment(date).format('YYYY-MM-DD')}`;
    console.log('selectedDate: ', date);
    console.log('selectedDate1: ', selectedDate);
    setCurrentDate(selectedDate)
    setSelectedDay(dateNumber);
    setDate(date)

  };

  function setDateValue(date) {
    const selectedDate = `${moment(date).format('YYYY-MM-DD')}`;
    setCurrentDate(selectedDate);
    setSelectedDay(moment(date).format('DD'));
    setDate(selectedDate)
  }
  return (
    <>
      <Row className="patient-home-container">
        <Col lg="1" sm="1" xs="1" />
        <Col lg="10" sm="10" xs="10">
          <Row className="search-container">
            <SearchInputWithIcon
              className="patient-homepage-search"
              placeholder="Search patients"
              onChange={(e) => debounce(e)}
            ></SearchInputWithIcon>
          </Row>
          <Row style={{ marginTop: "32px" }}>
            <Col>
              <div className="welcome-text-container">
                <span className="text-welcome-header">Welcome,</span>
                <span className="text-welcome-subheader">{`Dr. ${userInfo?.first_name}`}</span>
              </div>
              <div className="upcoming-appointment-container">
                <span className="upcoming-appointment-text">Upcoming Appointments</span>
                <span className="upcoming-appointment-view_all" style={{cursor: 'pointer'}} onClick={(e) => props.history.push("/patient/specialities")}>View all</span>
              </div>
              <HorizontalCalendarForDoctor
                  date={currentDate}
                  numberOfDays={2}
                  selectedDay={selectedDay}
                  setDateValue={setDateValue}
                  setSelectedDay={onDateSelect}
                  // slot_id={slot}
              />

            </Col>
          </Row>
          <Row style={{ marginTop: "32px", marginBottom: "32px", display: "flex", flexDirection: "row" }}>
            {consultants && consultants.map((doctor) => {
              return (
                <Grid container item lg={4} md={6} sm={6} xs={12} spacing={1}>
                    <PatientAppointmentCard
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
              );
            })}
          </Row>
          <CarouselComponent sliders={slider} />
        </Col>
        <Col lg="1" sm="1" xs="1" />
      </Row>
      <Grid container spacing={1}></Grid>
    </>
  );
};

export default DoctorHomePage;
