import { Row } from "react-bootstrap";

const SlotGenerator = (props) => {
  return (
    <Row style={{ display: "flex", flexDirection: "row" }}>
      <span className="slot-timings-title">{props.label}</span>
      {props.selectedSlots && props.slots.map((slot) => {
         return (
            <button className={`slot-timings-button ${props.selectedSlots.indexOf(slot.slot_id) > -1 ? 'active' : ''}`}  onClick={(e) => props.handleSlotClick(slot.slot_id)}>
              <span className="slot-timings-button-text">{slot.start}</span>
             </button>
          )
      })}
    </Row>
  );
};
export default SlotGenerator;