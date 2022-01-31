import { Form } from "react-bootstrap";

const KeyValueSelector = (props) => {
  return (
    <Form.Group>
      <br />
      <Form.Label>{props.label}</Form.Label>
      <select className="form-select" id={props.id} value={props.value} onChange={(e) =>  props.handleSelect(e.target.value)}>
        <option value={`|${props.defaultValue}`} >{props.defaultValue}</option>
        {props.options.map((item) => (
          <option key={item.id} value={`${item.id}|${item.value}`}>{item.value}</option>
        ))}
      </select>
    </Form.Group>
  );
};

export default KeyValueSelector;
