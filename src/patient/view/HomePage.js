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
import {group, logo, frame, doctor, plant} from './../constants/Images';
import {H3, H1} from '../commonComponent/TextSize';
import {API, post} from '../api/config/APIController';
import {AuthContext} from '../context/AuthContextProvider';
import CustomButton from '../commonComponent/Button';
import {useToasts} from 'react-toast-notifications';

const Homepage = ({history}) => {
  const { addToast } = useToasts();
  const authContext = useContext(AuthContext);
  const [mobileNumber, setMobileNumber] = useState('');

  const onClick = () => {
    let params = {
      mobile_number: mobileNumber,
      country_code: '+91',
    };

    authContext.setPhone(mobileNumber);
  
    post(API.SENDOTP, params, true)
      .then(response => {
        if (response.status === 200) {
          addToast(response.data.message, { appearance: 'success' });
          history.push('/otp');
        }  else {
          addToast(response.data.message, { appearance: 'error' }); 
        }
      })
      .catch(error => {
        addToast('Please try again!', { appearance: 'error' }); 
      });
  }


  return (
    <>
      <Container fluid>
        <Row className='login-container'>
          <Col className='left-nav'>
            <Row>
              <Col lg='10' md='10' sm='12' className="text-container">

                <div className='description'>
                  <Image src={doctor}
                  ></Image>
                  <div>
                    <H3 text='Book any Doctor you want'></H3>
                    <p>
                      Search doctors based on Speciality, Location, Language
                    </p>
                  </div>
                </div>

                <div className='description'>
                  <Image src={frame}
                  ></Image>
                  <div>
                    <H3 text='Book Virtual Appointment '></H3>
                    <p>
                      Book an online appointment with the consultant of your choice and consult them privately at your own place of choice.
                    </p>
                  </div>
                </div>

                <div className='description'>
                  <Image src={plant}
                  ></Image>
                  <div>
                    <H3 text='Book virtual Appointments with AYUSH doctors'></H3>
                    <p>
                      Book  virtual Appointments with AYUSH doctors and get medicines delivered to your doorstep.
                    </p>
                  </div>

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
                  <InputGroup size="sm" style={{ maxWidth: "350px" }} onChange={(e) => setMobileNumber(e.target.value)}>
                    <DropdownButton variant="outline-secondary" title="+91">
                      <Dropdown.Item>+91</Dropdown.Item>
                    </DropdownButton>
                    <FormControl type="number" />
                    <p className="description-small">
                      A 4 digit OTP will be sent through SMS to verify your mobile
                      number
                    </p>
                  </InputGroup>
                  <CustomButton
                      disabled={mobileNumber.length !== 10} 
                      onClick={onClick}
                      text={'Continue'}
                  ></CustomButton>
                </div>
                
            </div>
          </Col>
        </Row>
      </Container>
   </>
  );
};

export default Homepage;