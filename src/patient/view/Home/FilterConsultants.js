import { Row, Col, Button, InputGroup, Image } from "react-bootstrap";
import CheckboxList from "../../../commonComponent/CheckboxList";
import InputRange from "react-input-range";
import Input from "../../../commonComponent/Input";
import { API, get } from "../../../api/config/APIController";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import "react-input-range/lib/css/index.css";
import CustomButton from '../../../commonComponent/Button'
import MultiSelect from "../../../commonComponent/MultiSelect/MultiSelect";
import Select from '../../../commonComponent/Select'
import {EXPERIENCE_LIST} from "./constants";
import SelectWithoutDefault from "../../../commonComponent/SelectWithoutDefault";

let isDefaultSet = true;
let genderOptions = ["Male", "Female", "Other"];

const FilterConsultants = (props) => {
  useEffect(() => {
    getLanguage();
    getSpecialities();
    return () => {};
  }, []);

  const { addToast } = useToasts();
  let [minMax, setMinMax] = useState({ min: 100, max: 5000 });
  const [showLanguages, setShowLanguages] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [Specialities, setSpecialities] = useState([]);
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [sortBy, setSortBy] = useState("asc");
  const [experience, setExperience] = useState(10);
  const [gender, setGender] = useState("");

  function getLanguage() {
    get(API.GETLANGUAGE)
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return info.name;
          });
          setLanguages(data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.data.message, { appearance: "error" });
      });
  }

  function getSpecialities() {
    get(API.GETSPECIALITIES)
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: info.title, id: info._id };
          });
          setSpecialities(data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  const setSpecialitiesValue = (e) => {
    const value = e.target.value;
    setSelectedSpecialities(value);
  };

  function handleLanguageGroup(language) {
    isDefaultSet = false;
    let list = JSON.parse(JSON.stringify(selectedLanguages));
    const isPresent = list.includes(language);

    if (isPresent) {
      const index = list.indexOf(language);
      list.splice(index, 1);
    } else {
      list.push(language);
    }
    setSelectedLanguages(list);
  }

  function toggleLanguages() {
    setShowLanguages(!showLanguages);
  }

  function setDefaultValue(e) {
    isDefaultSet = true;
    setSelectedLanguages([]);
    setShowLanguages(true);
    setMinMax({ min: 100, max: 5000 });
    setSortBy("asc");
    setExperience(10);
    setGender('')
    setSelectedSpecialities([]);
  }

  function filter() {
    const min = !isDefaultSet ? minMax.min : 100;
    const max = !isDefaultSet ? minMax.max : 5000;
    props.callBackFilter({
      min,
      max,
      selectedLanguages,
      sortBy,
      experience,
      selectedSpecialities,
      gender
    });
    props.toggleSidebar();
  }

  function onExperienceSelect() {
    let value = document.getElementById("experience").value;
    if(value < 0){
      value= value * -1
    }
    setExperience(value);
  }

  return (
    <>
      <Row className="filter_menu_continer">
        <Col style={{ paddingLeft: "26px", paddingRight: "26px" }}>
          <Row style={{ marginTop: "40px" }} className="filter-close">
            <span
              style={{
                height: "12px",
                width: "12px",
                paddingLeft: "290px",
                cursor: "pointer",
              }}
              onClick={props.toggleSidebar}
            >
              <i class="fas fa-times"></i>
            </span>
          </Row>
          <Row
            style={{
              marginTop: "13px",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <div
              className="filter_menu_h4"
              style={{
                paddingLeft: "16px",
                paddingTop: "33px",
                marginBottom: "16px",
                cursor: "pointer",
              }}
            >
              Filter
            </div>
          </Row>
          <Row style={{ marginTop: "15.5px" }}>
            <hr className="rounded"></hr>
          </Row>
          <Row>
            <span className="filter_menu_h4" style={{ paddingLeft: "16px" }}>
              Sort By
            </span>
          </Row>
          <Row style={{ marginTop: "16px " }}>
            <InputGroup style={{ marginTop: "16px " }}>
              <Button
                value={"asc"}
                className="filter_menu_button"
                style={{
                  marginLeft: "18px",
                  color: sortBy === "asc" ? "white" : "",
                  backgroundColor: sortBy === "asc" ? "#28A3DA" : "",
                }}
                onClick={(e) => {
                  isDefaultSet = false;
                  setSortBy(e.target.value);
                }}
              >
                A-Z
              </Button>
              <Button
                value={"desc"}
                className="filter_menu_button"
                style={{
                  marginLeft: "18px",
                  color: sortBy === "desc" ? "white" : "",

                  backgroundColor: sortBy === "desc" ? "#28A3DA" : "",
                }}
                onClick={(e) => {
                  isDefaultSet = false;
                  setSortBy(e.target.value);
                }}
              >
                Z-A
              </Button>
            </InputGroup>
          </Row>
          <Row>
            <span
              className="filter_menu_h4"
              style={{ paddingLeft: "16px", paddingTop: "27px" }}
            >
              Consultation Fees
            </span>
            <InputRange
              step={100}
              className="filter_menu_inputrange"
              minValue={100}
              maxValue={5000}
              value={minMax}
              onChange={(value) => {
                isDefaultSet = false;
                setMinMax(value);
              }}
              formatLabel={(value) => `₹ ${value}`}
              onChangeComplete={null}
            />
          </Row>
          <Row style={{ marginTop: "33px" }}>
            <span className="filter_menu_h4">Gender</span>
            <Select
                  // label="Gender"
                  placeholder="Select gender"
                  id="gender"
                  value={gender}
                  options={genderOptions}
                  handleSelect={setGender}
                />
          </Row>
          <Row style={{ marginTop: "33px" }}>
            <span
              className="filter_menu_h4"
              style={{ paddingLeft: "16px", paddingTop: "25px" }}
            >
              Language
            </span>
            <span style={{ cursor: "pointer", paddingLeft: "144px" }}>
              {showLanguages ? (
                <i
                  class="fas fa-chevron-up filter_menu_image"
                  onClick={toggleLanguages}
                ></i>
              ) : (
                <i
                  class="fas fa-chevron-down filter_menu_image"
                  onClick={toggleLanguages}
                ></i>
              )}
            </span>
            {showLanguages ? (
              <div className="filter_menu_scrollable_div">
                <CheckboxList
                  onClick={handleLanguageGroup}
                  list={languages}
                  selectedLanguages={selectedLanguages}
                />
              </div>
            ) : null}
            <Col md>
              <div
                className="filter_menu_h4"
                style={{ paddingLeft: "5px", paddingTop: "20px" }}
              >
                Min Experience (In years)
              </div>
              <Col>
                <Input
                  type="number"
                  min="0"
                  value={experience}
                  id="experience"
                  onChange={onExperienceSelect}
                />
              </Col>
            </Col>
          </Row>
          <Row>
            <Col md>
              <MultiSelect
                isPositionTop={true}
                label="Specialities"
                className="languageSelection"
                labelBold="filter_menu_h4"
                selected={selectedSpecialities}
                options={Specialities}
                handleChange={setSpecialitiesValue}
              />
            </Col>
          </Row>

          <div>
            <CustomButton
              className="filter_menu_h5"
              onClick={(e) => filter()}
              text={"Apply"}
            ></CustomButton>
            <CustomButton
              className="filter_menu_h5"
              onClick={(e) => setDefaultValue()}
              text={"Clear"}
            ></CustomButton>
          </div>
        </Col>
      </Row>
    </>
  );
};
export default FilterConsultants;
