import { Row , Col} from "react-bootstrap";

const SlotGenerator = (props) => {
  return (
    <Row style={{ display: "flex", flexDirection: "row", marginBottom: '5px' }}>
      <Col xs='1' sm='1' className="slot-timings-title">{props.label}</Col>
      <Col>
      {props.selectedSlots && props.slots.map((slot) => {
         return (
         
            <button style={{backgroundColor:  slot.status === 'unavailable' ? 'grey' : ''}} className={`slot-timings-button ${props.selectedSlots.indexOf(slot.slot_id) > -1 ? 'active' : ''}`}  onClick={(e) => {
                slot.status === 'available' &&  props.handleSlotClick(slot.slot_id, slot.start)
            }}>
              <span className="slot-timings-button-text">{slot.start}</span>
             </button>
          )
      })}
      </Col>
    </Row>
  );
};
export default SlotGenerator;