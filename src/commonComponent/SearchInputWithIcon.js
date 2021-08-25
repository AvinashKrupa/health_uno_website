import { Form, Row, Col, InputGroup } from "react-bootstrap";

const SearchInputWithIcon = (props) => {
  return (
    <Row  className="searchRow" style={{width: '100%', marginTop: "33px"}}>
        <Col lg={props.col ? props.col : '6'}>
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
