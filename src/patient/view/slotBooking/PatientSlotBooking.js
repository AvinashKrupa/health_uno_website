import  { useEffect, useState } from "react";
import moment from 'moment';
import { Row, Col} from "react-bootstrap";
import SlotGenerator from "../../../doctor/view/slot/SlotGenerator";
import {API, post} from '../../../api/config/APIController';
import { useToasts } from "react-toast-notifications";
import HorizontalCalendar from './HorizontalCalendar';
import CustomButton from '../../../commonComponent/Button';
import {Link} from 'react-router-dom';
import patientSlotBookingStore from "../../store/patientSlotBookingStore";
import { isEmpty } from "../../../utils/Validators";

  const PatientSlotBooking = (props) => {
    const { addToast } = useToasts();
    const setDate = patientSlotBookingStore((state) => state.setDate);
    const setSlotId = patientSlotBookingStore((state) => state.setSlotId);
    const setStartTime = patientSlotBookingStore((state) => state.setStartTime);
    const [slot, setSlot] = useState(patientSlotBookingStore((state) => state.slot_id));
    const [dataMorningShift, setDataMorningShift] = useState([]);
    const [dataEveningShift, setDataEveningShift] = useState([]);
    const [currentDate, setCurrentDate] = useState(`${moment(patientSlotBookingStore((state) => state.date)).format('YYYY-MM-DD')}`,'YYYY-MM-DD');
    const [selectedDay, setSelectedDay] = useState(moment(currentDate).format('DD'));

    useEffect(() => {
      getSlots();
      return () => {};
    }, [currentDate]);

    function handleNextClick() {
      const isValid = validation();
      isValid && props.history.push(`/patient/bookingSummary/${props.match.params.doctor_id}`)
    }

    function validation() {
      if (isEmpty(currentDate)) {
        addToast('Please select the day', { appearance: 'error' });
        return false;
      } else if (isEmpty(slot)) {
        addToast('Please select the slot', { appearance: 'error' });
        return false;
      } else {
        return true;
      }
    }
  

    function setDateValue(date) {
      const selectedDate = `${moment(date).format('YYYY-MM-DD')}`;
      setCurrentDate(selectedDate);
      setSelectedDay(moment(date).format('DD'));
      setDate(selectedDate);
      setSlot('');
    }

  function setSlotData(id, startTime) {
    setSlot(id);
    setSlotId(id);
    setStartTime(startTime);
  }

  const onDateSelect = (dateNumber, date) => {
    const selectedDate = `${moment(date).format('YYYY-MM-DD')}`;
    setCurrentDate(selectedDate)
    setSelectedDay(dateNumber);
    setDate(date);
    setSlot('');

  };

  function getGroupWiseDate (data) {
    return data.reduce((r, a) => {
      r[a.time] = [...r[a.time] || [], a];
      return r;
    }, {});
  }

  function getSlots() {
    let params = {
      doctor_id: props.match.params.doctor_id,
      date: currentDate,
    };

    post(API.GETAVAILABLESLOT, params)
      .then(response => {
        if (response.status === 200) {
          if (response.data.data.shift1) {
            let data = response.data.data.shift1.map(info => {
              const time = info.start.split(":")
              info.timeInNumber = time[0]
              info.time = time[0] ;
              return info;
            });
            const group = getGroupWiseDate(data);
            setDataMorningShift(group);
          }  
          if(response.data.data.shift2) {
            let data = response.data.data.shift2.map(info => {
              const time = info.start.split(":")
              info.timeInNumber = time[0]
              info.time = time[0] ;
              return info;
            });
            const group = getGroupWiseDate(data);
            setDataEveningShift(group);
          }
        } else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast(error.response.data.message, { appearance: 'error' });
      });
  }


  const dayShiftSlot = () => {
    return Object.entries(dataMorningShift).map((timeSlot) => {
        return(
          <SlotGenerator selectedSlots={[slot]} handleSlotClick={setSlotData} label={`${timeSlot[0]} AM`} slots={timeSlot[1]} />
        )
    })
  };

  const EveningShiftSlot = () => {
    return Object.entries(dataEveningShift).map((timeSlot) => {
        return(
          <SlotGenerator selectedSlots={[slot]} handleSlotClick={setSlotData} label={`${timeSlot[0]} PM`} slots={timeSlot[1]} />
        )
    })
  }

  return (
    <>
      <Row>
        <Col lg='1' sm='1' xs='1'></Col>
          <Col lg='10' xs='11'>
              <Row style={{marginTop: '37px', marginBottom: '43px'}} className='back-navigation' >
                  <Link to={`/patient/doctorDetails/${props.match.params.doctor_id}`}><i class="fas fa-arrow-left"></i><span>Book Slot</span></Link>
              </Row>
               <HorizontalCalendar
                date={currentDate}
                numberOfDays={15}
                selectedDay={selectedDay}
                setDateValue={setDateValue}
                setSelectedDay={onDateSelect}
                slot_id={slot}
              />
              {  Object.entries(dataMorningShift).length > 0 && 
                <Row className='slot-day' style={{marginTop: '30px', marginBottom: '32px'}}>
                  <Col lg='3'>
                      <span className="H4">Day Shift</span>
                  </Col>
                </Row>  
              }
              {  Object.entries(dataMorningShift).length > 0 && dayShiftSlot()}
              <div className='slot-evening'>
              {Object.entries(dataEveningShift).length  > 0 &&
                <Row  style={{marginTop: '30px', marginBottom: '32px'}}>
                  <Col lg='3'>
                      <span className="H4">Evening Shift</span>
                  </Col>
                </Row >
              }
              { Object.entries(dataEveningShift).length > 0 && EveningShiftSlot()}
              </div>
              { ( Object.entries(dataMorningShift ).length > 0 || Object.entries(dataEveningShift).length > 0) && 
                <div style={{textAlign: 'center'}}>
                    <CustomButton
                      className={'patient-slot-booking-btn'}
                      onClick={handleNextClick}
                      text={'Next'}
                    ></CustomButton>
                </div>
              }
          </Col>
          <Col lg='1'></Col>
      </Row>
    </>
  );
};
export default PatientSlotBooking;