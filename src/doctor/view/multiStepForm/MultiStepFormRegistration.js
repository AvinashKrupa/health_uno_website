import React, { useContext, useState } from "react";
import { Row, Col } from "react-bootstrap";
import CustomButton from '../../../commonComponent/Button'
import DocRegistrationPage1 from "./DocRegistrationPage1";
import DocRegistrationPage2 from './DocRegistrationPage2';
import DocRegistrationPage3 from './DocRegistrationPage3';
import { AuthContext } from "../../../context/AuthContextProvider";
import { isEmailValid, isEmpty, isNumberOnly } from '../../../utils/Validators';
import { useToasts } from "react-toast-notifications";
import CustomStepper from "./CustomStepper";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import {API, post} from '../../../api/config/APIController';
import {storeData} from "../../../storage/LocalStorage/LocalAsyncStorage";
import useUserStore from "../../store/userStore";

const MultiStepFormRegistration = ({history}) => {
  const authContext = useContext(AuthContext);

  //First form information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState(authContext.phone);
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [description, setDescription] = useState('');

  //second form information
  const [department, setDepartment] = useState('');
  const [councilRegistrationNo, setCouncilRegistrationNo] = useState('');
  const [dateOfRegistration, setDateOfRegistration] = useState(authContext.phone);
  const [dateOfRenewal, setDateOfRenewal] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [fee, setFee] = useState('');

  // Third form information
  const [selectedDays, setSelectedDays] = useState([]);
  const [daySlots, setDaySlots] = useState([]);
  const [eveningSlots, setEveningSlots] = useState([]);
  const [isDayShift, setIsDayShift] = useState(false);
  const [isEveningShift, setIsEveningShift] = useState(false);
  const [dayShiftFrom, setDayShiftFrom] = useState('');
  const [dayShiftTo, setDayShiftTo] = useState('');
  const [eveningShiftFrom, setEveningShiftFrom] = useState('');
  const [eveningShiftTo, setEveningShiftTo] = useState('');
  const [dataMorningShift, setDataMorningShift] = useState([]);
  const [dataEveningShift, setDataEveningShift] = useState([]);


  const { addToast } = useToasts();
  const setUserInfo =  useUserStore((state) => state.setUserInfo)
  const [activeStep, setActiveStep] = useState(1);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [prevDisabled, setPrevDisabled] = useState(true);

  function registerLogin(params) {
    post(API.REGISTERDOCTOR, params, true)
      .then(response => {
        if (response.status === 200) {
          const user = response.data.data['user'];

          if(user) {
            storeData('userInfo', JSON.stringify(user));
            setUserInfo(user)
            debugger
          }
          history.push('/doctor/homePage');
          addToast(response.data.message, { appearance: 'success' });
        } else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast('Please try again', { appearance: 'error' });
      });
  }

  function registerUserAPICalling() {
    let daysObj = { };
    let slots =  [];

    if(isDayShift) {

      slots = [...slots, ...daySlots];
    }

    if(isEveningShift) {

      slots = [...slots, ...eveningSlots]
    }
    selectedDays.map((day) => {
      const dayName = day.slice(0,3).toLowerCase();
      daysObj[`${dayName}`] = true
    })

    let params = {
      mobile_number: mobile,
      country_code: "+91",
      device_type: "Window",
      first_name: firstName,
      last_name: lastName,
      type: "2",
      dob: birthDate,
      gender: gender,
      desc: description,
      avail: {
        day: daysObj,
        slots: slots,
        shift: {
            shift1: {
                start: dayShiftFrom,
                end: dayShiftTo
            },
            shift2: {
                start: eveningShiftFrom,
                end: eveningShiftTo
            }
        }
    },
      qualif: {
          dept_id: department,
          specl: [
            specialization
          ],
          med_reg_num: councilRegistrationNo,
          reg_date: dateOfRegistration,
          renewal_date: dateOfRenewal,
          fee: fee,
          exp:10,
          quals: [
          ],
          highest_qual: qualification
      },
      refer_code: "",
      address: {
          line1: addressLine1,
          line2: addressLine2,
          state: state,
          city: city,
          country: "India",
      },
    };
    registerLogin(params)
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
      addToast('Please select the days', { appearance: 'error' });
      return false;
    } else if (selectedDays.length && !isDayShift && !isEveningShift ) {
      addToast('Please select the day or evening shifts', { appearance: 'error' });
      return false;
    } else if (isDayShift && isEmpty(dayShiftFrom)) {
      addToast('Please select the day shift From', { appearance: 'error' });
      return false;
    } else if (isDayShift && isEmpty(dayShiftTo)) {
      addToast('Please select the day shift To', { appearance: 'error' });
      return false;
    } else if (isEveningShift && isEmpty(eveningShiftFrom)) {
      addToast('Please select the evening shift From', { appearance: 'error' });
      return false;
    } else if (isEveningShift && isEmpty(eveningShiftTo)) {
      addToast('Please select the evening shift To', { appearance: 'error' });
      return false;
    }  else if (isDayShift && dayShiftFromHours === dayShiftToHours && dayShiftFromMin > dayShiftToMin) {
      addToast('Please select the day shift To minutes grater then day shift From minutes', { appearance: 'error' });
      return false;
    } else if (isDayShift && dayShiftFromHours > dayShiftToHours) {
      addToast('Please select the day shift To grater then day shift From', { appearance: 'error' });
      return false;
    } else if (isDayShift && dayShiftFromHours === dayShiftToHours && dayShiftFromMin === dayShiftToMin) {
      addToast('Please select the day shift To  grater then day shift From', { appearance: 'error' });
      return false;
    } else if (isDayShift && !daySlots.length) {
      addToast('Please select the day slots', { appearance: 'error' });
      return false;
    } else if (isEveningShift && eveningShiftFromHours === eveningShiftToHours && eveningShiftFromMin > eveningShiftToMin) {
      addToast('Please select the evening shift To minutes grater then evening shift From minutes', { appearance: 'error' });
      return false;
      } else if (isEveningShift && eveningShiftFromHours > eveningShiftToHours) {
        addToast('Please select the evening shift To grater then evening shift From', { appearance: 'error' });
        return false;
      }  else if (isEveningShift && isDayShift && dayShiftFromHours >= eveningShiftFromHours) {
        addToast('Please select the evening shift grater then day shift', { appearance: 'error' });
        return false;
      }  else if (isEveningShift && !eveningSlots.length) {
        addToast('Please select the evening slots', { appearance: 'error' });
        return false;
      } else {
      return true;
    }
  }

  function pageTwoValidation() {
    if (isEmpty(department)  || department === 'Select department') {
      addToast('Please enter department', { appearance: 'error' });
      return false;
    } else if (isEmpty(councilRegistrationNo)) {
      addToast('Medical Council Registration Number', { appearance: 'error' });
      return false;
    } else if (isEmpty(dateOfRegistration)) {
      addToast('Please enter date of registration', { appearance: 'error' });
      return false;
    } else if (isEmpty(dateOfRenewal)) {
      addToast('Please enter Date of Renewal', { appearance: 'error' });
      return false;
    }  else if (isEmpty(specialization)  || specialization === 'Select specialization') {
      addToast('Please enter specialization', { appearance: 'error' });
      return false;
    } else if (isEmpty(qualification) || qualification === 'Select qualification') {
      addToast('Please enter highest qualification', { appearance: 'error' });
      return false;
    } else if (isEmpty(fee)) {
      addToast('Please enter consulting fee', { appearance: 'error' });
      return false;
    } else {
      return true;
    }
  }

  function pageOneValidation() {
    if (isEmpty(firstName)) {
      addToast('Please enter first name', { appearance: 'error' });
      return false;
    } else if (isEmpty(lastName)) {
      addToast('Please enter last name', { appearance: 'error' });
      return false;
    } else if (isEmpty(authContext.phone)) {
      addToast('Please enter mobile number', { appearance: 'error' });
      return false;
    } else if (isNumberOnly(authContext.phone)) {
      addToast('Please enter mobile number', { appearance: 'error' });
      return false;
    } else if (isEmpty(email)) {
      addToast('Please enter email id', { appearance: 'error' });
      return false;
    } else if (!isEmailValid(email)) {
      addToast('Please enter valid email id', { appearance: 'error' });
      return false;
    } else if (isEmpty(birthDate)) {
      addToast('Please select your date of birth', { appearance: 'error' });
      return false;
    } else if (isEmpty(gender) || gender === 'Select Gender') {
      addToast('Please select gender', { appearance: 'error' });
      return false;
    } else if (isEmpty(description)) {
      addToast('Please add profile description', { appearance: 'error' });
      return false;
    } else if (isEmpty(addressLine1)) {
      addToast('Please enter address line 1', { appearance: 'error' });
      return false;
    } else if (isEmpty(state) || state === 'Select state') {
      addToast('Please select state', { appearance: 'error' });
      return false;
    } else if (isEmpty(city) || city === 'Select city') {
      addToast('Please select city', { appearance: 'error' });
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
    if(activeStep === 1) {

      isFormValid = pageOneValidation();

    }

    if(activeStep === 2) {
      isFormValid = pageTwoValidation();
    }

    if(activeStep === 3) {
      isFormValid = pageThreeValidation();
      isFormValid && registerUserAPICalling();
    }
      if (isFormValid) {
        let tempActiveStep = activeStep;
        tempActiveStep = tempActiveStep + 1;
        setActiveStep(tempActiveStep);
        disableNext(tempActiveStep);
        disablePrev(tempActiveStep);
      }

  };

  const handlePrev = () => {
    if(activeStep === 1) {
      history.push('/doctor-otp');
    }
    let tempActiveStep = activeStep;
    tempActiveStep = tempActiveStep - 1;
    setActiveStep(tempActiveStep);
    disableNext(tempActiveStep);
    disablePrev(tempActiveStep);
  };

  return (
    <div className='form-wizard'>
      <Row>
        {" "}
        <span className="multistepform-h3">
          {" "}
          <Row className='heading'>
            <div onClick={handlePrev} style={{cursor: 'pointer'}}><i class="fas fa-arrow-left"></i><span>Complete Profile</span></div>
          </Row>
        </span>{" "}
      </Row>
           <CustomStepper activeStep={activeStep} ></CustomStepper>
      <Row>
        <Col>
          { activeStep === 1 &&
            <DocRegistrationPage1
              firstName={firstName}
              lastName={lastName}
              mobile={mobile}
              email={email}
              city={city}
              state={state}
              addressLine1={addressLine1}
              addressLine2={addressLine2}
              description={description}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setMobile={setMobile}
              setBirthDate={setBirthDate}
              setEmail={setEmail}
              setGender={setGender}
              setCity={setCity}
              setState={setState}
              setAddressLine1={setAddressLine1}
              setAddressLine2={setAddressLine2}
              setDescription={setDescription}
              disabled={nextDisabled}
              onClick={handleNext} />
          }

          { activeStep === 2 &&
              <DocRegistrationPage2
                councilRegistrationNo={councilRegistrationNo}
                dateOfRegistration={dateOfRegistration}
                dateOfRenewal={dateOfRenewal}
                fee={fee}
                setDepartment={setDepartment}
                setCouncilRegistrationNo={setCouncilRegistrationNo}
                setDateOfRegistration={setDateOfRegistration}
                setDateOfRenewal={setDateOfRenewal}
                setSpecialization={setSpecialization}
                setQualification={setQualification}
                setFee={setFee}
                disabled={nextDisabled}
                onClick={handleNext} />
          }

          { activeStep === 3 &&
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
          }
          <Row>
              <Col className='form-btn'>
               <CustomButton
                      className='multistepform-button'
                      disabled={false}
                      onClick={handleNext}
                      text={'Continue'}
                ></CustomButton>
              </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(MultiStepFormRegistration);
