import Input from "../../../commonComponent/Input";
import TextArea from "../../../commonComponent/TextArea";
import { Col, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { API, get, post } from "../../../api/config/APIController";
import { useToasts } from "react-toast-notifications";
import CustomButton from "../../../commonComponent/Button";
import Spinner from "../../../commonComponent/Spinner";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
import { storeData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import MultiSelect from "../../../commonComponent/MultiSelect/MultiSelect";

const DoctorEditProfile = (props) => {
  // Get state and language from server
  const [showLoader, setShowLoader] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [experience, setExperience] = useState(1);
  const [loader, setLoader] = useState(false);
  const [dataLanguage, setDataLanguage] = useState([]);
  const [language, setLanguage] = useState([]);

  useEffect(() => {
    getUserProfile();
    getState();
    getLanguage();
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [dataState, setDataState] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const { addToast } = useToasts();

  const setLanguageValue = (e) => {
    const value = e.target.value;
    setLanguage(value);
  };

  const getStateValue = (value) => {
    if (value) {
      const selectedState = dataState.find((state) => state.value === value);
      return selectedState ? `${selectedState.id}|${selectedState.value}` : "";
    } else {
      return "";
    }
  };

  // Get language from server
  function getLanguage() {
    get(API.GETLANGUAGE)
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: info.name, id: info._id };
          });
          setDataLanguage(data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.data.message, { appearance: 'error' });
      });
  }

  const getCityValue = (value) => {
    if (value) {
      const selectedCity = dataCity.find((city) => city.value === value);
      return selectedCity ? `${selectedCity.id}|${selectedCity.value}` : "";
    } else {
      return "";
    }
  };

  function getUserProfile() {
    get(API.GET_PROFILE)
      .then((response) => {
        if (response.status === 200) {
          let user = response.data.data.user;
          const additional_info = response.data.data["additional_info"];
          if (user) {
            storeData("userInfo", JSON.stringify(user));
          }
          if (additional_info) {
            storeData("additional_info", JSON.stringify(additional_info));
          }
          const selectedLanguage = user.language.map(language => language._id)
          let additionalInfo = response.data.data.additional_info;
          setFirstName(user.first_name);
          setLastName(user.last_name);
          setEmail(user.email);
          setGender(user.gender);
          setDescription(additionalInfo.desc);
          setMobile(user.mobile_number);
          setBirthDate(user.dob);
          setAddressLine1(additionalInfo.address.line1);
          setAddressLine2(additionalInfo.address.line2);
          setState(additionalInfo.address.state);
          setCity(additionalInfo.address.city);
          setCountry(additionalInfo.address.country);
          setExperience(additionalInfo.qualif.exp);
          setLanguage(selectedLanguage);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  // Edit Profile
  function updateUserProfile() {
    let params = {
      first_name: firstName,
      last_name: lastName,
      desc: description,
      type: "2",
      ...(props.profilePic && { dp: props.profilePic && props.profilePic }),
      address: {
        line1: addressLine1,
        line2: addressLine2,
        state: state,
        city: city,
        country: country,
      },
      language: language,
      qualif: {
        exp: Number(experience),
      },
    };
    setShowLoader(true);
    post(API.UPDATE_PROFILE, params, true)
      .then((response) => {
        if (response.status === 200) {
          setShowLoader(false);
          addToast(response.data.message, { appearance: "success" });
        } else {
          setShowLoader(false);
          addToast(response.data.message, { appearance: "error" });
        }
        props.setReloadSideColumn(true);
      })
      .catch((error) => {
        setShowLoader(false);
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

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
          setCity("Select city");
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

  return (
    <div className="form-wizard edit-doctor-container">
      <Row>
        <Row>
          <h2 className="sub-title">Edit Profile</h2>
        </Row>
        <Col md className="registration-page-1-column">
          <Input
            label="First Name"
            type="text"
            placeholder="eg John"
            maxLength="20"
            value={firstName}
            onChange={setFirstName}
          />
        </Col>
        <Col md className="registration-page-1-column">
          <Input
            label="Last Name"
            type="text"
            placeholder="eg Doe"
            maxLength="20"
            value={lastName}
            onChange={setLastName}
          />
        </Col>
      </Row>
      <Row>
        <Col md>
          <Input
            label="Mobile Number"
            type="number"
            readonly={true}
            value={mobile}
            onChange={setMobile}
          />
        </Col>
        <Col md>
          <Input
            label="Email"
            type="email"
            readonly={true}
            value={email}
            onChange={setEmail}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Input
            label="Date of Birth"
            type="date"
            readonly={true}
            onChange={setBirthDate}
            value={birthDate}
          />
        </Col>
        <Col md>
          <Input readonly={true} label="Gender" value={gender} id="gender" />
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
        <Col md>
          <Input
            type="text"
            placeholder="Enter address"
            id="addressLine1"
            label="Address Line 1"
            value={addressLine1}
            onChange={setAddressLine1}
          />
        </Col>
        <Col md>
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
            value={country}
            type="text"
            placeholder="India"
            id="country"
            label="Country"
          />
        </Col>
        <Col md>
          <Row className="g-2">
            <Col md>
              <KeyValueSelector
                defaultValue={state}
                value={getStateValue(state)}
                disabled={true}
                label="State"
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
                defaultValue={city}
                id="city"
                value={getCityValue(city)}
                options={dataCity}
                handleSelect={setCityValue}
                label="City"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="g-2">
        <MultiSelect
          label="Language"
          className="languageSelection"
          selected={language}
          options={dataLanguage}
          handleChange={setLanguageValue}
        />

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
        <Col md></Col>
      </Row>
      <Col className="form-btn">
        {showLoader && (
          <CustomButton
            className="multistepform-button edit-profile-update-button"
            disabled
            onClick={updateUserProfile}
            importantStyle={{ backgroundColor: "#e2e9e9" }}
            showLoader={showLoader}
          ></CustomButton>
        )}
        {!showLoader && (
          <CustomButton
            className="multistepform-button edit-profile-update-button"
            onClick={updateUserProfile}
            text={"Update"}
          ></CustomButton>
        )}
      </Col>
    </div>
  );
};
export default DoctorEditProfile;
