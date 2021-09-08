import Input from "../../../commonComponent/Input";
import TextArea from "../../../commonComponent/TextArea";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
import Select from "../../../commonComponent/Select";
import { Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import {API, get, post} from '../../../api/config/APIController';
import { useToasts } from "react-toast-notifications";
import ProfilePictureColumn from "./profilePictureColumn";
import moment from "moment";

const DocRegistrationPage1 = (props) => {
    // Get state and language from server
    useEffect(() => {
      getState();
      getLanguage()
      return () => {};
    }, []);

 const { firstName, lastName, mobile, email, city, state,
         addressLine1, addressLine2, description, setFirstName, setLastName, setMobile,
         setBirthDate, setEmail, setGender, setCity, setState, setAddressLine1, setAddressLine2, setDescription, setLanguageValue} = props;
  const [dataState, setDataState] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataLanguage, setDataLanguage] = useState([]);
  const { addToast } = useToasts();
  
  let genderOptions = ["Male", "Female", "Other"];

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

  return (
    <div className="registration-page-1-container">
      <Row>
        <Col lg="4">
          <ProfilePictureColumn />
        </Col>
        <Col lg='6'>
              <Row>
              <Col className="registration-page-1-column">
                <Input label="First Name" type="text" placeholder="eg John" value={firstName} onChange={setFirstName}/>
              </Col>
              <Col className="registration-page-1-column">
                <Input label="Last Name" type="text" placeholder="eg Doe" value={lastName} onChange={setLastName} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Input label="Mobile Number" type="number" readonly="true" value={mobile} onChange={setMobile} />
              </Col>
              <Col>
                <Input label="Email" type="email" placeholder="sample@gmail.com" value={email} onChange={setEmail} />
              </Col>
            </Row>
            <Row>
              <Col>
                <br />
                <Form.Label>Date of birth</Form.Label>
                <br />
                <Form.Control type="date"  onChange={(e) => setBirthDate(e.target.value)} max={moment(new Date()).format('YYYY-MM-DD')}/>
              </Col>
              <Col>
                <Select
                  label="Gender"
                  defaultValue="Select Gender"
                  id="gender"
                  options={genderOptions}
                  handleSelect={setGender}
                />
              </Col>
            </Row>
            <Row className='form-wizard-text-area'>
              <Col>
                <TextArea
                  label="Profile description"
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
                  placeholder="Enter address (optional)"
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
                      value={city}
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
        </Col>
        <Col lg='2'> </Col>
      </Row>
      
    </div>
  );
};
export default DocRegistrationPage1;
