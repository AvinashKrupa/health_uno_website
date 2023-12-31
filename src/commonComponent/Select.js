import { Form } from "react-bootstrap";

const Selector = (props) => {
  return (
    <Form.Group>
      <br />
      <Form.Label>{props.label}{props.required && <span className="star">*</span>}</Form.Label>
      <select className="form-select" id={props.id} value={props.value} onChange={(e) => props.handleSelect(e.target.value)}>
      { props.placeholder ? <option value="">{props.placeholder}</option> : null }
        { props.defaultValue ? <option value="" defaultValue={props.defaultValue}>{props.defaultValue}</option> : null }
        {props.options.map((item, key) => (
          <option key={key} value={item}>{item}</option>
        ))}
      </select>
    </Form.Group>
  );
};
export default Selector;
