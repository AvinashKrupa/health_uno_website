import React from 'react';
import Countdown from 'react-countdown';

const Timer = ({timerCallBack, time}) => {
  console.log('time: ', time);

    // Renderer callback with condition
    const renderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        // Render a completed state
        // timerCallBack();
        return null;
      } else {
        // Render a countdown
        return <span>{minutes} : {seconds}</span>;
      }
    };
  
    return (
      <>
        <Countdown
         date={Date.now() + time.minutes * 1000 * 60 - (time.milliseconds - time.seconds * 60 ) }
          //  date={Date.now() + time * 1000 * 60   }
           renderer={renderer}  
        />
      </>
    );
  };
  
export default Timer;