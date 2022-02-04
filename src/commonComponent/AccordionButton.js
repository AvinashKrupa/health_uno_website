import { useEffect } from 'react';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

const AccordionButton = ({fontText,btnText, className, active, route, selectedMenu, eventKey, callback}) => {
  
    const decoratedOnClick = useAccordionToggle(
      eventKey,
      () => {
          callback && callback(eventKey)
        },
    );

    useEffect(() => {
      if(selectedMenu){
        decoratedOnClick()
      }
    }, [selectedMenu]) // eslint-disable-line react-hooks/exhaustive-deps
  
    return (
      <>
       <div style={{
            flexDirection: "row",
            display: "flex",
            background: active === route ? `rgba(${40}, ${163}, ${218}, ${0.2})` : ''
        }} className={'patient-profile-btn ' + className} onClick={decoratedOnClick}>
             <i className={`fas ${fontText}`} style={{ marginTop: '4px', color:"#28A3DA"}}></i>
             <span style={{marginLeft: '15px', }}>{btnText}</span>
         </div>
      </>
    );
  };

  export default AccordionButton;
