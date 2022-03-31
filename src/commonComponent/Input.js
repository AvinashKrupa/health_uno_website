import { Form } from "react-bootstrap";

const Input = (props) => {
  return (
    <Form.Group>
      <br />
      <Form.Label>
        {props.label}
        {props.required && <span className="star">*</span>}
      </Form.Label>
      <Form.Control
        value={props.value}
        type={props.type}
        id={props.id}
        placeholder={props.placeholder || null}
        readOnly={props.readonly || false}
        disabled={props.disabled || false}
        onChange={(e) =>
          props.onChange ? props.onChange(e.target.value) : null
        }
        min={props.min}
        maxLength={props.maxLength}
        onBlur={(e) => (props.onBlur ? props.onBlur(e.target.value) : null)}
      ></Form.Control>
    </Form.Group>
  );
};

export default Input;
