import React from 'react';
import Countdown,{ zeroPad } from 'react-countdown';

const Timer = ({time, handleEnableButton}) => {
    const renderer = ({ hours, minutes, seconds, completed }) => {
        // Enables button when 5 min left
      if (minutes <= 4) {
          handleEnableButton()
      }
      if (completed) {
        return null;
      } else {
        return <span>{`${zeroPad(minutes)}:${zeroPad(seconds)}`}</span>;
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
