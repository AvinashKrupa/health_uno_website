import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {Col, Row} from "react-bootstrap";
import SpecialityCard from "../../commonComponentPatient/SpecialityCard";
import {API, get, post} from "../../../api/config/APIController";
import {useEffect, useState} from "react";
import {useToasts} from "react-toast-notifications";
import CarouselComponent from "../../../commonComponent/CarouselComponent";
import Grid from "@material-ui/core/Grid";
import useSearchStore from "../../store/searchStore";
import SearchInputWithIcon from "../../../commonComponent/SearchInputWithIcon";
import SimilarDoctorsCard from "./../doctorDetail/SimilarDoctorsCard";


const PatientHomePage = (props) => {
  let timer = null;
  const {addToast} = useToasts();
  const setSearchText = useSearchStore((state) => state.setSearchText);
  let [specialities, setSpecialities] = useState([]);
  let [slider, setSlider] = useState([]);
  let [consultants, setConsultant] = useState([]);

  useEffect(() => {
    setSearchText('')
    getHomeContent();
    getTopConsultants();
  }, []);

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
    post(API.GETTOPCONSULTANT)
        .then((response) => {
          if (response.status === 200) {
            setConsultant(response.data.data.docs);
          } else {
            addToast(response.data.message, {appearance: "error"});
          }
        })
        .catch((error) => {
          addToast(error.response.data.message, {appearance: "error"});
        });
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
  return (
      <>
        <Col lg="10" sm="10" xs="10" className='screen-768'>
          <Row className="search-container mobileviewSearch">
            <SearchInputWithIcon
                className="patient-homepage-search"
                placeholder="Search doctors"
                onChange={(e) => debounce(e)}
            ></SearchInputWithIcon>
          </Row>
          <Row style={{marginTop: "32px"}}>
            <Col>
              <CarouselComponent sliders={slider}/>
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
                      icon={specialitie.image}
                      label={specialitie.title}
                      setSearchText={debounce}
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
              {consultants.length >3 &&<span className="patient-homepage-link-text " style={{cursor: 'pointer'}} onClick={(e) => props.history.push("/patient/topConsultants")}>View All</span>}
            </Col>
          </Row>
          <Row style={{display: "flex", flexDirection: "row"}}>
            {consultants && consultants.slice(0, 3).map((doctor) => {
              return (
                  <Grid container item lg={4} md={6} sm={6} xs={12} spacing={1}>
                    <SimilarDoctorsCard
                        id={doctor._id}
                        image={doctor.dp}
                        name={`${doctor.first_name} ${doctor.last_name}`}
                        fees={doctor.fee}
                        details={`${doctor.city}, ${doctor.country} | ${doctor.exp}  Y Exp`}
                        qualifications={doctor.specialities}
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
