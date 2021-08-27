import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import {group, frame, doctor, plant, phone} from '../../../constants/PatientImages'
import {H3} from '../../../commonComponent/TextSize'
import OtpInput from "react-otp-input";
import {API, post} from '../../../api/config/APIController';
import {AuthContext} from '../../../context/AuthContextProvider';
import { storeData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import CustomButton from '../../../commonComponent/Button';
import { useToasts } from 'react-toast-notifications';
import {Link} from 'react-router-dom';
import useUserStore from '../../store/userStore';

const timeOut = 60;
const OTP = ({history}) => {
  const { addToast } = useToasts();
  const authContext = useContext(AuthContext);
  const [otp, setOTP]  = useState('');
  const [mobileNumber, setMobileNumber] = useState(authContext.phone);
  const handleChange = otp => setOTP(otp);
  const [restart, setReStart] = useState(false);
  const [timer, setTimer] = useState(timeOut);
  const setUserInfo =  useUserStore((state) => state.setUserInfo)

  const verifyOTP = () => {
    let params = {
      mobile_number: mobileNumber,
      country_code: '+91',
      otp: otp,
      device_type: 'Window',
      device_toten: '',
      type: 1,
    };

    post(API.VERIFYOTP, params)
      .then(response => {
        if (response.status === 200) {
          addToast(response.data.message, { appearance: 'success' });
          let temp = response.data.data['tempAccessToken'];
          if (response.data.data['tempAccessToken'] != null) {
            storeData('TEMP_TOKEN', temp);
          } 

          const user = response.data.data['user'];

          if(user) {
            storeData('userInfo', JSON.stringify(user));
            setUserInfo(user)
          }

          const session = response.data.data['session'];     
          if (session != null) {
            storeData('ACCESS_TOKEN', session.access_token);
            storeData('REFRESH_TOKEN', session.refresh_token);
            history.push('/patient/home')
          } else {

            history.push('/patient/registration');
          }
        }
        else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast('Please go back and enter your mobile number again', { appearance: 'error' });
      });
  }

  const reSendOTP = () => {
    setOTP('')
    let params = {
      mobile_number: authContext.phone,
      country_code: '+91',
    };
    post(API.SENDOTP, params, true)
      .then(response => {
        if (response.status === 200) {
          authContext.setAuth(true);
          setTimer(timeOut);
          setReStart(!restart);
          addToast(response.data.message, { appearance: 'success' });
        } else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast(error.response.data.message, { appearance: 'error' });
      });
  }
  
  useEffect(() => {
    setMobileNumber(authContext.phone);
    return () => {};
  }, []);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      let timers = timeOut;
      const id = setInterval(() => {
        timers = timers - 1;
        if (timers <= 0) {
          clearInterval(id);
        }
        savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }, [delay, restart]);
  }

  useInterval(() => {
    setTimer(timer - 1);
  }, 1000);

  return (
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
        <Col className='otp-main-container'>
            <div className="otp-back-navigation">
              <Link to='/'><i class="fas fa-chevron-left"></i><span>Back</span></Link>
            </div>
             <Row className="phone-image">
             <Col lg='3' md='3'  sm='2'  xs='1'></Col>
             <Col lg='8' md='8' sm='9' xs='10'>
               <div>
               <Image src={phone} alt="Image"></Image>
               </div>
              </Col>
              <Col lg='1' md='1'  sm='1'  xs='1'></Col>
            </Row>
            <Row className='number-input'>
              <Col lg='3' md='3'  sm='2'  xs='1'></Col>
              <Col lg='8' md='8' sm='9' xs='10'>
                <div className='otp-text-container'>
                  <Row className='verify-otp'>
                      <span>Verify OTP</span>
                        <div className='edit-number'>
                          <p> We have sent OTP on your mobile number {authContext.phone}</p> { <Link to='/'><i class="fas fa-pen"></i></Link>}
                        </div > 
                  </Row>
                  <div className='otp-container'>
                    <br />
                    <OtpInput
                      className="OTP"
                      numInputs="4"
                      separator={<span> </span>}
                      value={otp}
                      onChange={handleChange}
                    />
                    <br />
                  </div>
                  <br />
                  <div className="div-center">
                    <CustomButton
                      disabled={otp.length !== 4} 
                      onClick={verifyOTP}
                      text={'Verify OTP'}
                      ></CustomButton>
                     <br />
                     <div className="resend-otp">
                        { timer === 0 ? (
                          <a href='#' onClick={reSendOTP}>Resend OTP</a>
                        ) : (
                          <span>{`Didn't get OTP? Resend in ${timer} seconds`}</span>
                        )}
                     </div>
                  </div>
                </div>
              </Col>
              <Col lg='' md='1'  sm='1'  xs='1'></Col>
            </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default OTP;  