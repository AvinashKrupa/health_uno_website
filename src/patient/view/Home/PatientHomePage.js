import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import { Row, Col, Button, InputGroup } from "react-bootstrap";
import SpecialityCard from "../../commonComponentPatient/SpecialityCard";
import {API, get, post} from "../../../api/config/APIController";
import {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";
import CarouselComponent from "../../../commonComponent/CarouselComponent";
import Grid from "@material-ui/core/Grid";
import useSearchStore from "../../store/searchStore";
import SearchInputWithIcon from "../../../commonComponent/SearchInputWithIcon";
import SimilarDoctorsCard from "./../doctorDetail/SimilarDoctorsCard";
import NotificationSideBar from "../../../commonComponent/Notification/NotificationSideBar";
import {bell_icon} from "../../../constants/DoctorImages";
import TopConsultantsFilter from '../../commonComponentPatient/TopConsultantsFilter';
import {filter} from "../../../constants/PatientImages"


const PatientHomePage = (props) => {
  let timer = null;
  const {addToast} = useToasts();
  const setSearchText = useSearchStore((state) => state.setSearchText);
  const setSearchSpeciality = useSearchStore((state) => state.setSearchSpeciality);
  let [specialities, setSpecialities] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  let [slider, setSlider] = useState([]);
  let [consultants, setConsultant] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [forceApiCall, setForceApiCall] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: "asc",
    min: "100",
    max: "5000",
    lang: [],
    exp: "",
    specialities: [],
    gen: "",
  });
  const [isFiltered, setIsFiltered] = useState(true);
  const [totalConsultants, setTotalConsultants] = useState(0);


  useEffect(() => {
    setSearchText('')
    getHomeContent();
    getTopConsultants();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.querySelectorAll('[role="navigation"]').forEach(function (el){
      el.classList.add("filter-list-close");
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSidebar = () => {
    if(sidebarOpen) {
      document.querySelectorAll('[role="navigation"]').forEach(function (el){
        el.classList.add("filter-list-close");
      });
    } else {
      document.querySelectorAll('[role="navigation"]').forEach(function (el){
        el.classList.remove("filter-list-close");
      });
    }

    setSidebarOpen(!sidebarOpen);
  }

  const toggleFilterSidebar = () => {
    if (filterSidebarOpen) {
      document.querySelectorAll('[role="navigation"]').forEach(function (el) {
        el.classList.add("filter-list-close");
      });
    } else {
      document.querySelectorAll('[role="navigation"]').forEach(function (el) {
        el.classList.remove("filter-list-close");
      });
    }

    setFilterSidebarOpen(!filterSidebarOpen);
  }

  function getHomeContent() {
    get(API.GETHOMECONTENT)
        .then((response) => {
          if (response.status === 200) {
            setSlider(response.data.data.slider);
            setSpecialities(response.data.data.specialities);
          } else {
            addToast(response.data.message, {appearance: "error"});
          }
        })
        .catch((error) => {
          addToast(error.response.data.message, {appearance: "error"});
        });
  }

  function getTopConsultants() {
    let params = {
      limit: 25,
      sort_order: 'asc',
      sort_key: 'first_name',
    };
    post(API.GETTOPCONSULTANT, params)
        .then((response) => {
          if (response.status === 200) {
            setConsultant(response.data.data.docs);
          } else {
            addToast(response.data.message, {appearance: "error"});
          }
        })
        .catch((error) => {
          console.log(error)
          addToast(error.response.data.message, {appearance: "error"});
        });
  }

  function specialityClickAction(id) {
    setSearchSpeciality(id);
      props.history.push("/patient/topConsultants");
  }

  function debounce(txt) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      setSearchText(txt);
      props.history.push("/patient/topConsultants");
    }, 1000);
  }

  function getNumberOfSpecialityToShow() {
    if (window.screen.availWidth > 1200) {
      return 14
    } else if (window.screen.availWidth > 1023) {
      return 8
    } else {
      return 6
    }
  }

  function callBackFilter(data) {
    setFilters(data);
    setPage(1)
    setIsFiltered(true);
    setForceApiCall(true)
  }

  useEffect(() => {
    if(forceApiCall){
      getTopConsultantsNew(
        filters.sortBy,
        filters.min,
        filters.max,
        filters.hasOwnProperty('lang') ? filters.lang : filters.selectedLanguages,
        filters.hasOwnProperty('exp') ? filters.exp : filters.experience,
        filters.hasOwnProperty('specialities') ? filters.specialities : filters.selectedSpecialities,
        filters.hasOwnProperty('gender') ? filters.gender : filters.gen
      );
    }
  }, [forceApiCall])

  function getTopConsultantsNew(
    sortBy = "asc",
    min = "100",
    max = "5000",
    lang = [],
    exp,
    specialities = [],
    gen = "",
    isPagination = false
  ) {
    let params = {
      limit: 40,
      page: isPagination ? page : 1,
      filter: {
        text: "",
        fee_min: Number(min),
        fee_max: Number(max),
        ...(exp && { exp: Number(exp) }),
        language: lang,
        specialities: specialities,
        gender: gen,
      },
      sort_order: sortBy,
      sort_key: "first_name",
    };
    post(API.GETTOPCONSULTANT, params)
      .then((response) => {
        setForceApiCall(false)
        if (response.status === 200) {
          setTotalConsultants(response.data.data.total);
          if (isPagination) {
            setPage(page + 1);
            if (page > 1) {
              setConsultant([...consultants, ...response.data.data.docs]);
            } else {
              setConsultant(response.data.data.docs);
            }
          } else {
            if (true) {
              setPage(page + 1);
            }
            setConsultant(response.data.data.docs);
          }
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        setForceApiCall(false);
        addToast(
          error &&
            error.response &&
            error.response.data &&
            error.response.data.message,
          { appearance: "error" }
        );
      });
  }

  return (
      <>
        <NotificationSideBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <TopConsultantsFilter sidebarOpen={filterSidebarOpen} toggleSidebar={toggleFilterSidebar} callBackFilter={callBackFilter} initialSelectedSpecialities={filters.specialities}/>
        <Col lg="10" sm="10" xs="10" className='screen-768'>
          <Row className="search-container mobileviewSearch">
            <Col lg="12" sm="12" xs="12" className="search-container search-container-doctor">
            <SearchInputWithIcon
                className="patient-homepage-search"
                placeholder="Search doctors"
                onChange={(e) => debounce(e)}
            ></SearchInputWithIcon>
            <div className="notification-icon-container">
              <InputGroup>
            <Button onClick={toggleFilterSidebar} style={{ marginTop: "13px" }}>
              <img
                src={filter}
                className="patient_hp_fl_button"
                alt="filter-img"
                style={{ height: "26px", width: "24px", zIndex: -1 }}
              ></img>
            </Button>
              <Button onClick={toggleSidebar} style={{marginTop: '33px', cursor: "pointer"}}>
                <img alt="notification icon" className="notification-icon" src={bell_icon} />
              </Button>
              </InputGroup>
            </div>
            </Col>
          </Row>
          <Row style={{marginTop: "32px"}}>
            <Col>
              <CarouselComponent sliders={slider} specialityClickAction={specialityClickAction}/>
            </Col>
          </Row>
          <Row style={{marginTop: "42px", marginBottom: "32px"}}>
            <Col>
              <span className="patient-homepage-text-h4">Specialities</span>
            </Col>
            <Col style={{textAlign: "right"}}>
              {specialities.length > getNumberOfSpecialityToShow() && <span className="patient-homepage-link-text " style={{cursor: 'pointer'}}
                    onClick={(e) => props.history.push("/patient/specialities")}>View All</span>}
            </Col>
          </Row>
          <Row className='specialities-container'>
            {specialities && specialities.slice(0, getNumberOfSpecialityToShow()).map((specialitie) => {
              return (
                  <SpecialityCard
                      key={specialitie._id}
                      icon={specialitie.image}
                      label={specialitie.title}
                      setSearchText={specialityClickAction}
                      onPress={() => {
                        specialityClickAction(specialitie._id)
                      }}
                  />
              );
            })}
            { !specialities.length &&
            <div className="empty-list-container">
              <h4>No specialities found</h4>
            </div>
            }
          </Row>
          <Row style={{marginTop: "42px", marginBottom: "32px"}}>
            <Col>
              <span className="patient-homepage-text-h4">Top Consultants</span>
            </Col>
            <Col style={{ textAlign: "right" }}>
              {consultants.length > 21 &&<span className="patient-homepage-link-text " style={{cursor: 'pointer'}} onClick={(e) => props.history.push("/patient/topConsultants")}>View All</span>}
            </Col>
          </Row>
          <Row style={{display: "flex", flexDirection: "row"}}>
            {consultants && consultants.slice(0, 21).map((doctor) => {
              return (
                  <Grid key={doctor._id} container item lg={4} md={6} sm={width < 910 ? 12 : 6} xs={12} spacing={1}>
                    <SimilarDoctorsCard
                        id={doctor._id}
                        image={doctor.dp}
                        name={`Dr ${doctor.first_name} ${doctor.last_name}`}
                        fees={doctor.fee}
                        details={`${doctor.city}, ${doctor.country} | ${doctor.exp}  Y Exp`}
                        qualifications={doctor.specialities}
                        language={doctor?.language ?? []}
                    />
                  </Grid>
              );
            })}
            { !consultants.length &&
            <div className="empty-list-container">
              <h4>No top Consultant found</h4>
            </div>
            }
          </Row>
        </Col>
      </>
  );
};
export default PatientHomePage;
