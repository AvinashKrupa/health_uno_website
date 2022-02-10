import { Form, InputGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { useState } from "react"

const HeightInput = (props) => {
    const [dropdownTitle, setDropdownTitle] = useState("cm");
    const dropItems = props.dropdownItems.map(item => {
        return (
            <Dropdown.Item onClick={() => heightTypeChange(item)}>{item}</Dropdown.Item>
        )
    })

    const heightTypeChange = (item) => {
        setDropdownTitle(item);
        props.onTypeChange(item);
    }

    return (
        <Form.Group>
            <br />
            <Form.Label>{props.label}</Form.Label>
            <InputGroup>
                    <Form.Control
                        value={props.value}
                        type={props.type}
                        id={props.id}
                        placeholder={props.placeholder || null}
                        readOnly={props.readonly || false}
                        disabled={props.disabled || false}
                        onChange={(e) => props.onChange(e.target.value)}
                        min={props.min}
                        maxLength={props.maxLength}
                        onBlur={(e) => props.onBlur ? props.onBlur(e.target.value) : null}
                    ></Form.Control>
                <DropdownButton
                    style={{marginLeft: "auto"}}
                    variant="outline-secondary"
                    title={dropdownTitle}
                    align="end"
                >
                    {dropItems}
                </DropdownButton>
            </InputGroup>
        </Form.Group>
    );
};

export default HeightInput;
