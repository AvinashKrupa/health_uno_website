import {useEffect, useState} from "react";
import moment from 'moment';
import {Row, Col, Button, Form, InputGroup} from "react-bootstrap";
import SlotGenerator from "../slot/SlotGenerator";
import Checkbox from '../../../commonComponent/Checkbox'
import {API, post} from '../../../api/config/APIController';
import {useToasts} from "react-toast-notifications";

const DocRegistrationPage3 = (props) => {

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const {
        selectedDays, daySlots, eveningSlots, isDayShift, isEveningShift, dayShiftFrom,
        dayShiftTo, eveningShiftFrom, eveningShiftTo, dataMorningShift,
        dataEveningShift, setSelectedDays, setDaySlots, setEveningSlots, setIsDayShift,
        setIsEveningShift, setDayShiftFrom, setDayShiftTo, setEveningShiftFrom, setEveningShiftTo,
        setDataMorningShift, setDataEveningShift
    } = props;
    const [currentDate, setCurrentDate] = useState(moment().format('DD-MM-YYYY'));
    const {addToast} = useToasts();

    useEffect(() => {
        if (validateSlots(1))
            getSlots(1, dayShiftFrom, dayShiftTo);
        return () => {
        };
    }, [dayShiftFrom, dayShiftTo]);

    useEffect(() => {

        if (validateSlots(2))
            getSlots(2, eveningShiftFrom, eveningShiftTo);

        return () => {
        };
    }, [eveningShiftFrom, eveningShiftTo]);

    function validateSlots(type) {
        let momentShift1From, momentShift1To;
        let momentShift2From, momentShift2To;
        switch (type) {
            case 1:
                if (dayShiftFrom == "" || dayShiftTo == "")
                    return true
                momentShift1From = moment(dayShiftFrom, "HH:mm")
                momentShift1To = moment(dayShiftTo, "HH:mm")
                if (!momentShift1From.isBefore(momentShift1To)) {
                    addToast("Morning shift start time cannot be after end time", {appearance: 'error'});
                    return false
                }
                if (eveningShiftFrom != "" && eveningShiftTo != "") {
                    momentShift2From = moment(eveningShiftFrom, "HH:mm")
                    if (!momentShift1To.isBefore(momentShift2From)) {
                        addToast("Morning shift end time cannot be after evening shift start time", {appearance: 'error'});
                        return false
                    }
                }
                return true
            case 2:

                if (eveningShiftFrom == "" || eveningShiftTo == "")
                    return true
                momentShift2From = moment(eveningShiftFrom, "HH:mm")
                momentShift2To = moment(eveningShiftTo, "HH:mm")
                if (!momentShift2From.isBefore(momentShift2To)) {
                    addToast("Evening shift start time cannot be after end time", {appearance: 'error'});
                    return false
                }
                if (dayShiftFrom != "" && dayShiftTo != "") {
                    momentShift1To = moment(dayShiftTo, "HH:mm")
                    if (!momentShift1To.isBefore(momentShift2From)) {
                        addToast("Evening shift start time cannot be earlier than morning shift end time", {appearance: 'error'});
                        return false
                    }
                }
                return true

        }


    }

    const handleDaysClick = (id) => {
        const list = JSON.parse(JSON.stringify(selectedDays));
        const index = list.indexOf(id);

        if (index > -1) {
            list.splice(index, 1);
            setSelectedDays(list)
        } else {
            setSelectedDays([...list, id])
        }

    };

    function getSlots(type, from, to) {
        const date = moment(`${currentDate}`, 'DD-MM-YYYY').format('YYYY-MM-DD')
        let fromDate = `${date}T${from}:00.000+05:30`;
        let toDate = `${date}T${to}:59.999+05:30`;
        ;

        let params = {
            start: fromDate,
            end: toDate,
        };

        post(API.GETSLOTS, params)
            .then(response => {
                if (response.status === 200) {
                    let data = response.data.data.map(info => {
                        const time = info.start.split(":")
                        info.timeInNumber = time[0]
                        info.time = time[0];
                        return info;
                    });

                    let group = data.reduce((r, a) => {
                        r[a.time] = [...r[a.time] || [], a];
                        return r;
                    }, {});
                    if (type === 1) {
                        setDataMorningShift(group);
                    } else {
                        setDataEveningShift(group);
                    }
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    const handleDaySlotClick = (id) => {
        const list = JSON.parse(JSON.stringify(daySlots));
        const index = list.indexOf(id);

        if (index > -1) {
            list.splice(index, 1);
            setDaySlots(list)
        } else {
            setDaySlots([...list, id])
        }

    };

    const handleEveningSlotClick = (id) => {
        const list = JSON.parse(JSON.stringify(eveningSlots));
        const index = list.indexOf(id);

        if (index > -1) {
            list.splice(index, 1);
            setEveningSlots(list)
        } else {
            setEveningSlots([...list, id])
        }

    };

    const dayShiftSlot = () => {
        return Object.entries(dataMorningShift).sort().map((timeSlot) => {
            return (
                <SlotGenerator selectedSlots={daySlots} handleSlotClick={handleDaySlotClick} label={`${timeSlot[0]} AM`}
                               slots={timeSlot[1]}/>
            )
        })
    };

    const EveningShiftSlot = () => {
        return Object.entries(dataEveningShift).map((timeSlot) => {
            return (
                <SlotGenerator selectedSlots={eveningSlots} handleSlotClick={handleEveningSlotClick}
                               label={`${timeSlot[0]} PM`} slots={timeSlot[1]}/>
            )
        })
    }

    return (
        <>
            <Row>
                <Col lg='2'></Col>
                <Col lg='10'>
                    <Row>
                        <span className="H3">Select available timings</span>
                    </Row>
                    <Row style={{display: "flex", flexDirection: "row"}}>
                        {days.map((day) => {
                            let active = selectedDays.includes(day);
                            return (
                                <Button className={'days-button'} onClick={(e) => handleDaysClick(day)}
                                        style={{backgroundColor: active ? '#28A3DA' : 'white'}}>
                                    <span className="days-button-text"
                                          style={{color: active ? "white" : ""}}>{day}</span>
                                </Button>
                            )
                        })}
                    </Row>
                    <Row>
                        <span style={{marginTop: "10px", marginBottom: "20px"}} className="H3">Select available timings</span>
                    </Row>
                    <Row>
                        <Col lg='3'>
                            <InputGroup>
                                <span className="H4">Day Shift</span>
                                <Checkbox id="term" checked={isDayShift} handleSelect={setIsDayShift}/>
                            </InputGroup>
                        </Col>
                        <Col></Col>
                        <Col className='time-select'>
                            <Form.Control
                                type="time"
                                placeholder="From"
                                className="shift-timings-input"
                                onChange={(e) => setDayShiftFrom(e.target.value)}
                            />

                            <Form.Control
                                type="time"
                                placeholder="To"
                                className="shift-timings-input"
                                onChange={(e) => setDayShiftTo(e.target.value)}
                            />
                        </Col>
                    </Row>
                    {dayShiftSlot()}
                    <div className='slot-evening'>
                        <Row>
                            <Col lg='3'>
                                <InputGroup>
                                    <span className="H4">Evening Shift</span>
                                    <Checkbox id="term" checked={isEveningShift} handleSelect={setIsEveningShift}/>
                                </InputGroup>
                            </Col>
                            <Col> </Col>
                            <Col className='time-select'>
                                <Form.Control
                                    type="time"
                                    placeholder="From"
                                    className="shift-timings-input"
                                    onChange={(e) => setEveningShiftFrom(e.target.value)}
                                />
                                <Form.Control
                                    type="time"
                                    placeholder="To"
                                    className="shift-timings-input"
                                    onChange={(e) => setEveningShiftTo(e.target.value)}
                                />
                            </Col>
                        </Row>
                        {EveningShiftSlot()}
                    </div>
                </Col>
                <Col lg='2'></Col>
            </Row>
        </>
    );
};
export default DocRegistrationPage3;
