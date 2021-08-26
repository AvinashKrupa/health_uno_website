import Input from "../../../commonComponent/Input";
import TextArea from "../../../commonComponent/TextArea";
import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {API, get, post} from '../../../api/config/APIController';
import {useToasts} from "react-toast-notifications";
import ProfilePictureColumn from "./profilePictureColumn";
import CustomButton from "../../../commonComponent/Button";

const EditProfile = (props) => {
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
    const [description, setDescription] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        getUserProfile()
        return () => {
        };
    }, []);


    const [dataState, setDataState] = useState([]);
    const [dataCity, setDataCity] = useState([]);
    const {addToast} = useToasts();

    let genderOptions = ["Male", "Female", "Other"];

    function getUserProfile() {
        get(API.GET_PROFILE)
            .then(response => {
                if (response.status == 200) {
                    let user = response.data.data.user;
                    let additionalInfo = response.data.data.additional_info;
                    setFirstName(user.first_name);
                    setLastName(user.last_name);
                    setEmail(user.email);
                    setGender(user.gender);
                    setDescription(additionalInfo.desc);
                    setMobile(user.mobile_number);
                    setBirthDate(user.dob);
                    setAddressLine1(additionalInfo.address.line1);
                    setAddressLine2(additionalInfo.address.line1);
                    setState(additionalInfo.address.state);
                    setCity(additionalInfo.address.city);
                    setCountry(additionalInfo.address.country);
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    // Edit Profile
    function updateUserProfile() {
        let params = {
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobile,
            email: email,
            desc: description,
            type: '2',
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
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
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
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    return (
        <div className='form-wizard' style={{marginLeft:'20px'}}>
            <div className="registration-page-1-container">
                <Row>
                    <Col lg="4">
                        <ProfilePictureColumn/>
                    </Col>
                    <Col lg='6'>
                        <Row>
                            <Row>
                                <h2 className="sub-title" style={{marginLeft:0}}>Edit Profile</h2>
                            </Row>
                            <Col className="registration-page-1-column">
                                <Input label="First Name" type="text" placeholder="eg John" value={firstName}
                                       onChange={setFirstName}/>
                            </Col>
                            <Col className="registration-page-1-column">
                                <Input label="Last Name" type="text" placeholder="eg Doe" value={lastName}
                                       onChange={setLastName}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input label="Mobile Number" type="number" value={mobile} onChange={setMobile}/>
                            </Col>
                            <Col>
                                <Input label="Email" type="email" value={email} onChange={setEmail}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
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
                                    readonly="true"
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
                                    readonly="true"
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
                                        <Input
                                            disabled={true}
                                            value={state}
                                            type="text"
                                            placeholder="India"
                                            id="country"
                                            label="State"
                                            readOnly={true}
                                        />
                                    </Col>
                                    <Col md>
                                        <Input
                                            disabled={true}
                                            value={city}
                                            type="text"
                                            placeholder="India"
                                            id="country"
                                            label="City"
                                            readOnly={true}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg='2'> </Col>
                </Row>
                <Row>
                    <Col className='form-btn'>
                        <CustomButton
                            className='multistepform-button'
                            disabled={false}
                            onClick={updateUserProfile}
                            text={'Submit'}
                        ></CustomButton>
                    </Col>
                </Row>

            </div>
        </div>

    );
};
export default EditProfile;
