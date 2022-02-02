import Input from "../../../commonComponent/Input";
import TextArea from "../../../commonComponent/TextArea";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
import Select from "../../../commonComponent/Select";
import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { API, get, post } from "../../../api/config/APIController";
import { useToasts } from "react-toast-notifications";
import Spinner from "../../../commonComponent/Spinner";
import ProfilePictureColumn from "./profilePictureColumn";
import moment from "moment";
import MultiSelect from "../../../commonComponent/MultiSelect/MultiSelect";

const DocRegistrationPage1 = (props) => {
  // Get state and language from server
  useEffect(() => {
    getState();
    getLanguage();
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    firstName,
    lastName,
    mobile,
    email,
    birthDate,
    gender,
    city,
    state,
    language,
    addressLine1,
    addressLine2,
    description,
    setFirstName,
    setLastName,
    setMobile,
    experience,
    setExperience,
    setBirthDate,
    setEmail,
    setGender,
    setCity,
    setState,
    setAddressLine1,
    setAddressLine2,
    setDescription,
    setLanguageValue,
  } = props;
  const [dataState, setDataState] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  let [loader, setLoader] = useState(false);
  const [dataLanguage, setDataLanguage] = useState([]);
  const { addToast } = useToasts();

  let genderOptions = ["Male", "Female", "Other"];

  useEffect(() => {
    if (props.state && dataCity.length === 0) {
      const stateData = dataState.find((state) => state.value === props.state);
      if (stateData) {
        getCity(stateData.id);
      }
    }
    return () => {};
  }, [dataState]); // eslint-disable-line react-hooks/exhaustive-deps

  const getStateValue = (value) => {
    if (value) {
      const selectedState = dataState.find((state) => state.value === value);
      return selectedState ? `${selectedState.id}|${selectedState.value}` : "";
    } else {
      return "";
    }
  };

  const getCityValue = (value) => {
    if (value) {
      const selectedCity = dataCity.find((city) => city.value === value);
      return selectedCity ? `${selectedCity.id}|${selectedCity.value}` : "";
    } else {
      return "";
    }
  };

  const setIdAndState = (value) => {
    const stateInfo = value.split("|");
    getCity(stateInfo[0]);
    setState(stateInfo[1]);
    stateInfo[1] === "Select state" && setCity("Select city");
  };

  const setCityValue = (value, id) => {
    const cityInfo = value.split("|");
    setCity(cityInfo[1]);
  };

  // Get city from server
  function getCity(id) {
    setLoader(true);
    post(API.GETCITY, { countryId: 101, stateId: parseInt(id) })
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: info.name, id: info.id };
          });
          setLoader(false);
          setDataCity(data);
        } else {
          setLoader(false);
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        setLoader(false);
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  // Get state from server
  function getState() {
    post(API.GETSTATE, { countryId: 101 })
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: info.name, id: info.id };
          });
          setDataState(data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  // Get language from server
  function getLanguage() {
    get(API.GETLANGUAGE)
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: info.name, id: info._id, name:info.name };
          });
          setDataLanguage(data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.data.message, { appearance: "error" });
      });
  }

  return (
    <div className="registration-page-1-container">
      <Row>
        <Col lg="4">
          <ProfilePictureColumn setImage={props.setImage} />
        </Col>
        <Col lg="6">
          <Row>
            <Col className="registration-page-1-column">
              <Input
                label="First Name"
                type="text"
                placeholder="Enter Your First Name"
                maxLength="20"
                value={firstName}
                onChange={setFirstName}
              />
            </Col>
            <Col className="registration-page-1-column">
              <Input
                label="Last Name"
                type="text"
                placeholder="Enter Your Surname"
                maxLength="20"
                value={lastName}
                onChange={setLastName}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Input
                label="Mobile Number"
                type="number"
                readonly={true}
                value={mobile}
                onChange={setMobile}
              />
            </Col>
            <Col>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={setEmail}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <br />
              <Form.Label>Date of Birth</Form.Label>
              <br />
              <Form.Control
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                min={moment(new Date())
                  .subtract(100, "years")
                  .format("YYYY-MM-DD")}
                max={moment(new Date()).format("YYYY-MM-DD")}
              />
            </Col>
            <Col>
              <Select
                label="Gender"
                defaultValue="Select Gender"
                id="gender"
                value={gender}
                options={genderOptions}
                handleSelect={setGender}
              />
            </Col>
          </Row>
          <Row className="form-wizard-text-area">
            <Col>
              <TextArea
                label="Profile Description"
                type="textarea"
                row="3"
                value={description}
                placeholder="Write here"
                onChange={setDescription}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Input
                type="text"
                placeholder="Enter address"
                id="addressLine1"
                label="Address Line 1"
                value={addressLine1}
                onChange={setAddressLine1}
              />
            </Col>
            <Col>
              <Input
                type="text"
                placeholder="Enter address (optional)"
                id="addressLine2"
                label="Address Line 2"
                value={addressLine2}
                onChange={setAddressLine2}
              />
            </Col>
          </Row>
          <Row className="g-2">
            <Col md>
              <Input
                disabled={true}
                type="text"
                placeholder="India"
                id="country"
                label="Country"
                readOnly={true}
              />
            </Col>
            <Col md>
              <Row className="g-2">
                <Col md>
                  <KeyValueSelector
                    value={getStateValue(state)}
                    label="State"
                    defaultValue="Select state"
                    id="state"
                    options={dataState}
                    handleSelect={setIdAndState}
                  />
                </Col>
                <Col md style={{ position: "relative" }}>
                  {loader && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 6,
                        top: "60px",
                        left: "60px",
                      }}
                    >
                      <Spinner showLoader={loader} width={40} height={40} />
                    </div>
                  )}
                  <KeyValueSelector
                    value={getCityValue(city)}
                    label="City"
                    defaultValue="Select city"
                    id="city"
                    options={dataCity}
                    handleSelect={setCityValue}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="g-2">
            <Col md>
              <MultiSelect
                className="languageRegistration"
                label="Language"
                selected={language}
                options={dataLanguage}
                handleChange={setLanguageValue}            
              />
            </Col>

            <Col md>
              <Input
                type="text"
                placeholder="Enter Your Experience"
                id="experienceField"
                label="Experience"
                value={experience}
                pattern="[0-9]*"
                onChange={(value) => {
                  setExperience(value.replace(/\D/, "").slice(0, 2));
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col lg="2"> </Col>
      </Row>
    </div>
  );
};
export default DocRegistrationPage1;
