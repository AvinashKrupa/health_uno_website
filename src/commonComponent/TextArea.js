import { Form, Container } from "react-bootstrap";

const TextArea = (props) => {
  return (
    <Container>
      <Form.Label className="textarea-label">{props.label}</Form.Label>
      <Form.Control
        className="textarea-field"
        as="textarea"
        id={props.id}
        placeholder={props.placeholder}
        value={props.value}
        rows={props.row}
        cols={props.cols}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.value}
      </Form.Control>
    </Container>
  );
};

export default TextArea;