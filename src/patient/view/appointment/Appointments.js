import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
// import map_pin from "./Map Pin.svg";
import { API, post } from "../../../api/config/APIController";
import { useToasts } from "react-toast-notifications";
import DoctorAppointmentsCard from "./DoctorAppointmentsCard";
import Grid from "@material-ui/core/Grid";
import Spinner from "../../../commonComponent/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

const Appointments = (props) => {
  useEffect(() => {
    getUpcomingAppointments();
    getPreviousAppointments();
    var selection = localStorage.getItem("patient-appointment-selection");
    if (selection === "1") {
      handleSelection();
    }
    return () => {};
  }, []);

  const { addToast } = useToasts();
  const [upcoming, setUpcoming] = useState(true);
  const [previous, setPrevious] = useState(false);
  const [appointmentLoaderStatus, setAppointmentLoaderStatus] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [totalUpcomingAppointments, setTotalUpcomingAppointments] = useState(0);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [totalPreviousAppointments, setTotalPreviousAppointments] = useState(0);
  const [previousPage, setPreviousPage] = useState(1);

  const handleSelection = () => {
    setUpcoming(!upcoming);
    setPrevious(!previous);
    handleSetLocalStorage(!previous);
  };

  const handleSetLocalStorage = (value) => {
    if (value) {
      localStorage.setItem("patient-appointment-selection", 1);
    } else {
      localStorage.setItem("patient-appointment-selection", 0);
    }
  };

  function getUpcomingAppointments(sort_order = "asc", isPagination = false) {
    let params = {
      limit: 20,
      page: isPagination ? upcomingPage : 1,
      sort_order: sort_order,
      sort_key: "time.utc_time",
      date: "",
      status: ["scheduled"],
    };
    setAppointmentLoaderStatus(true);
    post(API.GETAPPOINTMENTS, params)
      .then((response) => {
        if (response.status === 200 && response.data && response.data.data) {
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
            setUpcomingPage(upcomingPage + 1);
            setUpcomingAppointments(response.data.data.docs);
          }
        } else {
          setAppointmentLoaderStatus(false);
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        setAppointmentLoaderStatus(false);
        addToast(error.response.data.message, { appearance: "error" });
      });
  }
  const fetchMoreUpcomingData = () => {
    if (totalUpcomingAppointments > upcomingAppointments.length) {
      getUpcomingAppointments("asc", true);
    }
  };

  function getPreviousAppointments(sort_order = "desc", isPagination = false) {
    let params = {
      limit: 20,
      page: isPagination ? previousPage : 1,
      sort_order: sort_order,
      sort_key: "time.utc_time",
      date: "",
      status: [ "cancelled", "rejected", "ongoing", "completed"],
    };
    setAppointmentLoaderStatus(true);
    post(API.GETAPPOINTMENTS, params)
      .then((response) => {
        if (response.status === 200 && response.data && response.data.data) {
          setAppointmentLoaderStatus(false);
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
            setPreviousPage(previousPage + 1);
            setPreviousAppointments(response.data.data.docs);
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
  const fetchMorePreviousData = () => {
    if (totalPreviousAppointments > previousAppointments.length) {
      getPreviousAppointments("desc", true);
    }
  };

  function cancelAppointment(id, reason) {
    let params = {
      appointment_id: id,
      cancel_reason: reason,
    };

    post(API.CANCELAPPOINTMENT, params)
      .then((response) => {
        if (response.status === 200) {
          addToast(response.data.message, { appearance: "success" });
          getUpcomingAppointments();
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  return (
    <>
      <Row>
        <Col lg="1" md="1" sm="1" xs="1"></Col>
        <Col
          lg="11"
          md="11"
          sm="11"
          xs="11"
          className="screen-768 appointment-page-content-column"
        >
          <Row>
            <span className="appointment-page-text-heading">Appointments</span>
          </Row>
          <Row>
            <span
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
                      upcomingAppointments.map((appointment) => {
                        return (
                          <Grid
                            container
                            item
                            lg={4}
                            md={6}
                            sm={12}
                            xs={12}
                            spacing={0.5}
                            className="appointment-page-cards-upcoming"
                          >
                            <DoctorAppointmentsCard
                              appointment={appointment}
                              cancelAppointment={cancelAppointment}
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
                    {previousAppointments.map((appointment) => {
                      return (
                        <Grid
                          container
                          item
                          lg={4}
                          md={6}
                          sm={12}
                          xs={12}
                          spacing={1}
                          className="appointment-page-cards-previous"
                        >
                          <DoctorAppointmentsCard appointment={appointment} />
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
        {/* <Col lg='1' sm='1' xs='1'>

        </Col> */}
      </Row>
    </>
  );
};
export default Appointments;
