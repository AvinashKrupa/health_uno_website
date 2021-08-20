import React from 'react';
import Countdown from 'react-countdown';

const Timer = ({time}) => {
    const renderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        return null;
      } else {
        return <span>{minutes}:{seconds}</span>;
      }
    };
  
    return (
      <>
        <Countdown
           date={time}
           renderer={renderer}  
        />
      </>
    );
  };
  
export default Timer;