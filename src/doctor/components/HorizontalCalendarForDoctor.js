import React, {memo, useEffect, useState} from 'react';
import moment from 'moment';
import {Button,} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";


const HorizontalCalendarForDoctor = (props) => {
    const {slot_id, date, selectedDay, setDateValue, setSelectedDay} = props;
    const [dates, setDate] = useState([]);
    const size = window.screen.availWidth > 414 ? 7 : 4
    const [lastIndex, setLastIndex] = useState(size);

    useEffect(() => {
        let datesArr = [];

        for (let i = 0; i < 7; i++) {
            let dateValue = moment().add(i, 'days').format('DD MMM YYYY').toString();
            datesArr.push(dateValue);
        }

        setDate(datesArr);


    }, [date]);

    const handleDaysClick = (day, info) => {
        setSelectedDay(day, info);

    };

    const _renderDays = (info) => {
        let dateFormate = moment(`${info}`);
        const dateNumber = dateFormate.format('DD');
        const now = dateFormate.format('ddd');
        const month = dateFormate.format('MMM');
        const active = dateNumber === selectedDay;

        return (
            <>
                <Button className={'doctor-days-button card-hover-effect'}
                        style={{backgroundColor: active ? '#28A3DA' : '#FFFFFF', color: active ? '#FFFFFF' : '#28A3DA'}}
                        onClick={(e) => handleDaysClick(dateNumber, info)}
                >
                    <span
                        style={{color: active ? '#FFFFFF' : '#000000'}}
                        className="doctor-days-button-text">{dateNumber} {now} {window.screen.availWidth > 700 && month}</span>
                </Button>
            </>
        );
    };

    return (
        <div className='doctor-slot-booking-cal'>
            <div className='doctor-slot-booking'
                 style={{display: "flex", flexDirection: "row"}}
            >
                {dates.slice(lastIndex - size, lastIndex).map(info => {
                    return _renderDays(info);
                })}
            </div>
        </div>
    );
};

export default memo(HorizontalCalendarForDoctor);
