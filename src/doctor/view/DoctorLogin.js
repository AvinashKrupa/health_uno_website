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
import {group, logo, frame, doctor, plant} from '../../constants/PatientImages';
import {H3, H1} from './../../commonComponent/TextSize';
import {API, post} from '../../api/config/APIController';
import {AuthContext} from '../../context/AuthContextProvider';
import CustomButton from './../../commonComponent/Button';
import {useToasts} from 'react-toast-notifications';
import { storeData } from "../../storage/LocalStorage/LocalAsyncStorage";

const DoctorLogin = ({history}) => {
  const { addToast } = useToasts();
  const authContext = useContext(AuthContext);
  const [mobileNumber, setMobileNumber] = useState('');

  const onClick = () => {
    let params = {
      mobile_number: mobileNumber,
      country_code: '+91',
      type: 2,
    };

    authContext.setPhone(mobileNumber);
  
    post(API.SENDOTP, params, true)
      .then(response => {
        if (response.status === 200) {
          storeData('USER_TYPE', 2)
          addToast(response.data.message, { appearance: 'success' });
          history.push('/doctor/otp');
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
                    <Col lg='1'>
                        <Image src={doctor}></Image>
                    </Col>
                    <Col lg='11' className='login-icon-side-txt'>
                        <div><H3 text='Manage your clinic'></H3></div>
                        <p>Track and manage all your appointments and modify them with our user-friendly UI</p>
                    </Col>
                </div>
                
                <div className='description'>
                    <Col lg='1'>
                        <Image src={frame}></Image>
                    </Col>
                    <Col lg='11' className='login-icon-side-txt'>
                        <div><H3 text='Medical Records Management'></H3></div>
                        <p> Use our proprietary software to store and manage all patient records digitally secured and stored in a secure cloud database with access control</p>
                    </Col>
                </div>

                <div className='description'>
                    <Col lg='1'>
                        <Image src={plant}></Image>
                    </Col>
                    <Col lg='11' className='login-icon-side-txt'>
                        <div><H3 text='Mentoring/Peer Review consultation'></H3></div>
                        <p> Ask another panel physician to join your current/upcoming consultation and provide additional advice as required</p>
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

export default DoctorLogin;