import { Form, Row, Col, InputGroup } from "react-bootstrap";

const SearchInputWithIcon = (props) => {
  return (
    <Row style={{ marginTop: "33px"}}>
        <Col lg='6'>
            <InputGroup>
                <i className="fas fa-search"></i>
                <Form.Control
                    className={props.className} 
                    defaultValue={props.defaultValue}
                    type="text"
                    placeholder={props.placeholder}
                    onChange={(e) => props.onChange(e.target.value)}
                />
            </InputGroup>
        </Col>
    </Row>
  );
};

export default SearchInputWithIcon;
