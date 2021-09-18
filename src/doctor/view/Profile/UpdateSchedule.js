import  { useEffect, useState } from "react";
import moment from 'moment';
import {Col, Row} from "react-bootstrap";
import {useToasts} from "react-toast-notifications";
import UpdateScheduleHorizontalCalendar from "./component/UpdateScheduleHorizontalCalendar";
import updateScheduleStore from "../../store/updateScheduleStore";
import {API, post} from "../../../api/config/APIController";
import UpdateSlotGenerator from "./component/UpdateSlotGenerator";
import {getData} from "../../../storage/LocalStorage/LocalAsyncStorage";
import {convert24hto12h} from "../../../utils/utilities";

const UpdateSchedule = (props) => {
  const {addToast} = useToasts();
  const setDate = updateScheduleStore((state) => state.setDate);
  const setSlotId = updateScheduleStore((state) => state.setSlotId);
  const setStartTime = updateScheduleStore((state) => state.setStartTime);
  const [slot, setSlot] = useState(updateScheduleStore((state) => state.slot_id));
  const [dataMorningShift, setDataMorningShift] = useState([]);
  const [dataEveningShift, setDataEveningShift] = useState([]);
  const [currentDate, setCurrentDate] = useState(`${moment(updateScheduleStore((state) => state.date)).format('YYYY-MM-DD')}`, 'YYYY-MM-DD');
  const [selectedDay, setSelectedDay] = useState(moment(currentDate).format('DD'));

  useEffect(() => {
    getSlots();
    return () => {};
  }, [currentDate]);

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

  function updateSchedule(timeSlot) {
    let params = null
    if (timeSlot.status === 'unavailable') {
      params = {
        unavailable_slots: [],
        available_slots: [timeSlot.slot_id],
        date: moment(currentDate).format('YYYY-MM-DD'),
      };
    } else if (timeSlot.status === 'available') {
      params = {
        unavailable_slots: [timeSlot.slot_id],
        available_slots: [],
        date: moment(currentDate).format('YYYY-MM-DD'),
      };
    } else {
      addToast('This slot already have an appointment', { appearance: 'error' });
    }

    post(API.UPDATE_SCHEDULE_BY_DATE, params)
        .then(response => {
          if (response.status === 200) {
            if (response.data) {
              getSlots();
              addToast(response.data.message, { appearance: 'success' });
            } else {
              addToast(response.data.message, { appearance: 'success' });
              getSlots();
            }
          } else {
            addToast('error occurred', { appearance: 'error' });
          }
        })
        .catch(error => {
          addToast(error.response.data.message, { appearance: 'error' });
        });
  }

  function getSlots() {
    let params = {
      doctor_id: JSON.parse(getData('additional_info'))._id,
      date: currentDate,
    };

    post(API.GET_AVAILABLE_SLOT, params)
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
    return Object.entries(dataMorningShift).sort().map((timeSlot) => {
      return(
          <UpdateSlotGenerator selectedSlots={[slot]} handleSlotClick={updateSchedule} label={`${convert24hto12h(timeSlot[0])}`} slots={timeSlot[1]} />
      )
    })
  };

  const EveningShiftSlot = () => {
    return Object.entries(dataEveningShift).map((timeSlot) => {
      return(
          <UpdateSlotGenerator selectedSlots={[slot]} handleSlotClick={updateSchedule} label={`${convert24hto12h(timeSlot[0])}`} slots={timeSlot[1]} />
      )
    })
  }

  return (
      <>
        <Row>
          <Col lg='12' md='12' sm='6'  xs='6'>
            <Row className='back-navigation'>
              <span>Update Schedule</span>
            </Row>
            <Row>
              <UpdateScheduleHorizontalCalendar
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
              { ( !Object.entries(dataMorningShift ).length  && !Object.entries(dataEveningShift).length ) &&
                  <div className="empty-list-container_center">
                    <h4>No slots found, please choose another date</h4>
                  </div>
              }
            </Row>
          </Col>
        </Row>
      </>
  );
};
export default UpdateSchedule;
