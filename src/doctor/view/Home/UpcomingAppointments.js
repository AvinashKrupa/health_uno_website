import { Col, Image, Row } from "react-bootstrap";
import { API, post } from "../../../api/config/APIController";
import React, { forwardRef, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import useSearchStore from "../../store/searchStore";
import SearchInputWithIcon from "../../../commonComponent/SearchInputWithIcon";
import PatientAppointmentCard from "../../components/PatientAppointmentCard";
import DatePicker from "react-datepicker";
import moment from "moment";
import { back_icon, calendar_blue } from "../../../constants/DoctorImages";
import Spinner from "../../../commonComponent/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

const UpcomingAppointments = (props) => {
  let timer = null;
  const { addToast } = useToasts();
  let [searchText, setSearchText] = useState(
    useSearchStore((state) => state.searchText)
  );
  const [currentDate, setCurrentDate] = useState(
    props.location?.state?.title === "Search Appointments"
      ? moment().format("YYYY-MM-DD")
      : ""
  );
  let [appointmentLoaderStatus, setAppointmentLoaderStatus] = useState(false);
  const [upcoming, setUpcoming] = useState(true);
  const [previous, setPrevious] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [totalUpcomingAppointments, setTotalUpcomingAppointments] = useState(0);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [totalPreviousAppointments, setTotalPreviousAppointments] = useState(0);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);

  useEffect(() => {
    getUpcomingAppointments();
    getPreviousAppointments();
  }, [searchText, currentDate]);

  useEffect(() => {
    var selection = localStorage.getItem("doctor-appointment-selection");
    if (selection === "1") {
      handleSelection();
    }
  }, [])


  const handleSetLocalStorage = (value) => {
    if (value) {
      localStorage.setItem("doctor-appointment-selection", 1);
    } else {
      localStorage.setItem("doctor-appointment-selection", 0);
    }
  };

  const handleSelection = () => {
    setUpcoming(!upcoming);
    setPrevious(!previous);
    handleSetLocalStorage(!previous);
  };

  function getUpcomingAppointments(isPagination = false, sortBy = "asc") {
    let params = {
      limit: 20,
      page: isPagination ? upcomingPage : 1,
      sort_order: sortBy,
      sort_key: "time.utc_time",
      search_text: searchText,
      date: currentDate,
      status: ["scheduled", "ongoing"],
    };
    setAppointmentLoaderStatus(true);

    post(API.DOCTOR_GET_APPOINTMENTS_API, params)
      .then((response) => {
        if (response.status === 200) {
          setAppointmentLoaderStatus(false);
          setTotalUpcomingAppointments(response.data.data.total);
          if (isPagination) {
            setUpcomingPage(upcomingPage + 1);
            if (upcomingPage > 1) {
              setUpcomingAppointments([
                ...upcomingAppointments,
                ...response.data.data.docs,
              ]);
            } else {
              setUpcomingAppointments(response.data.data.docs);
            }
          } else {
            setUpcomingPage(2);
            setUpcomingAppointments(response.data.data.docs);
          }
        } else {
          addToast(response.data.message, { appearance: "error" });
          setAppointmentLoaderStatus(false);
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
        setAppointmentLoaderStatus(false);
      });
  }

  const fetchMoreUpcomingData = () => {
    if (totalUpcomingAppointments > upcomingAppointments.length) {
      getUpcomingAppointments(true,"asc");
    }
  };
  function getPreviousAppointments(isPagination = false, sortBy = "desc") {
    let params = {
      limit: 20,
      page: isPagination ? previousPage : 1,
      sort_order: sortBy,
      sort_key: "time.utc_time",
      search_text: searchText,
      date: currentDate,
      status: ["pending", "cancelled", "rejected", "completed"],
    };

    post(API.DOCTOR_GET_APPOINTMENTS_API, params)
      .then((response) => {
        if (response.status === 200 && response.data && response.data.data) {
          setTotalPreviousAppointments(response.data.data.total);
          if (isPagination) {
            setPreviousPage(previousPage + 1);
            if (previousPage > 1) {
              setPreviousAppointments([
                ...previousAppointments,
                ...response.data.data.docs,
              ]);
            } else {
              setPreviousAppointments(response.data.data.docs);
            }
          } else {
            setPreviousPage(2);
            setPreviousAppointments(response.data.data.docs);
          }
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }
  const fetchMorePreviousData = () => {
    if (totalPreviousAppointments > previousAppointments.length) {
      getPreviousAppointments(true,"desc");
    }
  };

  function debounce(txt) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      setSearchText(txt);
    }, 1000);
  }

  const CustomDateComponent = forwardRef(({ value, onClick }, ref) => (
    <>
      <div
        className="calender-date-upcoming"
        onClick={onClick}
        ref={ref}
        style={{ display: "flex", flexDirection: "row" }}
      >
        {moment(value).format("ddd, DD MMM YY")}
        <div style={{ marginLeft: 10 }}>
          <Image src={calendar_blue} />
        </div>
      </div>
    </>
  ));

  return (
    <div>
      <Row className="top-consultants-container">
        <Col lg="1" sm="1" xs="1" />
        <Col lg="11" sm="11" xs="11">
          <Row className="back-navigation">
            <div
              style={{
                backgroundColor: "",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div className="back-nav-container-dr">
                <img
                  src={back_icon}
                  alt="back_icon-img"
                  onClick={() => props.history.goBack()}
                ></img>
                <span>
                  {props.location?.state?.title || "All Appointments"}
                </span>
              </div>
              {props.location?.state?.title === "Search Appointments" && (
                <div className="calendar-container">
                  <DatePicker
                    selected={new Date(currentDate)}
                    onChange={(date) => setCurrentDate(date)}
                    maxDate={
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        15
                      )
                    }
                    placeholderText="Select a date before 30 days in the future"
                    customInput={<CustomDateComponent />}
                  />
                </div>
              )}
            </div>
          </Row>
          <div
            className="search-container"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <SearchInputWithIcon
              col="12"
              placeholder="Search patients"
              defaultValue={searchText}
              className="patient-homepage-search"
              onChange={(e) => debounce(e)}
            ></SearchInputWithIcon>
          </div>

          <Row>
            <span
              style={{ marginLeft: "12px" }}
              className={
                upcoming
                  ? "appointment-page-text-selected"
                  : "appointment-page-text-unselected"
              }
              onClick={handleSelection}
            >
              Upcoming
            </span>
            <span
              className={
                previous
                  ? "appointment-page-text-selected appointment-page-text-margin-left-41"
                  : "appointment-page-text-unselected appointment-page-text-margin-left-41"
              }
              onClick={handleSelection}
            >
              Previous
            </span>
          </Row>
          <Row className="appointment-page-cards-row">
            {upcoming ? (
              <>
                {appointmentLoaderStatus && (
                  <div className="empty-list-container">
                    <Spinner
                      showLoader={appointmentLoaderStatus}
                      width={60}
                      height={60}
                    />
                  </div>
                )}
                <InfiniteScroll
                  dataLength={upcomingAppointments.length}
                  next={fetchMoreUpcomingData}
                  hasMore={true}
                  className="load-data"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {!appointmentLoaderStatus &&
                      upcomingAppointments.map((doctor) => {
                        return (
                          <Grid
                          key={doctor._id}
                            container
                            item
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            spacing={1}
                          >
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
                        );
                      })}
                  </div>
                </InfiniteScroll>
                {!appointmentLoaderStatus && !upcomingAppointments.length && (
                  <div className="empty-list-container">
                    <h4>No appointments found</h4>
                  </div>
                )}
              </>
            ) : (
              <>
                {appointmentLoaderStatus && (
                  <div className="empty-list-container">
                    <Spinner
                      showLoader={appointmentLoaderStatus}
                      width={60}
                      height={60}
                    />
                  </div>
                )}
                <InfiniteScroll
                  dataLength={previousAppointments.length}
                  next={fetchMorePreviousData}
                  hasMore={true}
                  className="load-data"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {!appointmentLoaderStatus &&
                      previousAppointments.map((doctor) => {
                        return (
                          <Grid
                          key={doctor._id}
                            container
                            item
                            lg={4}
                            md={6}
                            sm={6}
                            xs={12}
                            spacing={1}
                          >
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
                        );
                      })}
                  </div>
                </InfiniteScroll>
                {!appointmentLoaderStatus && !previousAppointments.length && (
                  <div className="empty-list-container">
                    <h4>No appointments found</h4>
                  </div>
                )}
              </>
            )}
          </Row>
        </Col>
        <Col lg="1" sm="1" xs="1" />
      </Row>
    </div>
  );
};

export default UpcomingAppointments;
