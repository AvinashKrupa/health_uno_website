import DoctorCard from "../../commonComponentPatient/DoctorCard";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
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
import SimilarDoctorsCard from "./../doctorDetail/SimilarDoctorsCard";



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
        <Col lg="1" sm="1" xs="1"> 
<div className="sidebarMenu">


  <SideNav
    onSelect={(selected) => {
        // Add your code here
    }}
>

    <SideNav.Toggle />
    <SideNav.Nav defaultSelected="home">
    <NavItem className="setLogo">
            <NavIcon>
                <img src={process.env.PUBLIC_URL + '/assets/logo.png'} ></img>
            </NavIcon>
            <NavText className="setLogotext">
                HealthUno
            </NavText>
        </NavItem>
        <NavItem eventKey="home">
            <NavIcon>
                <i className="fa fa-fw fa-home" style={{ fontSize: '1.65em' }} />
            </NavIcon>
            <NavText>
                Home
            </NavText>
        </NavItem>
        <NavItem eventKey="Appointments">
            <NavIcon>
                <i className="fa fa-fw fa-calendar" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
            Appointments
            </NavText>
        </NavItem>

        <NavItem eventKey="Prescriptions">
            <NavIcon>
                <i className="fa fa-fw fa-briefcase" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
            Prescriptions
            </NavText>
        </NavItem>

        <NavItem eventKey="Profile">
            <NavIcon>
                <i className="fa fa-fw fa-user" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
            Profile
            </NavText>
        </NavItem>
        
        {/* <NavItem eventKey="charts">
            <NavIcon>
                <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>
                Charts
            </NavText>
            <NavItem eventKey="charts/linechart">
                <NavText>
                    Line Chart
                </NavText>
            </NavItem>
            <NavItem eventKey="charts/barchart">
                <NavText>
                    Bar Chart
                </NavText>
            </NavItem>
        </NavItem> */}
    </SideNav.Nav>
</SideNav>
</div>
 
          {/* <div className="sidebarMenu">
            <div className="logo"><img src="https://healthuno-dev-public.s3.ap-south-1.amazonaws.com/profile-images/avatar.png"></img></div>
            <ui>
              <li><a href="#"><i className="fa fa-home"></i><p>Home</p> </a></li>
              <li><a href="#"><i class="fa fa-calendar" aria-hidden="true"></i><p>Appointments</p> </a></li>
              <li><a href="#"><i class="fa fa-briefcase" aria-hidden="true"></i><p>Prescriptions</p> </a></li>
              <li><a href="#"><i class="fa fa-user" aria-hidden="true"></i><p>Profile</p> </a></li>
            </ui>
          </div>
         */}
        </Col>


        <Col lg="10" sm="10" xs="10">
          <Row className="search-container mobileviewSearch">
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
          <Row className='specialities-container'>
            {specialities && specialities.slice(0, window.screen.availWidth > 1200 ? 8 : 5 ).map((specialitie) => {
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
          </Row>
        </Col>
        <Col lg="1" sm="1" xs="1" />
      </Row>
      <Grid container spacing={1}></Grid>
    </>
  );
};

export default PatientHomePage;
