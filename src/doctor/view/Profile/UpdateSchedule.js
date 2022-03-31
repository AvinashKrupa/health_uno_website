import { useEffect, useState } from "react";
import moment from "moment";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import UpdateScheduleHorizontalCalendar from "./component/UpdateScheduleHorizontalCalendar";
import updateScheduleStore from "../../store/updateScheduleStore";
import { API, post } from "../../../api/config/APIController";
import UpdateSlotGenerator from "./component/UpdateSlotGenerator";
import { getData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import { convert24hto12h } from "../../../utils/utilities";
import Checkbox from "../../../commonComponent/Checkbox";
import _ from "lodash";

const UpdateSchedule = () => {
  const [selectedDays, setSelectedDays] = useState([
    { day: "Sunday", isChecked: false },
    { day: "Monday", isChecked: false },
    { day: "Tuesday", isChecked: false },
    { day: "Wednesday", isChecked: false },
    { day: "Thursday", isChecked: false },
    { day: "Friday", isChecked: false },
    { day: "Saturday", isChecked: false },
  ]);
  const [isDayShift, setIsDayShift] = useState(false);
  const [isEveningShift, setIsEveningShift] = useState(false);
  const [dayShiftFrom, setDayShiftFrom] = useState("");
  const [dayShiftTo, setDayShiftTo] = useState("");
  const [eveningShiftFrom, setEveningShiftFrom] = useState("");
  const [eveningShiftTo, setEveningShiftTo] = useState("");
  const [shouldShowButton, setShouldShowButton] = useState(false);

  const { addToast } = useToasts();
  const setDate = updateScheduleStore((state) => state.setDate);
  const [slot, setSlot] = useState(
    updateScheduleStore((state) => state.slot_id)
  );
  const [dataMorningShift, setDataMorningShift] = useState([]);
  const [dataEveningShift, setDataEveningShift] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    `${moment(updateScheduleStore((state) => state.date)).format(
      "YYYY-MM-DD"
    )}`,
    "YYYY-MM-DD"
  );
  const [selectedDay, setSelectedDay] = useState(
    moment(currentDate).format("DD")
  );

  useEffect(() => {
    getDoctorDetails();
    getSlots();
    return () => {};
  }, [currentDate]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isEveningShift || isDayShift) {
      setShouldShowButton(true);
    } else {
      setShouldShowButton(false);
    }
  }, [isDayShift, isEveningShift]); // eslint-disable-line react-hooks/exhaustive-deps

  function setDateValue(date) {
    const selectedDate = `${moment(date).format("YYYY-MM-DD")}`;
    setCurrentDate(selectedDate);
    setSelectedDay(moment(date).format("DD"));
    setDate(selectedDate);
    setSlot("");
  }

  const onDateSelect = (dateNumber, date) => {
    const selectedDate = `${moment(date).format("YYYY-MM-DD")}`;
    setCurrentDate(selectedDate);
    setSelectedDay(dateNumber);
    setDate(date);
    setSlot("");
  };

  function getGroupWiseDate(data) {
    return data.reduce((r, a) => {
      r[a.time] = [...(r[a.time] || []), a];
      return r;
    }, {});
  }

  const handleDaysClick = (index) => {
    let data = JSON.parse(JSON.stringify(selectedDays));
    data[index].isChecked = !data[index].isChecked || false;
    setSelectedDays(data);
    const isAnyChecked = _.some(data, { isChecked: true });
    if (isAnyChecked) {
      setShouldShowButton(true);
    } else {
      setShouldShowButton(false);
    }
  };

  function updateSchedule(timeSlot) {
    let params = null;
    if (timeSlot.status === "unavailable") {
      params = {
        unavailable_slots: [],
        available_slots: [timeSlot.slot_id],
        date: moment(currentDate).format("YYYY-MM-DD"),
      };
    } else if (timeSlot.status === "available") {
      params = {
        unavailable_slots: [timeSlot.slot_id],
        available_slots: [],
        date: moment(currentDate).format("YYYY-MM-DD"),
      };
    } else {
      addToast("This slot already have an appointment", {
        appearance: "error",
      });
      return;
    }

    post(API.UPDATE_SCHEDULE_BY_DATE, params)
      .then((response) => {
        if (response.status === 200) {
          if (response.data) {
            getSlots();
            addToast(response.data.message, { appearance: "success" });
          } else {
            addToast(response.data.message, { appearance: "success" });
            getSlots();
          }
        } else {
          addToast("error occurred", { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function updateAvailabilityByDays() {
    let params = {
      avail: {
        day: {
          sun: selectedDays[0].isChecked,
          mon: selectedDays[1].isChecked,
          tue: selectedDays[2].isChecked,
          wed: selectedDays[3].isChecked,
          thu: selectedDays[4].isChecked,
          fri: selectedDays[5].isChecked,
          sat: selectedDays[6].isChecked,
        },
        shift: {
          ...(isDayShift
            ? {
                shift1: {
                  start: moment(
                    `${moment().format("DD-MMM-YYYY")} ${dayShiftFrom}`
                  ).format("HH:mm"),
                  end: moment(
                    `${moment().format("DD-MMM-YYYY")} ${dayShiftTo}`
                  ).format("HH:mm"),
                },
              }
            : {
                shift1: {
                  start: "",
                  end: "",
                },
              }),
          ...(isEveningShift
            ? {
                shift2: {
                  start: moment(
                    `${moment().format("DD-MMM-YYYY")} ${eveningShiftFrom}`
                  ).format("HH:mm"),
                  end: moment(
                    `${moment().format("DD-MMM-YYYY")} ${eveningShiftTo}`
                  ).format("HH:mm"),
                },
              }
            : {
                shift2: {
                  start: "",
                  end: "",
                },
              }),
        },
      },
    };
    post(API.UPDATE_SCHEDULE_BY_DAY, params)
      .then((response) => {
        if (response.status === 200) {
          if (response.data) {
            getSlots();
          }
          addToast(response.data.message, { appearance: "success" });
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function getSlots() {
    let params = {
      doctor_id: JSON.parse(getData("additional_info"))._id,
      date: currentDate,
    };

    post(API.GET_AVAILABLE_SLOT, params)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.data.shift1) {
            let data = response.data.data.shift1.map((info) => {
              const time = info.start.split(":");
              info.timeInNumber = time[0];
              info.time = time[0];
              return info;
            });
            const group = getGroupWiseDate(data);
            setDataMorningShift(group);
          }
          if (response.data.data.shift2) {
            let data = response.data.data.shift2.map((info) => {
              const time = info.start.split(":");
              info.timeInNumber = time[0];
              info.time = time[0];
              return info;
            });
            const group = getGroupWiseDate(data);
            setDataEveningShift(group);
          }
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function getDoctorDetails() {
    post(API.GET_DOCTOR_DETAILS, {
      doctor_id: JSON.parse(getData("additional_info"))._id,
      include_similar: true,
    })
      .then((response) => {
        if (response.status === 200) {
          let dataDay = [
            { day: "Sunday", isChecked: false },
            { day: "Monday", isChecked: false },
            { day: "Tuesday", isChecked: false },
            { day: "Wednesday", isChecked: false },
            { day: "Thursday", isChecked: false },
            { day: "Friday", isChecked: false },
            { day: "Saturday", isChecked: false },
          ];
          let days = response.data.data.day;
          let shift = response.data.data.shift;
          Object.keys(days).forEach((info, index) => {
            if (index < 7) {
              dataDay[index].isChecked = days[info];
            }
          });
          if (shift.shift1 && shift.shift1.start !== "") {
            setDayShiftFrom(shift.shift1.start);
            setDayShiftTo(shift.shift1.end);
            setIsDayShift(true);
          }
          if (shift.shift2 && shift.shift2.start !== "") {
            setEveningShiftFrom(shift.shift2.start);
            setEveningShiftTo(shift.shift2.end);
            setIsEveningShift(true);
          }
          setSelectedDays(JSON.parse(JSON.stringify(dataDay)));
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  const dayShiftSlot = () => {
    return Object.entries(dataMorningShift)
      .sort()
      .map((timeSlot, key) => {
        return (
          <UpdateSlotGenerator
            key={key}
            selectedSlots={[slot]}
            handleSlotClick={updateSchedule}
            label={`${convert24hto12h(timeSlot[0])}`}
            slots={timeSlot[1]}
          />
        );
      });
  };

  const EveningShiftSlot = () => {
    return Object.entries(dataEveningShift).map((timeSlot, key) => {
      return (
        <UpdateSlotGenerator
          key={key}
          selectedSlots={[slot]}
          handleSlotClick={updateSchedule}
          label={`${convert24hto12h(timeSlot[0])}`}
          slots={timeSlot[1]}
        />
      );
    });
  };

  const renderUpdateByDate = () => {
    return (
      <>
        <Row>
          <span className="section-sub-title">By Date</span>
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
          {Object.entries(dataMorningShift).length > 0 && (
            <Row
              className="slot-day"
              style={{ marginTop: "30px", marginBottom: "32px" }}
            >
              <Col lg="3">
                <span className="shift-name">Day Shift</span>
              </Col>
            </Row>
          )}
          {Object.entries(dataMorningShift).length > 0 && dayShiftSlot()}
          <div className="slot-evening">
            {Object.entries(dataEveningShift).length > 0 && (
              <Row style={{ marginTop: "30px", marginBottom: "32px" }}>
                <Col lg="3">
                  <span className="shift-name">Evening Shift</span>
                </Col>
              </Row>
            )}
            {Object.entries(dataEveningShift).length > 0 && EveningShiftSlot()}
          </div>
          {!Object.entries(dataMorningShift).length &&
            !Object.entries(dataEveningShift).length && (
              <div className="empty-list-container_center">
                <h4>No slots found, please choose another date</h4>
              </div>
            )}
        </Row>
      </>
    );
  };

  const renderGeneralAvailability = () => {
    return (
      <>
        <Row>
          <span style={{ marginTop: "32px" }} className="section-sub-title">
            General Availability
          </span>
        </Row>
        <Row className={"days-selection-container"}>
          {selectedDays.map((item, index) => {
            let active = item.isChecked;
            return (
              <Button
                key={index}
                className={"days-selection-button"}
                onClick={(e) => handleDaysClick(index)}
                style={{ backgroundColor: active ? "#28A3DA" : "white" }}
              >
                <span
                  className="days-button-text"
                  style={{ color: active ? "white" : "" }}
                >
                  {item.day}
                </span>
              </Button>
            );
          })}
        </Row>
        <Row>
          <Col lg="3">
            <InputGroup>
              <span className="shift-name">Day Shift</span>
              <Checkbox
                id="term"
                checked={isDayShift}
                handleSelect={setIsDayShift}
              />
            </InputGroup>
          </Col>
          <Col></Col>
          {isDayShift && (
            <Col className="time-select">
              <Form.Control
                type="time"
                placeholder="From"
                className="shift-timings-input"
                value={dayShiftFrom}
                onChange={(e) => {
                  setDayShiftFrom(e.target.value);
                }}
              />

              <Form.Control
                type="time"
                placeholder="To"
                className="shift-timings-input"
                value={dayShiftTo}
                onChange={(e) => setDayShiftTo(e.target.value)}
              />
            </Col>
          )}
        </Row>
        <div className="slot-evening">
          <Row>
            <Col lg="3">
              <InputGroup>
                <span className="shift-name">Evening Shift</span>
                <Checkbox
                  id="term"
                  checked={isEveningShift}
                  handleSelect={setIsEveningShift}
                />
              </InputGroup>
            </Col>
            <Col> </Col>
            {isEveningShift && (
              <Col className="time-select">
                <Form.Control
                  type="time"
                  placeholder="From"
                  value={eveningShiftFrom}
                  className="shift-timings-input"
                  onChange={(e) => setEveningShiftFrom(e.target.value)}
                />
                <Form.Control
                  type="time"
                  placeholder="To"
                  value={eveningShiftTo}
                  className="shift-timings-input"
                  onChange={(e) => setEveningShiftTo(e.target.value)}
                />
              </Col>
            )}
          </Row>
          <Row style={{ justifyContent: "center" }}>
            <Button
              className="update-button"
              style={{ visibility: !shouldShowButton ? "hidden" : "unset" }}
              onClick={() => updateAvailabilityByDays()}
            >
              Update
            </Button>
          </Row>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="edit-doctor-container">
        <Row className="update-schedule-container">
          <Col lg="12" md="12" sm="12" xs="12">
            <Row>
              <span className="section-title">Update Schedule</span>
            </Row>
            {renderGeneralAvailability()}
            {renderUpdateByDate()}
          </Col>
        </Row>
      </div>
    </>
  );
};
export default UpdateSchedule;
