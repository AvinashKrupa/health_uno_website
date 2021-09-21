import React from 'react';
import Countdown from 'react-countdown';

const MeetingTimer = ({date, handleEnableButton}) => {
    debugger
    const renderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        handleEnableButton()
        return null;
      } else {
        return <div className="meeting-timer-container">{`Meeting starts in ${hours}:${minutes}:${seconds}`}</div>;
      }
    };

    return (
      <>
        <Countdown
           date={date}
           renderer={renderer}
        />
      </>
    );
  };

export default MeetingTimer;
