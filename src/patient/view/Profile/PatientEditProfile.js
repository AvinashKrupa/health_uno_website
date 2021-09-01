import Input from "../../../commonComponent/Input";
import TextArea from "../../../commonComponent/TextArea";
import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {API, get, post} from '../../../api/config/APIController';
import {useToasts} from "react-toast-notifications";
import CustomButton from "../../../commonComponent/Button";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
import { isEmpty } from "../../../utils/Validators";
 
const PatientEditProfile = (props) => {
    // Get state and language from server
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [country, setCountry] = useState('');
    const [appointmentStats, setAppointmentStats] = useState({});
    const [stateName, setStateName] = useState('');

    useEffect(() => {
        getUserProfile();
        return () => {
        };
    }, []);


    const [dataState, setDataState] = useState([]);
    const [dataCity, setDataCity] = useState([]);
    const {addToast} = useToasts();

    function getUserProfile() {
        get(API.GET_PROFILE)
            .then(response => {
                if (response.data.status === 200) {
                    let user = response.data.data.user;
                    let additionalInfo = response.data.data.additional_info;
                    setFirstName(user.first_name);
                    setLastName(user.last_name);
                    setEmail(user.email);
                    setGender(user.gender);
                    setMobile(user.mobile_number);
                    setBirthDate(user.dob);
                    setAddressLine1(additionalInfo.address.line1);
                    setAddressLine2(additionalInfo.address.line1);
                    setState(additionalInfo.address.state);
                    setCity(additionalInfo.address.city);
                    setCountry(additionalInfo.address.country);
                    setAppointmentStats(additionalInfo.appointment_stats);
                    getState(additionalInfo.address.state);
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                console.log('error: ', error);
                // addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    // Edit Profile
    function updateUserProfile() {
        let params = {
            first_name: firstName,
            last_name: lastName,
            address: {
                line1: addressLine1,
                line2: addressLine2,
                state: state,
                city: city,
                country: 'India'
            }
        };

        post(API.UPDATE_PROFILE, params, true)
            .then(response => {
                if (response.status === 200) {
                    addToast(response.data.message, {appearance: 'success'});
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    const setIdAndState = (value) => {
        const stateInfo = value.split('|');
        getCity(stateInfo[0]);
        setState(stateInfo[1]);
        console.log('(stateInfo[1]: ', stateInfo[1]);
        stateInfo[1] === 'Select state' && setCity('Select city')
    }

    const setCityValue = (value, id) => {
        const cityInfo = value.split('|');
        setCity(cityInfo[1])
    }

    // Get city from server
    function getCity(id, cityId) {
        post(API.GETCITY, {countryId: 101, stateId: parseInt(id)})
            .then(response => {
                if (response.status === 200) {
                    let data = response.data.data.map((info) => {
                        return {value: info.name, id: info.id};
                    });
                    setDataCity(data);
                    setCity('Select city')
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }


    // Get state from server
    function getState(stateId) {
        post(API.GETSTATE, {countryId: 101})
            .then(response => {
                if (response.status === 200) {
                    let data = response.data.data.map((info) => {
                        if(info.name.toString() === stateId) {
                            setStateName(info.name)
                        }
                        return {value: info.name, id: info.id};
                    });
                    setDataState(data);
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    function validation() {
        if (isEmpty(firstName)) {
          addToast('Please enter first name', { appearance: 'error' });
          return false;
        } else if (isEmpty(lastName)) {
          addToast('Please enter last name', { appearance: 'error' });
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
        }  else {
          return true;
        }
      }

    return (
        <div className="edit-patient-container">
            <Row  className="g-2">
                <Row>
                    {/* <h2 className="sub-title"></h2> */}
                </Row>
                <Col className="registration-page-1-column" md>
                    <Input label="First Name" type="text" placeholder="eg John" value={firstName}
                            onChange={setFirstName}/>
                </Col>
                <Col className="registration-page-1-column" md>
                    <Input label="Last Name" type="text" placeholder="eg Doe" value={lastName}
                            onChange={setLastName}/>
                </Col>
            </Row>
            <Row className="g-2">
                <Col md>
                    <Input label="Mobile Number" type="number" readonly="true" value={mobile} onChange={setMobile}/>
                </Col>
                <Col>
                    <Input label="Email" type="email" readonly="true" value={email} onChange={setEmail}/>
                </Col>
            </Row>
            <Row className="g-2">
                <Col md>
                    <Input label="Date of Birth" type="date" readonly="true" onChange={setBirthDate}
                            value={birthDate}/>
                </Col>
                <Col>
                    <Input
                        readonly="true"
                        label="Gender"
                        value={gender}
                        id="gender"
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
                        disabled={true}
                        value={country}
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
                                defaultValue={stateName}
                                value={stateName}
                                label="State"
                                id="state"
                                options={dataState}
                                handleSelect={setIdAndState}
                            />
                        </Col>
                        <Col md>
                            <KeyValueSelector
                                defaultValue={city}
                                 value='0'
                                 label="City"
                                 id="city"
                                 options={dataCity}
                                 handleSelect={setCityValue}
                            />
                        </Col>
                    </Row>
                </Col>

            </Row>
            <Col className='form-btn' style={{margin: 'inherit',
                 textAlign: 'center'}}>
                <CustomButton
                    className='multistepform-button edit-profile-update-button'
                    disabled={false}
                    onClick={() => {
                        if(validation()) {
                            updateUserProfile();
                        }
                    }}
                    text={'Update'}
                ></CustomButton>
            </Col>
                   
        </div>
    );
};
export default PatientEditProfile;
