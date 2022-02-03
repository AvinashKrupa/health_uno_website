import { Row, Col } from "react-bootstrap";
import { API, get } from "../../../api/config/APIController";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { useState } from "react";
import useSearchStore from "../../store/searchStore";
import SpecialityCard from "../../commonComponentPatient/SpecialityCard";
import SearchInputWithIcon from "../../../commonComponent/SearchInputWithIcon";
import { back_icon } from "../../../constants/DoctorImages";

const Specialities = (props) => {
  const { addToast } = useToasts();
  const setSearchSpeciality = useSearchStore((state) => state.setSearchSpeciality);
  let [searchText, setSearchText] = useState("");
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    getSpecialization();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function getSpecialization() {
    get(API.GETSPECIALITIES)
      .then((response) => {
        if (response.status === 200) {
          setSpecialities(response.data.data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function handleSearch(txt) {
    setSearchText(txt);
  }

  function specialityClickAction(id) {
    setSearchSpeciality(id);
    props.history.push("/patient/topConsultants");
  }

  function getSpecializationList() {
    const filteredList =
      searchText !== ""
        ? specialities.filter((post) => {
            return post.title.toLowerCase().includes(searchText.toLowerCase())
              ? post
              : null;
          })
        : specialities;

    return filteredList.map((specialitie) => {
      return (
        <SpecialityCard
          key={specialitie._id}
          icon={specialitie.image}
          label={specialitie.title}
          setSearchText={specialityClickAction}
          onPress={() => {
            specialityClickAction(specialitie._id);
          }}
        />
      );
    });
  }

  return (
    <div>
      <Row className="top-consultants-container">
        <Col lg="1" sm="1" xs="1" />
        <Col lg="10" sm="10" xs="10" className="screen-768">
          {/* <Row className='back-navigation'>
            <div><i class="fas fa-arrow-left" style={{cursor: 'pointer', paddingRight: '27px'}} onClick={() =>  props.history.push('/patient/home')}></i><span>Specialities</span></div>
          </Row> */}
          <button className="back-nav-container back-navigation">
            <img
              src={back_icon}
              alt="back_icon-img"
              onClick={() => props.history.push("/patient/home")}
            ></img>
            <span>Specialities</span>
          </button>
          <Row className="search-container">
            <SearchInputWithIcon
              placeholder="Search specialities"
              className="patient-homepage-search"
              onChange={(e) => handleSearch(e)}
            ></SearchInputWithIcon>
          </Row>
          <Row style={{ marginTop: "42px", marginBottom: "32px" }}>
            <Col>
              <span className="patient-homepage-text-h4">Specialities</span>
            </Col>
          </Row>
          <Row className="specialities-container">
            {getSpecializationList()}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Specialities;
