import React, { useContext, useEffect, useState } from "react";
import Input from "../../../commonComponent/Input";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
import Selector from "../../../commonComponent/Select";
import TextArea from "../../../commonComponent/TextArea";
import { Col, Form, Row } from "react-bootstrap";
import Radio from "../../../commonComponent/Radio";
import Checkbox from "../../../commonComponent/Checkbox";
import ModalDialog from "../../../commonComponent/ModalDialog";
import { AuthContext } from "../../../context/AuthContextProvider";
import { isEmailValid, isEmpty, isNumberOnly } from "../../../utils/Validators";
import { useToasts } from "react-toast-notifications";
import { API, get, post } from "../../../api/config/APIController";
import CustomButton from "../../../commonComponent/Button";
import { withRouter } from "react-router-dom";
import useUserStore from "../../store/userStore";
import { storeData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import Spinner from "../../../commonComponent/Spinner";
import moment from "moment";
import { getPushToken } from "../../../notification/utilities";
import TermsAndCondition from "../TermsAndConditions";
import { capitalizeFirstLetter } from "../../../utils/utilities";

const RegistrationComponent = ({ history, image }) => {
  // Get state and language from server
  useEffect(() => {
    getState();
    getLanguage();
    if (!mobile) {
      history.push(`/patient`);
      return;
    }
    return () => {};
  }, []);

  const { addToast } = useToasts();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const authContext = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState(authContext.phone);
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const currentDate = new Date();
  const [gender, setGender] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [isDiabetic, setIsDiabetic] = useState(false);
  const [diabetics, setDiabetics] = useState([
    { id: "yes", value: "Yes", checked: false },
    { id: "no", value: "No", checked: false },
  ]);
  const [diabeticValue, setDiabeticValue] = useState("");
  const [hypertensiveValue, setHypertensiveValue] = useState("");
  const [hypertensives, setHypertensives] = useState([
    { id: "yes", value: "Yes", checked: false },
    { id: "no", value: "No", checked: false },
  ]);
  const [isHypertensive, setIsHypertensive] = useState(false);
  const [surgerys, setSurgerys] = useState([
    { id: "yes", value: "Yes", checked: false },
    { id: "no", value: "No", checked: false },
  ]);
  const [isSurgery, setIsSurgery] = useState(false);
  const [surgeryValue, setSurgeryValue] = useState("");
  const [allergieValue, seAllergieValue] = useState("");
  const [allergies, setAllergies] = useState([
    { id: "yes", value: "Yes", checked: false },
    { id: "no", value: "No", checked: false },
  ]);
  const [isAllergie, setIsAllergie] = useState(false);
  const [covids, setCovids] = useState([
    { id: "yes", value: "Yes", checked: false },
    { id: "no", value: "No", checked: false },
  ]);
  const [isCovid, setIsCovid] = useState(false);
  const [otherMedical, setOtherMedical] = useState("");
  const [referalCode, setReferalCode] = useState("");
  const [termsCondition, setTermsCondition] = useState(false);
  const [dataState, setDataState] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataLanguage, setDataLanguage] = useState([]);
  const [language, setLanguage] = useState("");
  let [loader, setLoader] = useState(false);
  const [vaccinated, setVaccinated] = useState([
    { id: "yes", value: "Yes", checked: false },
    { id: "no", value: "No", checked: false },
  ]);
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [vaccineDate, setVaccineDate] = useState("");
  const [dose, setDose] = useState("");
  const [vaccineName, setVaccineName] = useState("");
  const [covidDetails, handleCovidDetails] = useState("");
  const [modalShow, setModalShow] = useState(false);

  const setLanguageValue = (value) => {
    const lanInfo = value.split("|");
    setLanguage(lanInfo[0]);
  };

  // Need state id to get city API call
  // so KeyValueGenerator option has value like {`${item.id}|${item.value}`}
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

  const handleDiabetic = (id) => {
    setIsDiabetic(id === "yes");

    const newDiabetic = diabetics.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });

    setDiabetics(newDiabetic);
  };

  const handleHypertensive = (id) => {
    setIsHypertensive(id === "yes");

    const newHypertensives = hypertensives.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });

    setHypertensives(newHypertensives);
  };

  const handleSurgerys = (id) => {
    setIsSurgery(id === "yes");

    const newSurgerys = hypertensives.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });

    setSurgerys(newSurgerys);
  };

  const handleAllergies = (id) => {
    setIsAllergie(id === "yes");

    const newAllergies = allergies.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });

    setAllergies(newAllergies);
  };

  const handleCovids = (id) => {
    setIsCovid(id === "yes");

    const newCovids = covids.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });

    setCovids(newCovids);
  };

  const handleVaccinated = (id) => {
    setIsVaccinated(id === "yes");

    const newHypertensives = vaccinated.map((item) => {
      return Object.assign({}, item, { checked: item.id === id });
    });

    setVaccinated(newHypertensives);
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
        addToast(error.data.message, { appearance: "error" });
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

  // Get city from server
  function getCity(id) {
    setLoader(true);
    post(API.GETCITY, { countryId: 101, stateId: parseInt(id) })
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: capitalizeFirstLetter(info.name), id: info.id };
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

  function validation() {
    console.log("isCovid: ", isCovid);
    if (isEmpty(firstName)) {
      addToast("Please enter first name", { appearance: "error" });
      return false;
    } else if (isEmpty(lastName)) {
      addToast("Please enter last name", { appearance: "error" });
      return false;
    } else if (isEmpty(authContext.phone)) {
      addToast("Please enter mobile number", { appearance: "error" });
      return false;
    } else if (isNumberOnly(authContext.phone)) {
      addToast("Please enter mobile number", { appearance: "error" });
      return false;
    } else if (isEmpty(email)) {
      addToast("Please enter email id", { appearance: "error" });
      return false;
    } else if (!isEmailValid(email)) {
      addToast("Please enter valid email id", { appearance: "error" });
      return false;
    } else if (isEmpty(birthDate)) {
      addToast("Please select your date of birth", { appearance: "error" });
      return false;
    } else if (currentDate < new Date(birthDate)) {
      addToast("Please select date of birth before the current date", {
        appearance: "error",
      });
      return false;
    } else if (isEmpty(gender) || gender === "Select Gender") {
      addToast("Please select gender", { appearance: "error" });
      return false;
    } else if (isEmpty(addressLine1)) {
      addToast("Please enter address line 1", { appearance: "error" });
      return false;
    } else if (isEmpty(state) || state === "Select state") {
      addToast("Please select state", { appearance: "error" });
      return false;
    } else if (isEmpty(city) || city === "Select city") {
      addToast("Please select city", { appearance: "error" });
      return false;
    } else if (isEmpty(language) || language === "Select language") {
      addToast("Please select language", { appearance: "error" });
      return false;
    } else if (isEmpty(isDiabetic)) {
      addToast("Please select diabetic", { appearance: "error" });
      return false;
    } else if (isDiabetic === true && isEmpty(diabeticValue)) {
      addToast("Please select diabetic from", { appearance: "error" });
      return false;
    } else if (currentDate < new Date(diabeticValue)) {
      addToast("Please select diabetic from before the current date", {
        appearance: "error",
      });
      return false;
    } else if (isEmpty(isHypertensive)) {
      addToast("Please select hypertensive", { appearance: "error" });
      return false;
    } else if (isHypertensive === true && isEmpty(hypertensiveValue)) {
      addToast("Please select hypertensive from", { appearance: "error" });
      return false;
    } else if (currentDate < new Date(hypertensiveValue)) {
      addToast("Please select hypertensive from before the current date", {
        appearance: "error",
      });
      return false;
    } else if (isEmpty(isSurgery)) {
      addToast("Please select surgeries", { appearance: "error" });
      return false;
    } else if (isSurgery === true && isEmpty(surgeryValue)) {
      addToast("Please mention about your surgeries", { appearance: "error" });
      return false;
    } else if (isEmpty(isAllergie)) {
      addToast("Please select allergies", { appearance: "error" });
      return false;
    } else if (isAllergie === true && isEmpty(allergieValue)) {
      addToast("Please mention allergies", { appearance: "error" });
      return false;
    } else if (isEmpty(isCovid)) {
      addToast("Please select: Have you been diagnosed with Covid?", {
        appearance: "error",
      });
      return false;
    } else if (isCovid === true && isEmpty(covidDetails)) {
      addToast("Please add covid details", { appearance: "error" });
      return false;
    } else if (isEmpty(isVaccinated)) {
      addToast("Please select: Have you been vaccinated against Covid?", {
        appearance: "error",
      });
      return false;
    } else if (isVaccinated === true && isEmpty(vaccineDate)) {
      addToast("Please select vaccinated date", { appearance: "error" });
      return false;
    } else if (
      isVaccinated === true &&
      (isEmpty(dose) || dose === "Choose dose type")
    ) {
      addToast("Please select vaccinated dose", { appearance: "error" });
      return false;
    } else if (
      isVaccinated === true &&
      (isEmpty(vaccineName) || vaccineName === "Choose vaccine name")
    ) {
      addToast("Please select vaccine name ", { appearance: "error" });
      return false;
    } else if (termsCondition === false) {
      addToast("Please accept terms and condition", { appearance: "error" });
      return false;
    } else {
      return true;
    }
  }

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

  const getLanguageValue = (value) => {
    if (value) {
      const selectedLanguage = dataLanguage.find(
        (language) => language.id === value
      );
      return selectedLanguage
        ? `${selectedLanguage.id}|${selectedLanguage.value}`
        : "";
    } else {
      return "";
    }
  };

  async function registerUserAPICalling() {
    const foundPushToken = await getPushToken();
    let params = {
      first_name: firstName,
      last_name: lastName,
      mobile_number: authContext.phone,
      country_code: "+91",
      device_type: "web",
      device_token: foundPushToken,
      type: "1",
      dob: birthDate,
      gender: gender,
      height: height,
      weight: weight,
      email: email,
      language: language,
      dp: image,
      med_cond: [
        {
          name: "diabetic",
          selected: isDiabetic,
          diag_at: isDiabetic ? diabeticValue : "",
          desc: "",
        },
        {
          name: "hypertensive",
          selected: isHypertensive,
          diag_at: isHypertensive ? hypertensiveValue : "",
          desc: "",
        },
        {
          name: "diagnosed_with_covid",
          selected: isCovid,
          diag_at: "",
          desc: isCovid ? covidDetails : "",
        },
        {
          name: "past_surgeries",
          selected: isSurgery,
          diag_at: "",
          desc: isSurgery ? surgeryValue : "",
        },
        {
          name: "allergy_to_meds",
          selected: isAllergie,
          diag_at: "",
          desc: isAllergie ? allergieValue : "",
        },
        {
          name: "covid_vaccinated",
          selected: isVaccinated,
          diag_at: isVaccinated ? vaccineDate : "",
          desc: "",
          meta: isVaccinated
            ? [
                {
                  name: "dose_type",
                  selected: true,
                  diag_at: "",
                  desc: dose,
                },
                {
                  name: "vaccine_name",
                  selected: true,
                  diag_at: "",
                  desc: vaccineName,
                },
              ]
            : [],
        },
      ],
      other_med_cond: otherMedical,
      refer_code: referalCode,
      address: {
        line1: addressLine1,
        line2: addressLine2,
        state: state,
        city: city,
        country: country,
      },
    };

    post(API.REGISTERPATIENT, params, true)
      .then((response) => {
        if (response.status === 200) {
          const user = response.data.data["user"];
          const additional_info = response.data.data["additional_info"];

          if (user) {
            storeData("userInfo", JSON.stringify(user));
            setUserInfo(user);
          }
          if (additional_info) {
            storeData("additional_info", JSON.stringify(additional_info));
          }
          addToast(response.data.message, { appearance: "success" });
          history.push("/patient/home");
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  const genderOptions = ["Male", "Female", "Other"];
  const dosages = ["First", "Second"];
  const vaccineNames = [
    "Covishield",
    "Covaxin",
    "Sputnik",
    "J&J",
    "Pfizer",
    "Others",
  ];

  return (
    <div className="container">
      <div>
        <Row className="g-2">
          <Col md>
            <Input
              type="text"
              placeholder="Enter Your First Name"
              id="firstName"
              label="First Name"
              maxLength="20"
              value={firstName}
              onChange={setFirstName}
            />
          </Col>
          <Col md>
            <Input
              type="text"
              placeholder="Enter Your Surname"
              id="lastName"
              label="Last Name"
              maxLength="20"
              value={lastName}
              onChange={setLastName}
            />
          </Col>
        </Row>
        <Row className="g-2">
          <Col md>
            <Input
              type="number"
              id="mobile"
              label="Mobile Number"
              readonly="true"
              value={mobile}
              onChange={setMobile}
            />
          </Col>
          <Col md>
            <Input
              type="email"
              placeholder="Enter your email address"
              id="email"
              label="Email"
              value={email}
              onChange={setEmail}
            />
          </Col>
        </Row>
        <Row className="g-2">
          <Col md>
            <br />
            <Form.Label>Date of birth</Form.Label>
            <br />
            <Form.Control
              type="date"
              onKeyDown={(e) => e.preventDefault()}
              onChange={(e) => setBirthDate(e.target.value)}
              min={moment(new Date()).subtract(100, 'years').format('YYYY-MM-DD')}
              max={moment(new Date()).format('YYYY-MM-DD')}
            />
          </Col>
          <Col md>
            <Selector
              label="Gender"
              defaultValue="Select Gender"
              id="gender"
              options={genderOptions}
              handleSelect={setGender}
            />
          </Col>
        </Row>
        <Row className="g-2">
          <Col md>
            <Input
              type="number"
              placeholder="Enter Your Height (optional)"
              id="height"
              label="Height"
              value={height}
              onChange={setHeight}
            />
          </Col>
          <Col md>
            <Input
              type="number"
              placeholder="Enter Your Weight (optional)"
              id="weight"
              label="Weight"
              value={weight}
              onChange={setWeight}
            />
          </Col>
        </Row>
        <Row className="g-2">
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
              type="text"
              placeholder="India"
              id="country"
              label="Country"
              readonly="true"
              value={country}
              onChange={setCountry}
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
            <KeyValueSelector
              value={getLanguageValue(language)}
              label="Language"
              defaultValue="Select language"
              id="Language"
              options={dataLanguage}
              handleSelect={setLanguageValue}
            />
          </Col>
          <Col md></Col>
        </Row>
        <Row className="g-2">
          <Col md>
            <Row>
              <Radio
                label="Are you Diabetic?"
                id="radioDiabetes"
                options={diabetics}
                handleSelect={handleDiabetic}
              />
            </Row>
            <Row>
              {isDiabetic && (
                <Col>
                  <br />
                  <br />{" "}
                  <Form.Control
                    type="date"
                    onKeyDown={(e) => e.preventDefault()}
                    min={moment(new Date()).subtract(50, 'years').format('YYYY-MM-DD')}
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    onChange={(e) => setDiabeticValue(e.target.value)}
                  />
                </Col>
              )}
            </Row>
          </Col>
          <Col md>
            <Row>
              <Radio
                label="Are you Hypertensive?"
                id="radioHypertensive"
                options={hypertensives}
                handleSelect={handleHypertensive}
              />
            </Row>
            <Row>
              {isHypertensive && (
                <Col>
                  <br />
                  <br />{" "}
                  <Form.Control
                    type="date"
                    onKeyDown={(e) => e.preventDefault()}
                    min={moment(new Date()).subtract(50, 'years').format('YYYY-MM-DD')}
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    onChange={(e) => setHypertensiveValue(e.target.value)}
                  />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
        <Row className="g-2">
          <Col md>
            <Row>
              <Radio
                label="Any past surgery?"
                id="radioSurgery"
                options={surgerys}
                handleSelect={handleSurgerys}
              />
            </Row>
            {isSurgery && (
              <Row>
                <TextArea
                  id={"surgery"}
                  value={surgeryValue}
                  placeholder="Please mention in brief"
                  onChange={setSurgeryValue}
                  rows={4}
                  cols={35}
                ></TextArea>
              </Row>
            )}
          </Col>
          <Col md>
            <Row>
              <Radio
                label="Any allergies to medications?"
                id="radioAllergies"
                options={allergies}
                handleSelect={handleAllergies}
              />
            </Row>
            <Row>
              {isAllergie && (
                <TextArea
                  id={"textareaSurgery"}
                  value={allergieValue}
                  placeholder="Please mention in brief"
                  onChange={seAllergieValue}
                  rows={4}
                  cols={35}
                ></TextArea>
              )}
            </Row>
          </Col>
        </Row>
        <Row className="g-2">
          <Col md>
            <Row>
              <Radio
                label="Have you been diagnosed with Covid?"
                id="diagCovid"
                options={covids}
                handleSelect={handleCovids}
              />
            </Row>
            <Row>
              {isCovid && (
                <Col md>
                  <Input
                    type="text"
                    placeholder="Enter additional details"
                    label="Provide additional details of Covid illness"
                    value={covidDetails}
                    onChange={handleCovidDetails}
                  />
                </Col>
              )}
            </Row>
          </Col>
          <Col md>
            <Row>
              <Radio
                label="Have you been vaccinated against Covid?"
                id="vaccinated"
                options={vaccinated}
                handleSelect={handleVaccinated}
              />
            </Row>
            <Row>
              {isVaccinated && (
                <Col md style={{ paddingTop: "32px" }}>
                  <br />{" "}
                  <Form.Control
                    type="date"
                    onKeyDown={(e) => e.preventDefault()}
                    min={moment(new Date()).subtract(50, 'years').format('YYYY-MM-DD')}
                    max={moment(new Date()).format("YYYY-MM-DD")}
                    onChange={(e) => setVaccineDate(e.target.value)}
                  />
                  <Selector
                    defaultValue="Choose dose type"
                    id="dose"
                    options={dosages}
                    handleSelect={setDose}
                  />
                  <Selector
                    defaultValue="Choose vaccine name"
                    id="v-name"
                    options={vaccineNames}
                    handleSelect={setVaccineName}
                  />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
        <Row className="g-2">
          <Col md>
            <TextArea
              label="Other medical conditions"
              id={"other-condition"}
              value={otherMedical}
              placeholder="Add conditions"
              onChange={setOtherMedical}
              rows={1}
              cols={20}
            ></TextArea>
          </Col>
          <Col md>
            <Input
              type="text"
              placeholder="Enter code here"
              label="Referral Code"
              value={referalCode}
              onChange={setReferalCode}
            />
          </Col>
        </Row>
        <Row className="g-2">
          <Col md>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Checkbox
                id="term"
                checked={termsCondition}
                handleSelect={setTermsCondition}
              />
              <span>
                I accept{" "}
                <a
                  style={{ color: "blue", lineHeight: "65px" }}
                  onClick={() => setModalShow(true)}
                >
                  <span style={{ textDecoration: "underline" }}>
                    Terms and Conditions
                  </span>
                </a>
              </span>
            </div>
          </Col>
          <Col md></Col>
        </Row>

        <Row>
          <CustomButton
            text={"Continue"}
            className="primary registration-btn"
            onClick={() => {
              if (validation()) {
                registerUserAPICalling();
              }
            }}
          ></CustomButton>
        </Row>
        <ModalDialog
          modalClassName={"terms-content"}
          isConfirm={true}
          show={modalShow}
          title={"Terms and conditions"}
          closeDialog={() => {
            setModalShow(false);
          }}
        >
          <TermsAndCondition />
        </ModalDialog>
      </div>
    </div>
  );
};
export default withRouter(RegistrationComponent);
