import { Col, Row } from "react-bootstrap";
import { getData } from "../../../../storage/LocalStorage/LocalAsyncStorage";
import getColor from "../../../../utils/Colors";
import { convert24hto12h } from "../../../../utils/utilities";

const UpdateSlotGenerator = (props) => {
  const userType = JSON.parse(getData("USER_TYPE"));
  return (
    <Row style={{ display: "flex", flexDirection: "row", marginBottom: "5px" }}>
      <Col xs="1" sm="1" className="slot-timings-title">
        {props.label}
      </Col>
      <Col>
        {props.selectedSlots &&
          props.slots.map((slot, key) => {
            return (
              <button
                key={key}
                style={{ backgroundColor: getColor(slot) }}
                // style={{
                //   backgroundColor:
                //     slot.status === "available" ? "#28a3da" : "rgb(225, 225, 225)",
                // }}
                className={`slot-timings-button ${
                  props.selectedSlots.indexOf(slot.slot_id) > -1 ? "active" : ""
                }`}
                onClick={(e) => {
                  userType === 2
                    ? props.handleSlotClick(slot)
                    : slot.status === "available" &&
                      props.handleSlotClick(slot.slot_id, slot.start);
                }}
              >
                <span
                  className="slot-timings-button-text"
                  style={{
                    color: slot.is_avail ? "white" : "black",
                  }}
                >
                  {convert24hto12h(slot.start)}
                </span>
              </button>
            );
          })}
      </Col>
    </Row>
  );
};
export default UpdateSlotGenerator;
