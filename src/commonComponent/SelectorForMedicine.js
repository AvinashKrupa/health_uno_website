import { Form } from "react-bootstrap";

const SelectorForMedicine = (props) => {
  return (
    <Form.Group>
      <br />
      <Form.Label>{props.label}</Form.Label>
      <select className="form-select" id={props.id} onChange={(e) => {
          props.handleSelect(e.target.value)
      }}>
        <option defaultValue={`|${props.defaultValue}`}>{props.defaultValue}</option>
        {props.options.map((item) => (
          <option value={`${item._id}|${item.name}`}>{item.name}</option>
        ))}
      </select>
    </Form.Group>
  );
};
export default SelectorForMedicine;
