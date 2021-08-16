import React, { useContext, useEffect, useState } from "react";
import Input from "../../../commonComponent/Input";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
import Selector from "../../../commonComponent/Select";
import TextArea from "../../../commonComponent/TextArea";
import { Form, Row, Col } from "react-bootstrap";
import Radio from "../../../commonComponent/Radio";
import Checkbox from "../../../commonComponent/Checkbox";
import {AuthContext} from '../../../context/AuthContextProvider';
import { isEmailValid, isEmpty, isNumberOnly } from '../../../utils/Validators';
import { useToasts } from 'react-toast-notifications';
import {API, get, post} from '../../../api/config/APIController';
import CustomButton from '../../../commonComponent/Button';
import { withRouter } from "react-router-dom";

const RegistrationComponent = ({history}) => {

  // Get state and language from server
  useEffect(() => {
    getState();
    getLanguage()
    return () => {};
  }, []);

  const { addToast } = useToasts();
  const authContext = useContext(AuthContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState(authContext.phone);
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [isDiabetic, setIsDiabetic] = useState('');
  const [diabetics, setDiabetics] = useState([{id: 'yes', value: 'Yes', checked: false},
  {id: 'no', value: 'No', checked: false}]);
  const [diabeticValue, setDiabeticValue] = useState('');
  const [hypertensiveValue, setHypertensiveValue] = useState('');
  const [hypertensives, setHypertensives] = useState([{id: 'yes', value: 'Yes', checked: false},
  {id: 'no', value: 'No', checked: false}]);
  const [isHypertensive, setIsHypertensive] = useState('');
  const [surgerys, setSurgerys] = useState([{id: 'yes', value: 'Yes', checked: false},
  {id: 'no', value: 'No', checked: false}]);
  const [isSurgery, setIsSurgery] = useState('');
  const [surgeryValue, setSurgeryValue] = useState('');
  const [allergieValue, seAllergieValue] = useState('')
  const [allergies, setAllergies] = useState([{id: 'yes', value: 'Yes', checked: false},
  {id: 'no', value: 'No', checked: false}]);
  const [isAllergie, setIsAllergie] = useState('');
  const [covids, setCovids] = useState([{id: 'yes', value: 'Yes', checked: false},
  {id: 'no', value: 'No', checked: false}]);
  const [isCovid, setIsCovid] = useState('');
  const [otherMedical, setOtherMedical] = useState('');
  const [referalCode, setReferalCode] = useState('');
  const [termsCondition, setTermsCondition] = useState(false);
  const [covidDate, handleCovidDate] = useState('');
  const [dataState, setDataState] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataLanguage, setDataLanguage] = useState([]);
  const [language, setLanguage] = useState('');

  const setLanguageValue = (value) => {
    const lanInfo = value.split('|');
    setLanguage(lanInfo[1])
  }

  // Need state id to get city API call
  // so KeyValueGenerator option has value like {`${item.id}|${item.value}`}
  const setIdAndState = (value) => {
    const stateInfo = value.split('|');
    getCity(stateInfo[0])
    setState(stateInfo[1]);
    stateInfo[1] === 'Select state' && setCity('Select city')
  }

  const setCityValue = (value, id) => {
    const cityInfo = value.split('|');
    setCity(cityInfo[1])
  }
    
  const handleDiabetic = (id) => {
    setIsDiabetic(id === 'yes');

    const newDiabetic =  diabetics.map((item) => {
         return Object.assign({}, item, {checked: item.id === id});
    })

    setDiabetics(newDiabetic);
  }

  const handleHypertensive = (id) => {
     setIsHypertensive(id === 'yes')

    const newHypertensives =  hypertensives.map((item) => {
         return Object.assign({}, item, {checked: item.id === id});
    })

    setHypertensives(newHypertensives);
  }

  const handleSurgerys = (id) => {
     setIsSurgery(id === 'yes') 

    const newSurgerys =  hypertensives.map((item) => {
         return Object.assign({}, item, {checked: item.id === id});
    })

    setSurgerys(newSurgerys);
  }

  const handleAllergies = (id) => {
    setIsAllergie(id === 'yes') 

   const newAllergies =  allergies.map((item) => {
        return Object.assign({}, item, {checked: item.id === id});
   })

   setAllergies(newAllergies);
 }

 const handleCovids = (id) => {
  setIsCovid(id === 'yes') 

 const newCovids =  covids.map((item) => {
      return Object.assign({}, item, {checked: item.id === id});
 })

 setCovids(newCovids);
}

// Get language from server
function getLanguage() {
  get(API.GETLANGUAGE)
    .then(response => {
      if (response.status === 200) {
        let data = response.data.data.map(info => {
          return {value: info.name, id: info._id};
        });
        setDataLanguage(data);
      } else {
        addToast(response.data.message, { appearance: 'error' });
      }
    })
    .catch(error => {
      addToast(error.data.message, { appearance: 'error' });
    });
}

// Get state from server
function getState() {
  post(API.GETSTATE, {countryId: 101})
    .then(response => {
      if (response.status === 200) {
        let data = response.data.data.map((info) => {
          return {value: info.name, id: info.id};
        });
        setDataState(data);
      } else {
        addToast(response.data.message, { appearance: 'error' });
      }
    })
    .catch(error => {
      addToast(error.response.data.message, { appearance: 'error' });
    });
}

// Get city from server
function getCity(id) {
  post(API.GETCITY, {countryId: 101, stateId: parseInt(id)})
    .then(response => {
      if (response.status === 200) {
        let data = response.data.data.map((info) => {
          return {value: info.name, id: info.id};
        });
        setDataCity(data);
      } else {
        addToast(response.data.message, { appearance: 'error' });
      }
    })
    .catch(error => {
      addToast(error.response.data.message, { appearance: 'error' });
    });
}


function validation() {
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
  }  else if (isEmpty(email)) {
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
  } else if (isEmpty(addressLine1)) {
    addToast('Please enter address line 1', { appearance: 'error' });
    return false;
  } else if (isEmpty(state) || state === 'Select state') {
    addToast('Please select state', { appearance: 'error' });
    return false;
  } else if (isEmpty(city) || city === 'Select city') {
    addToast('Please select city', { appearance: 'error' });
    return false;
  } else if (isEmpty(language) ||language === 'Select language') {
    addToast('Please select language', { appearance: 'error' });
    return false;
  } else if (isEmpty(isDiabetic)) {
    addToast('Please select diabetic', { appearance: 'error' });
    return false;
  } else if (isDiabetic === true && isEmpty(diabeticValue)) {
    addToast('Please select diabetic from', { appearance: 'error' });
    return false;
  } else if (isEmpty(isHypertensive)) {
    addToast('Please select hypertensive', { appearance: 'error' });
    return false;
  } else if (isHypertensive === true && isEmpty(hypertensiveValue)) {
    addToast('Please select hypertensive from', { appearance: 'error' });
    return false;
  } else if (isEmpty(isSurgery)) {
    addToast('Please select surgeries', { appearance: 'error' });
    return false;
  } else if (isSurgery === true && isEmpty(surgeryValue)) {
    addToast('Please mention about your surgeries', { appearance: 'error' });
    return false;
  } else if (isEmpty(isAllergie)) {
    addToast('Please select allergies', { appearance: 'error' });
    return false;
  } else if (isAllergie === true && isEmpty(allergieValue)) {
    addToast('Please mention allergies', { appearance: 'error' });
    return false;
  } else if (isEmpty(isCovid)) {
    addToast('Please select covid', { appearance: 'error' });
    return false;
  } else if (isCovid === true && isEmpty(covidDate)) {
    addToast('Please select covid from', { appearance: 'error' });
    return false;
  }  else if (termsCondition === false) {
    addToast('Please accept terms and condition', { appearance: 'error' });
    return false;
  } else {
    return true;
  }
}

function registerUserAPICalling() {
  let params = {
    first_name: firstName,
    last_name: lastName,
    mobile_number: authContext.phone,
    country_code: '+91',
    device_type: 'Window',
    type: '1',
    dob: birthDate,
    gender: gender,
    height: 300,
    weight: 300,
    email: email,
    // language: language,
    med_cond: [
      {
        name: 'diabetic',
        selected: isDiabetic,
        diag_at: isDiabetic ? diabeticValue : '',
        desc: '',
      },
      {
        name: 'hypertensive',
        selected: isHypertensive,
        diag_at: isHypertensive ? hypertensiveValue : '',
        desc: '',
      },
      {
        name: 'diagnosed_with_covid',
        selected: isCovid,
        diag_at: isCovid ? covidDate : '',
        desc: '',
      },
      {
        name: 'past_surgeries',
        selected: isSurgery,
        diag_at: '',
        desc: isSurgery ? surgeryValue : '',
      },
      {
        name: 'allergy_to_meds?',
        selected: isAllergie,
        diag_at: '',
        desc: isAllergie ? allergieValue : '',
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
    .then(response => {
      if (response.status === 200) {
        addToast(response.data.message, { appearance: 'success' });
        history.push('/patient/home')
      } else {
        addToast(response.data.message, { appearance: 'error' });
      }
    })
    .catch(error => {
      addToast(error.response.data.message, { appearance: 'error' });
    });
}

  let genderOptions = ["Male", "Female", "Other"];

  return (
    <div className="container">
      <div>
        <Row className="g-2">
          <Col md>
            <Input
              type="text"
              placeholder="eg John"
              id="firstName"
              label="First Name"
              value={firstName}
              onChange={setFirstName}
            />
          </Col>
          <Col md>
            <Input
              type="text"
              placeholder="eg Doe"
              id="lastName"
              label="Last Name"
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
              placeholder="sample@gmail.com"
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
            <Form.Control type="date"  onChange={(e) => setBirthDate(e.target.value)}/>
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
                  value={state}
                  label="State"
                  defaultValue="Select state"
                  id="state"
                  options={dataState}
                  handleSelect={setIdAndState}
                />
              </Col>
              <Col md>
                <KeyValueSelector
                  value='0'
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
                value='Language'
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
              {isDiabetic &&
                <Col>
                  <br />
                  <br /> <Form.Control type="date"  onChange={(e) => setDiabeticValue(e.target.value)}/>
               </Col>
              }
             
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
             {isHypertensive &&
                <Col>
                  <br />
                  <br /> <Form.Control type="date"  onChange={(e) => setHypertensiveValue(e.target.value)}/>
               </Col>
              }
            </Row>
          </Col>
          <Col md>
            <Row>
              <Radio
                label="Any past surgery?"
                id="radioSurgery"
                options={surgerys}
                handleSelect={handleSurgerys}
              />
            </Row>
            { isSurgery && 
              <Row>
                <TextArea
                 id={'surgery'}
                 value={surgeryValue}
                 placeholder="Please mention in brief"
                 onChange={setSurgeryValue}
                 rows={4}
                 cols={35}
                 ></TextArea>
              </Row>
            }
          </Col>
        </Row>
        <Row className="g-2">
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
              {isAllergie && 
               <TextArea
                id={'textareaSurgery'}
                value={allergieValue}
                placeholder="Please mention in brief"
                onChange={seAllergieValue}
                rows={4}
                cols={35}
               ></TextArea>
              }
            </Row>
          </Col>
          <Col md>
            <Row>
              <Radio
                label="Have you diagnosed with COVID?"
                id="radioHypertensive"
                options={covids}
                handleSelect={handleCovids}
              />
            </Row>
            <Row>
             { isCovid && 
                <Col>
                  <br />
                  <br /> <Form.Control type="date"  onChange={(e) => handleCovidDate(e.target.value)}/>
                </Col>
              }
            </Row>
          </Col>
        </Row>
        <Row className="g-2">
          <Col md>
            <Input
              type="textarea"
              label="Other medical conditions"
              placeholder="English"
              value={otherMedical}
              onChange={setOtherMedical}
            />
          </Col>
          <Col md>
            <Input
              type="text"
              placeholder="Enter code here"
              label="Refer Code"
              value={referalCode}
              onChange={setReferalCode}
            />
          </Col>
        </Row>
        <Row classNme="g-2">
          <Col md>
            <Checkbox id="term" checked={termsCondition} label="I accept Terms and Conditions" handleSelect={setTermsCondition} />
          </Col>
          <Col md></Col>
        </Row>
       
        <Row>
          <CustomButton text={'Continue'} className="primary registration-btn" onClick={() => {
              if (validation()) {
                registerUserAPICalling();
              }
            }
          }></CustomButton>
          
       </Row>
      </div>
    </div>
  );
};
export default withRouter(RegistrationComponent);