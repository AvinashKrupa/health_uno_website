import {useState} from "react";
import moment from 'moment';
import {Col, Row} from "react-bootstrap";
import {useToasts} from "react-toast-notifications";
import HorizontalCalendar from './../../../patient/view/slotBooking/HorizontalCalendar';
import updateScheduleStore from "../../store/updateScheduleStore";

const UpdateSchedule = (props) => {
  const {addToast} = useToasts();
  const setDate = updateScheduleStore((state) => state.setDate);
  const [slot, setSlot] = useState(updateScheduleStore((state) => state.slot_id));
  const [currentDate, setCurrentDate] = useState(`${moment(updateScheduleStore((state) => state.date)).format('YYYY-MM-DD')}`, 'YYYY-MM-DD');
  const [selectedDay, setSelectedDay] = useState(moment(currentDate).format('DD'));

  function setDateValue(date) {
    const selectedDate = `${moment(date).format('YYYY-MM-DD')}`;
    setCurrentDate(selectedDate);
    setSelectedDay(moment(date).format('DD'));
    setDate(selectedDate);
    setSlot('');
  }


  const onDateSelect = (dateNumber, date) => {
    const selectedDate = `${moment(date).format('YYYY-MM-DD')}`;
    setCurrentDate(selectedDate)
    setSelectedDay(dateNumber);
    setDate(date);
    setSlot('');

  };

  return (
      <>
        <Row>
          <Col lg='10' xs='11'>
            <Row className='back-navigation'>
              <span>Update Schedule</span>
            </Row>
            <div style={{width: "70%"}}>
              <HorizontalCalendar
                  date={currentDate}
                  numberOfDays={15}
                  selectedDay={selectedDay}
                  setDateValue={setDateValue}
                  setSelectedDay={onDateSelect}
                  slot_id={slot}
              />
            </div>
          </Col>
        </Row>
      </>
  );
};
export default UpdateSchedule;
