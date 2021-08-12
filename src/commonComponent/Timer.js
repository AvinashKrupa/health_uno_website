import React from 'react';
import Countdown from 'react-countdown';

const Timer = ({timerCallBack}) => {

    // Renderer callback with condition
    const renderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        // Render a completed state
        timerCallBack();
        return null;
      } else {
        // Render a countdown
        return <span>{`Didn't get OTP? Resend in ${seconds} seconds`}</span>;
      }
    };
  
    return (
      <>
        <Countdown
        date={Date.now() + 60000}
        renderer={renderer}
        />
      </>
    );
  };
  
export default Timer;