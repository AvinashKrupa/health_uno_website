import React, { useContext, useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import CustomButton from "../../../commonComponent/Button";
import DocRegistrationPage1 from "./DocRegistrationPage1";
import DocRegistrationPage2 from "./DocRegistrationPage2";
import DocRegistrationPage3 from "./DocRegistrationPage3";
import { AuthContext } from "../../../context/AuthContextProvider";
import { isEmailValid, isEmpty, isNumberOnly } from "../../../utils/Validators";
import { useToasts } from "react-toast-notifications";
import CustomStepper from "./CustomStepper";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { API, post } from "../../../api/config/APIController";
import { getData, storeData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import useUserStore from "../../store/userStore";
import { getPushToken } from "../../../notification/utilities";
import Constants from "../../../constants";
import axios from "axios";


const MultiStepFormRegistration = ({ history }) => {
  const authContext = useContext(AuthContext);
  const [showLoader, setShowLoader] = useState(false);
  //First form information
  const currentDate = new Date();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState(authContext.phone);
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  // const [language, setLanguage] = useState([]);
  const [language, setLanguage] = useState([]);
  const [relationType, setRelationType] = useState("");
  const [relativeName, setRelativeName] = useState("");

  const setLanguageValue = (e) => {
    const value = e.target.value;
    setLanguage(value);
  };

  useEffect(() => {
    if (history.action === "POP") {
      history.replace(`/doctor`);
      return;
    }
    if (!mobile) {
      history.push(`/doctor`);
      return;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //second form information
  const [department, setDepartment] = useState("");
  const [councilRegistrationNo, setCouncilRegistrationNo] = useState("");
  const [dateOfRegistration, setDateOfRegistration] = useState(
    authContext.phone
  );
  const [dateOfRenewal, setDateOfRenewal] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [fee, setFee] = useState("");

  // Third form information
  const [selectedDays, setSelectedDays] = useState([]);
  const [daySlots, setDaySlots] = useState([]);
  const [eveningSlots, setEveningSlots] = useState([]);
  const [isDayShift, setIsDayShift] = useState(false);
  const [isEveningShift, setIsEveningShift] = useState(false);
  const [dayShiftFrom, setDayShiftFrom] = useState("");
  const [dayShiftTo, setDayShiftTo] = useState("");
  const [eveningShiftFrom, setEveningShiftFrom] = useState("");
  const [eveningShiftTo, setEveningShiftTo] = useState("");
  const [dataMorningShift, setDataMorningShift] = useState([]);
  const [dataEveningShift, setDataEveningShift] = useState([]);

  const { addToast } = useToasts();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const [activeStep, setActiveStep] = useState(1);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [, setPrevDisabled] = useState(true);
  const [image, setImage] = useState("");
  const [medicalCertificate, setMedicalCertificate] = useState("");
  const [signature, setSignature] = useState("");
  const [signPad, setSignPad] = useState({});  
  const [signatureDataURL,setSignatureDataURL] = useState('');


  function registerLogin(formData) {
    setShowLoader(true);
    const token = getData("ACCESS_TOKEN");
    const temp = getData("TEMP_TOKEN");
    
    return new Promise(async (resolve, reject) => {
      axios({
        method: "post",
        url: Constants.BASE_URL + API.REGISTER_DOCTOR2,
        data: formData,
        headers: { Authorization: "Bearer " + temp  ? temp :  token},
      })
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
            history.push("/doctor/home");
            setShowLoader(false);
            addToast(response.data.message, { appearance: "success" });
          } else {
            setShowLoader(false);
            addToast(response.data.message, { appearance: "error" });
          }
        })
        .catch((error) => {
          setShowLoader(false);
          addToast(error.response.data.message, { appearance: "error" });
        });
    });
   
  }

  async function registerUserAPICalling() {
    let daysObj = {};
    let slots = [];

    if (isDayShift) {
      slots = [...slots, ...daySlots];
    }

    if (isEveningShift) {
      slots = [...slots, ...eveningSlots];
    }
    selectedDays.map((day) => {
      const dayName = day.slice(0, 3).toLowerCase();
      daysObj[`${dayName}`] = true;
      return null;
    });
    const foundPushToken = await getPushToken();
    let params = {
      mobile_number: mobile,
      country_code: "+91",
      device_type: "web",
      device_token: foundPushToken,
      first_name: firstName,
      last_name: lastName,
      type: "2",
      dob: birthDate,
      gender: gender,
      desc: description,
      language: language,
      email: email,
      dp: image,
      avail: {
        day: daysObj,
        slots: slots,
        shift: {
          shift1: {
            start: dayShiftFrom,
            end: dayShiftTo,
          },
          shift2: {
            start: eveningShiftFrom,
            end: eveningShiftTo,
          },
        },
      },
      qualif: {
        dept_id: department,
        specl: [specialization],
        med_reg_num: councilRegistrationNo,
        reg_date: dateOfRegistration,
        renewal_date: dateOfRenewal,
        fee: fee,
        exp: experience,
        quals: [],
        highest_qual: qualification,
      },
      refer_code: "",
      address: {
        line1: addressLine1,
        line2: addressLine2,
        state: state,
        city: city,
        country: "India",
      },
      relative_name: relativeName,
      relation: relationType,
    };
    const formData = new FormData();
    formData.append('medical_cert_file',medicalCertificate);
    formData.append('digital_signature_file',signature);
    formData.append('user_data',JSON.stringify(params));
    registerLogin(formData);
  }

  function pageThreeValidation() {
    const dayShiftFromInfo = dayShiftFrom.split(":");
    const dayShiftToInfo = dayShiftTo.split(":");
    const dayShiftFromHours = parseInt(dayShiftFromInfo[0]);
    const dayShiftToHours = parseInt(dayShiftToInfo[0]);
    const dayShiftFromMin = parseInt(dayShiftFromInfo[1]);
    const dayShiftToMin = parseInt(dayShiftToInfo[1]);

    const eveningShiftFromInfo = eveningShiftFrom.split(":");
    const eveningShiftToInfo = eveningShiftTo.split(":");
    const eveningShiftFromHours = parseInt(eveningShiftFromInfo[0]);
    const eveningShiftToHours = parseInt(eveningShiftToInfo[0]);
    const eveningShiftFromMin = parseInt(eveningShiftFromInfo[1]);
    const eveningShiftToMin = parseInt(eveningShiftToInfo[1]);

    if (!selectedDays.length) {
      addToast("Please select the days", { appearance: "error" });
      return false;
    } else if (selectedDays.length && !isDayShift && !isEveningShift) {
      addToast("Please select the day or evening shifts", {
        appearance: "error",
      });
      return false;
    } else if (isDayShift && isEmpty(dayShiftFrom)) {
      addToast("Please select the day shift From", { appearance: "error" });
      return false;
    } else if (isDayShift && isEmpty(dayShiftTo)) {
      addToast("Please select the day shift To", { appearance: "error" });
      return false;
    } else if (isEveningShift && isEmpty(eveningShiftFrom)) {
      addToast("Please select the evening shift From", { appearance: "error" });
      return false;
    } else if (isEveningShift && isEmpty(eveningShiftTo)) {
      addToast("Please select the evening shift To", { appearance: "error" });
      return false;
    } else if (
      isDayShift &&
      dayShiftFromHours === dayShiftToHours &&
      dayShiftFromMin > dayShiftToMin
    ) {
      addToast(
        "Please select the day shift To minutes grater then day shift From minutes",
        { appearance: "error" }
      );
      return false;
    } else if (isDayShift && dayShiftFromHours > dayShiftToHours) {
      addToast("Please select the day shift To grater then day shift From", {
        appearance: "error",
      });
      return false;
    } else if (
      isDayShift &&
      dayShiftFromHours === dayShiftToHours &&
      dayShiftFromMin === dayShiftToMin
    ) {
      addToast("Please select the day shift To  grater then day shift From", {
        appearance: "error",
      });
      return false;
    } else if (isDayShift && !daySlots.length) {
      addToast("Please select the day slots", { appearance: "error" });
      return false;
    } else if (
      isEveningShift &&
      eveningShiftFromHours === eveningShiftToHours &&
      eveningShiftFromMin > eveningShiftToMin
    ) {
      addToast(
        "Please select the evening shift To minutes grater then evening shift From minutes",
        { appearance: "error" }
      );
      return false;
    } else if (isEveningShift && eveningShiftFromHours > eveningShiftToHours) {
      addToast(
        "Please select the evening shift To grater then evening shift From",
        { appearance: "error" }
      );
      return false;
    } else if (
      isEveningShift &&
      isDayShift &&
      dayShiftFromHours >= eveningShiftFromHours
    ) {
      addToast("Please select the evening shift grater then day shift", {
        appearance: "error",
      });
      return false;
    } else if (isEveningShift && !eveningSlots.length) {
      addToast("Please select the evening slots", { appearance: "error" });
      return false;
    } else {
      return true;
    }
  }

  function pageTwoValidation() {
    if (isEmpty(department) || department === "Select department") {
      addToast("Please enter department", { appearance: "error" });
      return false;
    } else if (isEmpty(councilRegistrationNo)) {
      addToast("Please enter Medical Council Registration Number", { appearance: "error" });
      return false;
    } else if (isEmpty(dateOfRegistration)) {
      addToast("Please enter date of registration", { appearance: "error" });
      return false;
    } else if (currentDate < new Date(dateOfRegistration)) {
      addToast("Please select registration date before the current date", {
        appearance: "error",
      });
      return false;
    } else if (isEmpty(dateOfRenewal)) {
      addToast("Please enter Date of Renewal", { appearance: "error" });
      return false;
    }else if (new Date(dateOfRegistration) >= new Date(dateOfRenewal)) {
      addToast("Please select Date of Registration before Date of Renewal", { appearance: "error" });
      return false;
    } else if (
      isEmpty(specialization) ||
      specialization === "Select specialization"
    ) {
      addToast("Please enter specialization", { appearance: "error" });
      return false;
    } else if (
      isEmpty(qualification) ||
      qualification === "Select qualification"
    ) {
      addToast("Please enter highest qualification", { appearance: "error" });
      return false;
    } else if (isEmpty(fee)) {
      addToast("Please enter consulting fee", { appearance: "error" });
      return false;
    } else if (isEmpty(medicalCertificate)) {
      addToast("Please upload medical certificate file", { appearance: "error" });
      return false;
    }else if (isEmpty(signature)) {
      addToast("Please create or upload digital signature", { appearance: "error" });
      return false;
    } else {
      return true;
    }
  }

  function pageOneValidation() {
    if (isEmpty(firstName)) {
      addToast("Please enter first name", { appearance: "error" });
      return false;
    }
    // else if (isEmpty(lastName)) {
    //   addToast("Please enter last name", { appearance: "error" });
    //   return false;
    // }
    else if (isEmpty(authContext.phone)) {
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
      addToast("Please select birth date before the current date", {
        appearance: "error",
      });
      return false;
    } else if (isEmpty(gender) || gender === "Select Gender") {
      addToast("Please select gender", { appearance: "error" });
      return false;
    } else if (isEmpty(description)) {
      addToast("Please add profile description", { appearance: "error" });
      return false;
    }
    // else if (isEmpty(addressLine1)) {
    //   addToast("Please enter address line 1", { appearance: "error" });
    //   return false;
    // }
    else if (isEmpty(state) || state === "Select state") {
      addToast("Please select state", { appearance: "error" });
      return false;
    } else if (isEmpty(city) || city === "Select city") {
      addToast("Please select city", { appearance: "error" });
      return false;
    } else if (isEmpty(language) || language === "Select language") {
      addToast("Please select language", { appearance: "error" });
      return false;
    } else if (isEmpty(experience)) {
      addToast("Please enter your experience", { appearance: "error" });
      return false;
    } else {
      return true;
    }
  }

  const disableNext = (step) => {
    if (step === 3) {
      setNextDisabled(true);
    } else {
      setNextDisabled(false);
    }
  };

  const disablePrev = (step) => {
    if (step === 1) {
      setPrevDisabled(true);
    } else {
      setPrevDisabled(false);
    }
  };

  const handleNext = () => {
    let isFormValid = false;
    if (activeStep === 1) {
      isFormValid = pageOneValidation();
    }

    if (activeStep === 2) {
      isFormValid = pageTwoValidation();
    }

    if (activeStep === 3) {
      setActiveStep(3);
      isFormValid = pageThreeValidation();
      isFormValid && registerUserAPICalling();
    }
    if (isFormValid && activeStep !== 3) {
      let tempActiveStep = activeStep;
      tempActiveStep = tempActiveStep + 1;
      setActiveStep(tempActiveStep);
      disableNext(tempActiveStep);
      disablePrev(tempActiveStep);
    }
  };

  const handlePrev = () => {
    if (activeStep === 1) {
      history.push("/doctor/otp");
    }
    let tempActiveStep = activeStep;
    tempActiveStep = tempActiveStep - 1;
    setActiveStep(tempActiveStep);
    disableNext(tempActiveStep);
    disablePrev(tempActiveStep);
  };

  return (
    <div className="form-wizard">
      <Row>
        {" "}
        <span style={{ marginBottom: "0px" }} className="multistepform-h3">
          {" "}
          <Row className="heading">
            <div onClick={handlePrev} style={{ cursor: "pointer" }}>
              <i className="fas fa-arrow-left"></i>
              <span>Complete Profile</span>
            </div>
          </Row>
        </span>{" "}
      </Row>
      <CustomStepper activeStep={activeStep}></CustomStepper>
      <Row>
        <Col>
          {activeStep === 1 && (
            <DocRegistrationPage1
              firstName={firstName}
              lastName={lastName}
              mobile={mobile}
              email={email}
              birthDate={birthDate}
              gender={gender}
              city={city}
              state={state}
              language={language}
              addressLine1={addressLine1}
              addressLine2={addressLine2}
              description={description}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setRelationType={setRelationType}
              setRelativeName={setRelativeName}
              relationType={relationType}
              relativeName={relativeName}
              setMobile={setMobile}
              setBirthDate={setBirthDate}
              setEmail={setEmail}
              setGender={setGender}
              setCity={setCity}
              setState={setState}
              setAddressLine1={setAddressLine1}
              setAddressLine2={setAddressLine2}
              experience={experience}
              setExperience={setExperience}
              setDescription={setDescription}
              disabled={nextDisabled}
              onClick={handleNext}
              setLanguageValue={setLanguageValue}
              setImage={setImage}
            />
          )}

          {activeStep === 2 && (
            <DocRegistrationPage2
              councilRegistrationNo={councilRegistrationNo}
              dateOfRegistration={dateOfRegistration}
              dateOfRenewal={dateOfRenewal}
              fee={fee}
              department={department}
              specialization={specialization}
              qualification={qualification}
              medicalCertificate={medicalCertificate}
              signature={signature}
              signPad= {signPad}
              signatureDataURL = {signatureDataURL}
              setDepartment={setDepartment}
              setCouncilRegistrationNo={setCouncilRegistrationNo}
              setDateOfRegistration={setDateOfRegistration}
              setDateOfRenewal={setDateOfRenewal}
              setSpecialization={setSpecialization}
              setQualification={setQualification}
              setFee={setFee}
              setMedicalCertificate={setMedicalCertificate}
              setSignature={setSignature}
              setSignPad={setSignPad}
              setSignatureDataURL={setSignatureDataURL}
              disabled={nextDisabled}
              onClick={handleNext}
            />
          )}

          {activeStep === 3 && (
            <DocRegistrationPage3
              selectedDays={selectedDays}
              daySlots={daySlots}
              eveningSlots={eveningSlots}
              isDayShift={isDayShift}
              isEveningShift={isEveningShift}
              dayShiftFrom={dayShiftFrom}
              dayShiftTo={dayShiftTo}
              eveningShiftFrom={eveningShiftFrom}
              eveningShiftTo={eveningShiftTo}
              dataMorningShift={dataMorningShift}
              dataEveningShift={dataEveningShift}
              setSelectedDays={setSelectedDays}
              setEveningSlots={setEveningSlots}
              setDaySlots={setDaySlots}
              setIsDayShift={setIsDayShift}
              setIsEveningShift={setIsEveningShift}
              setDayShiftFrom={setDayShiftFrom}
              setDayShiftTo={setDayShiftTo}
              setEveningShiftFrom={setEveningShiftFrom}
              setEveningShiftTo={setEveningShiftTo}
              setDataMorningShift={setDataMorningShift}
              setDataEveningShift={setDataEveningShift}
            ></DocRegistrationPage3>
          )}
          <Row>
            <Col className="form-btn">
              {showLoader && (
                <CustomButton
                  className="multistepform-button"
                  type="submit"
                  disabled
                  onClick={handleNext}
                  importantStyle={{ backgroundColor: "#e2e9e9" }}
                  showLoader={showLoader}
                ></CustomButton>
              )}
              {!showLoader && (
                <CustomButton
                  className="multistepform-button"
                  type="submit"
                  onClick={handleNext}
                  text={activeStep === "3" ? "Submit" : "Continue"}
                ></CustomButton>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(MultiStepFormRegistration);
