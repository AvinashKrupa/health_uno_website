

import { Form } from "react-bootstrap";

const TextArea = (props) => {
  return (
    <Form.Group>
      <br />
      <Form.Label>{props.label}</Form.Label>
        <textarea id={props.id} placeholder={props.placeholder} className='textArea' value={props.value} rows={props.row} cols={props.cols}  onChange={(e) => props.onChange(e.target.value)}>
          {props.value}
        </textarea>
    </Form.Group>
  );
};

export default TextArea;




