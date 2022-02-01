/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useContext, useEffect, useRef, useState} from "react";
import {Col, Container, Image, Row,} from "react-bootstrap";
import {doctor, frame, group, phone, plant} from '../../../constants/PatientImages'
import {H3} from '../../../commonComponent/TextSize'
import OtpInput from "react-otp-input";
import {API, post} from '../../../api/config/APIController';
import {AuthContext} from '../../../context/AuthContextProvider';
import {storeData} from "../../../storage/LocalStorage/LocalAsyncStorage";
import CustomButton from '../../../commonComponent/Button';
import {useToasts} from 'react-toast-notifications';
import {Link} from 'react-router-dom';
import useUserStore from '../../store/userStore';
import {getPushToken} from "../../../notification/utilities";

const timeOut = 59;
const OTP = ({history}) => {
  const {addToast} = useToasts();
  const authContext = useContext(AuthContext);
  const [otp, setOTP] = useState('');
  const [mobileNumber, setMobileNumber] = useState(authContext.phone);
  const handleChange = otp => setOTP(otp);
  const maskedMobileNo = Array.from(authContext.phone);
  const [restart, setReStart] = useState(false);
  const [timer, setTimer] = useState(timeOut);
  const setUserInfo = useUserStore((state) => state.setUserInfo)
  const [showLoader, setShowLoader] = useState(false);

  const verifyOTP = async (e) => {
    e.preventDefault();
    const foundPushToken = await getPushToken();
    let params = {
      mobile_number: mobileNumber,
      country_code: '+91',
      otp: otp,
      device_type: 'web',
      device_token: foundPushToken,
      type: 1,
    };

    setShowLoader(true);
    post(API.VERIFYOTP, params)
        .then(response => {
          if (response.status === 200) {
            setShowLoader(false);
            addToast(response.data.message, {appearance: 'success'});
            let temp = response.data.data['tempAccessToken'];
            if (response.data.data['tempAccessToken'] != null) {
              storeData('TEMP_TOKEN', temp);
            }

            const user = response.data.data['user'];
            const additional_info = response.data.data['additional_info'];

            if (user) {
              storeData('userInfo', JSON.stringify(user));
              setUserInfo(user)
            }
            if (additional_info) {
              storeData('additional_info', JSON.stringify(additional_info));
            }

            const session = response.data.data['session'];
            if (session != null) {
              storeData('ACCESS_TOKEN', session.access_token);
              storeData('REFRESH_TOKEN', session.refresh_token);
              history.push('/patient/home')
            } else {

              history.push('/patient/registration');
            }
          } else {
            setShowLoader(false);
            addToast(response.data.message, {appearance: 'error'});
          }
        })
        .catch(error => {
          setShowLoader(false);
          addToast(error.response.data.message, {appearance: 'error'});
        });
  }

  const reSendOTP = () => {
    setOTP('')
    let params = {
      mobile_number: authContext.phone,
      country_code: '+91',
      type: 1
    };
    post(API.SENDOTP, params, true)
        .then(response => {
          if (response.status === 200) {
            authContext.setAuth(true);
            setTimer(timeOut);
            setReStart(!restart);
            addToast(response.data.message, {appearance: 'success'});
          } else {
            addToast(response.data.message, {appearance: 'error'});
          }
        })
        .catch(error => {
          addToast(error.response.data.message, {appearance: 'error'});
        });
  }

  useEffect(() => {
    setMobileNumber(authContext.phone);
    return () => {
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mobileNumber) {
      history.push(`/patient`);
      return;
    }
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);// eslint-disable-line react-hooks/exhaustive-deps

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
    }, [delay, restart]); // eslint-disable-line react-hooks/exhaustive-deps
  }

  useInterval(() => {
    setTimer(timer - 1);
  }, 1000);

  return (
      <Container fluid>
        <Row className='login-container LoginPageDoctor'>
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
                      Book an online appointment with the consultant of your choice and consult them privately at your
                      own place of choice.
                    </p>
                  </div>
                </div>

                <div className='description'>
                  <Image src={plant}
                  ></Image>
                  <div>
                    <H3 text='Book Virtual Appointments with AYUSH Doctors'></H3>
                    <p>
                      Book virtual Appointments with AYUSH doctors and get medicines delivered to your doorstep.
                    </p>
                  </div>
                </div>
              </Col>
              <Col lg='1' md='8' sm='0'></Col>
            </Row>
            <Row className='doctor-image'>
              <Col lg='1'></Col>
              <Col lg='8'> <Image src={group}></Image></Col>
              <Col lg='2'></Col>
            </Row>
          </Col>
          <Col className='otp-main-container'>
            <div className="otp-back-navigation">
              <Link to='/patient'><i class="fas fa-chevron-left"></i><span>Back</span></Link>
            </div>
            <Row className="phone-image">
              <Col lg='3' md='3' sm='2' xs='1'></Col>
              <Col lg='8' md='8' sm='9' xs='10'>
                <div>
                  <Image src={phone} alt="Image"></Image>
                </div>
              </Col>
              <Col lg='1' md='1' sm='1' xs='1'></Col>
            </Row>
            <Row className='number-input'>
              <Col lg='3' md='3' sm='2' xs='1'></Col>
              <Col lg='8' md='8' sm='9' xs='10'>
                <div className='otp-text-container'>
                  <Row className='verify-otp'>
                    <span>Verify OTP</span>
                    <div className='edit-number'>
                      <p> We have sent OTP on your mobile
                        number {maskedMobileNo[0]}{maskedMobileNo[1]}******{maskedMobileNo[8]}{maskedMobileNo[9]}</p> {
                      <Link to='/patient/'><i class="fas fa-pen"></i></Link>}
                    </div>
                  </Row>
                  <form onSubmit={verifyOTP}>
                    <div className='otp-container'>
                      <br/>
                      <OtpInput
                          className="OTP"
                          numInputs="4"
                          isInputNum={true}
                          separator={<span> </span>}
                          value={otp}
                          onChange={handleChange}
                      />
                      <br/>
                    </div>
                    <br/>
                    <div className="div-center">
                      {showLoader && <CustomButton
                          type="submit"
                          className={'login-btn'}
                          disabled
                          onClick={verifyOTP}
                          importantStyle={{backgroundColor: "#e2e9e9"}}
                          showLoader={showLoader}
                      ></CustomButton>}
                      {!showLoader && <CustomButton
                          type="submit"
                          className={'login-btn'}
                          disabled={otp.length !== 4}
                          onClick={verifyOTP}
                          text={'Verify OTP'}
                      ></CustomButton>}
                      <br/>
                      <div className="resend-otp">
                        {timer === 0 ? (
                            <a href='#' onClick={reSendOTP}>Resend OTP</a>
                        ) : (
                            <span>{`Didn't get OTP? Resend in ${timer} seconds`}</span>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </Col>
              <Col lg='' md='1' sm='1' xs='1'></Col>
            </Row>
          </Col>
        </Row>
      </Container>
  );
};

export default OTP;
