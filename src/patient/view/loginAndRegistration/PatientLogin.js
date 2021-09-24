import React, { useContext, useState } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  FormControl,
  InputGroup,
  Image,
} from "react-bootstrap";
import {group, logo, frame, doctor, plant} from '../../../constants/PatientImages';
import {H3, H1} from '../../../commonComponent/TextSize';
import {API, post} from '../../../api/config/APIController';
import {AuthContext} from '../../../context/AuthContextProvider';
import CustomButton from '../../../commonComponent/Button';
import {useToasts} from 'react-toast-notifications';
import { storeData } from "../../../storage/LocalStorage/LocalAsyncStorage";

const PatientLogin = ({history}) => {
  let timer = null;
  const { addToast } = useToasts();
  const authContext = useContext(AuthContext);
  const [mobileNumber, setMobileNumber] = useState(authContext.phone ? authContext.phone : '');

  const onClick = () => {
    const numbers = Array.from(mobileNumber);
    const isNumber = (currentValue) => !isNaN(currentValue);

    if(!numbers.every(isNumber) || numbers.length < 10 || numbers.length > 10) {
      addToast('Please enter the valid number', { appearance: 'error' });
      return;
    }

    let params = {
      mobile_number: mobileNumber,
      country_code: '+91',
      type: 1
    };

    authContext.setPhone(mobileNumber);

    post(API.SENDOTP, params, true)
      .then(response => {
        if (response.status === 200) {
          storeData('USER_TYPE', 1)
          addToast(response.data.message, { appearance: 'success' });
          history.push('/patient/otp');
        }  else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast('Please try again!', { appearance: 'error' });
      });
  }

  function debounce(txt) {
    clearTimeout(timer);
    timer = setTimeout(function() {
      onClick();
    }, 1000);
  }


  return (
    <>
      <Container fluid>
        <Row className='login-container'>
          <Col className='left-nav'>
            <Row>
              <Col lg='10' md='10' sm='12' className="text-container">

                <div className='description'>
                  <Col lg='1'>
                      <Image src={doctor}></Image>
                  </Col>
                  <Col lg='11' className='login-icon-side-txt'>
                      <div><H3 text='Book any Doctor you want'></H3></div>
                      <p>Search doctors based on Speciality, Location, Language</p>
                  </Col>
                </div>

                <div className='description'>
                  <Col lg='1'>
                      <Image src={frame}></Image>
                  </Col>
                  <Col lg='11' className='login-icon-side-txt'>
                      <div><H3 text='Book Virtual Appointment'></H3></div>
                      <p>Book an online appointment with the consultant of your choice and consult them privately at your own place of choice</p>
                  </Col>
                </div>

                <div className='description'>
                  <Col lg='1'>
                      <Image src={plant}></Image>
                  </Col>
                  <Col lg='11' className='login-icon-side-txt'>
                      <div><H3 text='Book Virtual Appointments with AYUSH Doctors'></H3></div>
                      <p> Book  virtual Appointments with AYUSH doctors and get medicines delivered to your doorstep</p>
                  </Col>
                </div>

              </Col>
              <Col lg='1' md='8' sm='0'></Col>
            </Row>
            <Row className='doctor-image' >
              <Col  lg='1'></Col>
              <Col  lg='8'> <Image src={group}></Image></Col>
              <Col  lg='2'></Col>
            </Row>
          </Col>
          <Col className='form'>
            <div>
                <div className='logo'>
                    <Image src={logo}></Image>
                </div>

                <div className='right-nav'>
                  <H1 text={'Hello there !'}></H1>
                  <H3 text={'Welcome'}></H3>
                  <p> Sign in to continue with your mobile number </p>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    debounce();
                  }}>
                    <InputGroup size="sm" style={{ maxWidth: "350px" }} onChange={(e) => setMobileNumber(e.target.value)}>
                      <DropdownButton variant="outline-secondary" title="+91">
                        <Dropdown.Item>+91</Dropdown.Item>
                      </DropdownButton>
                      <FormControl type="text" value={mobileNumber} maxLength="10"/>
                      <p className="description-small">
                        A 4 digit OTP will be sent through SMS to verify your mobile
                        number
                      </p>
                    </InputGroup>
                    <CustomButton
                        className={'login-btn'}
                        disabled={mobileNumber.length !== 10}
                        onClick={debounce}
                        text={'Continue'}
                    ></CustomButton>
                  </form>
                </div>

            </div>
          </Col>
        </Row>
      </Container>
   </>
  );
};

export default PatientLogin;
