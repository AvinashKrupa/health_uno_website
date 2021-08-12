import DoctorCard from "../../commonComponentPatient/DoctorCard";
import { Row, Col } from "react-bootstrap";
import SpecialityCard from "../../commonComponentPatient/SpecialityCard";
import { API, get, post } from "../../../api/config/APIController";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { useState } from "react";
import CarouselComponent from "../../../commonComponent/CarouselComponent";
import Grid from "@material-ui/core/Grid";
import useSearchStore from "../../store/searchStore";
import SearchInputWithIcon from "../../../commonComponent/SearchInputWithIcon";

const PatientHomePage = (props) => {
  let timer = null;
  const { addToast } = useToasts();
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
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function getTopConsultants() {
    post(API.GETTOPCONSULTANT)
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
      props.history.push("/patient/topConsultants");
    }, 1000);
  }

  return (
    <>
      <Row className="patient-home-container">
        <Col lg="1" sm="1" xs="1" />
        <Col lg="10" sm="10" xs="10">
          <Row className="search-container">
            <SearchInputWithIcon
              className="patient-homepage-search"
              placeholder="Search doctors"
              onChange={(e) => debounce(e)}
            ></SearchInputWithIcon>
          </Row>
          <Row style={{ marginTop: "32px" }}>
            <Col>
              <CarouselComponent sliders={slider} />
            </Col>
          </Row>
          <Row style={{ marginTop: "42px", marginBottom: "32px" }}>
            <Col>
              <span className="patient-homepage-text-h4">Specialities</span>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <span className="patient-homepage-link-text " style={{cursor: 'pointer'}} onClick={(e) => props.history.push("/patient/specialities")}>View All</span>
            </Col>
          </Row>
          <Row>
            {specialities && specialities.slice(0, 9).map((specialitie) => {
              return (
                <SpecialityCard
                  icon={specialitie.image}
                  label={specialitie.title}
                  setSearchText={debounce}
                />
              );
            })}
          </Row>
          <Row style={{ marginTop: "42px", marginBottom: "32px" }}>
            <Col>
              <span className="patient-homepage-text-h4">Top Consultants</span>
            </Col>
            <Col style={{ textAlign: "right" }}>
                <span className="patient-homepage-link-text " style={{cursor: 'pointer'}} onClick={(e) => props.history.push("/patient/topConsultants")}>View All</span>
            </Col>
          </Row>
          <Row style={{ display: "flex", flexDirection: "row" }}>
            {consultants && consultants.slice(0, 3).map((consultant) => {
              return (
                <Grid container item lg={4} md={6} sm={6} xs={12} spacing={1}>
                  <DoctorCard
                    id={consultant._id}
                    image={consultant.dp}
                    name={`${consultant.first_name}, ${consultant.last_name}`}
                    fees={consultant.fee}
                    details={`${consultant.city}, ${consultant.country} | ${consultant.exp} Y Exp`}
                    qualifications={consultant.specialities}
                  />
                </Grid>
              );
            })}
          </Row>
        </Col>
        <Col lg="1" sm="1" xs="1" />
      </Row>
      <Grid container spacing={1}></Grid>
    </>
  );
};

export default PatientHomePage;
