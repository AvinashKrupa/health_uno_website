import React, {memo, useEffect, useState} from 'react';
import moment from 'moment';
import {Button,} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";


const HorizontalCalendarForDoctor = (props) => {
    const {date, selectedDay, setSelectedDay} = props;
    const [dates, setDate] = useState([]);
    const [size, setSize] = useState(7);

    useEffect(() => {
        if(window.screen.availWidth > 1024){
            setSize(7)
        } else if(window.screen.availWidth > 414){
            setSize(5)
        }else {
            setSize(4)
        }
    }, [window.screen.availWidth]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        let datesArr = [];

        for (let i = 0; i < 7; i++) {
            let dateValue = moment().add(i, 'days').format('DD/MMM/YYYY').toString();
            datesArr.push(dateValue);
        }

        setDate(datesArr);


    }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

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
                {dates.slice(size - size, size).map(info => {
                    return _renderDays(info);
                })}
            </div>
        </div>
    );
};

export default memo(HorizontalCalendarForDoctor);
