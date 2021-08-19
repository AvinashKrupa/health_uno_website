import moment from "moment";
import { Row, Col, Button, Image } from "react-bootstrap";
import Timer from "../../../commonComponent/Timer";
import ModalDialog from '../../../commonComponent/ModalDialog'
import CustomButton from '../../../commonComponent/Button'
import { useState } from "react";
import { Card, CardContent, CardMedia } from "@material-ui/core";
import datetimeDifference from "datetime-difference";
import TextArea from '../../../commonComponent/TextArea';
import { useToasts } from 'react-toast-notifications';
// import doctor_image from "./Doctor Image.svg";
// import video_camera from "./Video Camera.svg";

const DoctorAppointmentsCard = (props) => {
const [toggleModal, setToggleModal] = useState(false);
const [reason, setReason] = useState('');
const { addToast } = useToasts();

function getTimer(timeString, returnMinutes = false) {
const dateOneObj = new Date('2021-08-19, 11:40:00');
const dateTwoObj = new Date();
const milliseconds = dateTwoObj - dateOneObj;
const hours = parseFloat(milliseconds / 36e5).toFixed(3);
const result = datetimeDifference(dateOneObj, dateTwoObj); 
// console.log('result: ', result);


    if(returnMinutes) {
      // console.log('Math.abs(Math.floor(milliseconds/1000/60/1000)): ', Math.abs(Math.floor(milliseconds/100/60)));
        return  result;
        
    }  else if(Math.sign(hours) < 0) {
        return hours >= -1
    }  else if(Math.sign(hours) < 0) {
        return false;
    }
}    

function convert24hto12h(timeString, ampmRequired = true) {
    const H = +timeString.substr(0, 2);
    const h = (H % 12) || 12;
    const ampm = H < 12 ? "AM" : "PM";
    return( h + timeString.substr(2, 3) + (ampmRequired ? ampm : ''));
}

function onSubmit() {
  if(reason === '') {
    addToast('Please enter cancel reason', { appearance: 'error' });
  } else {
    setToggleModal(false)
  }
  
}

const timerEnable = getTimer(`${props?.appointment.time.date} ${props?.appointment.time.slot}`);  
const btn = props.appointment.status === 'scheduled' ? 'Cancel': 'Prescription';

  return (
    <>
        <Card className="upcoming-appointment-card-container">
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>
              <CardMedia className="upcoming-appointment-card-image" image={props?.appointment.dp}></CardMedia>
          </div>
          <div>
            <CardContent>
                <div className="doctor-card-doctor-name">{`Dr ${props?.appointment.first_name}, ${props?.appointment.last_name}`}</div>
                <div className="doctor-card-doctor-details"> {`${props?.appointment.address.city}, ${props?.appointment.address.country} | ${props?.appointment.exp} Y Exp`}</div>
                <div>
                  <span className="doctor-card-fee-label">Fee:</span>
                  <span className="doctor-card-fee-value">Rs {props?.appointment.fee}</span>{" "}
                </div>
                <span >
                <span
                    className="doctor-card-specialization-text"
                    style={{  marginTop: "10px" }}
                  >
                    {
                      props?.appointment.specialities.map((s) => {
                          return(<span key={s} style={{ padding: '4px', marginRight: '10px'}} className='doctor-card-specialization-container'>{s}</span>)
                      })
                    }

                  </span>
                </span>
                <div>
                    <spam className="card-text-date-and-time">
                        {`${props?.appointment.time.date}, ${convert24hto12h(props?.appointment.time.slot)}`}
                    </spam>
                    <span className="card-text-time">{timerEnable && <Timer time={getTimer(`${props?.appointment.time.date} ${props?.appointment.time.slot}`, true)}></Timer> }</span>
                </div>
                <Row className="card-buttons-row">
                  <Col>
                    <CustomButton
                      className="card-button-join"
                      // disabled={otp.length !== 4} 
                      // onClick={verifyOTP}
                      text={'Join meeting'}
                      ></CustomButton>
                  </Col>
                  <Col>
                  { props.appointment.status === 'scheduled' ? 
                     <span onClick={setToggleModal} className={`card-text-${btn}`}>{btn}</span>:
                     <button className={`card-text-${btn}`} > {btn}</button>  }
                  </Col>
              </Row>
            </CardContent>
          </div>
        </div>
      </Card>
      <ModalDialog btnText={'Confirm'} onSubmit={onSubmit} show={toggleModal} title={'Reason for Cancellation'} closeDialog={() => setToggleModal(!toggleModal)}>
            <TextArea
                 id={'reason'}
                 value={reason}
                 placeholder="Please mention in brief"
                 onChange={setReason}
                 rows={4}
                 cols={35}
                 ></TextArea>
      </ModalDialog>
    </>
  );
};
export default DoctorAppointmentsCard;