import { Form, InputGroup, Dropdown, DropdownButton } from "react-bootstrap";
import { useState, useEffect } from "react"

const HeightInput = (props) => {
    const [dropdownTitle, setDropdownTitle] = useState("cm");
    const [feetDropdownTitle, setFeetDropdownTitle] = useState("Feet");
    const [inchesDropdownTitle, setInchesDropdownTitle] = useState("Inches");
    const [inchesDisabled, setInchesDisabled] = useState(false);
    const dropItems = props.dropdownItems.map(item => {
        return (
            <Dropdown.Item onClick={() => setDropdownTitle(item)}>{item}</Dropdown.Item>
        )
    })

    const feet = ["1", "2", "3", "4", "5", "6", "7"];
    const inches = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
    
    useEffect(() => {
        if (feetDropdownTitle === "7 feet") {
            setInchesDisabled(true);
        }
        else {
            setInchesDisabled(false);
        }
    }, [feetDropdownTitle])

    const feetDropItems = feet.map(item => {
        return (
            <Dropdown.Item onClick={() => setFeetDropdownTitle(item + " feet")}>{item}</Dropdown.Item>
        )
    })

    const inchesDropItems = inches.map(item => {
        return (
            <Dropdown.Item onClick={() => setInchesDropdownTitle(item + " inches")}>{item}</Dropdown.Item>
        )
    })

    return (
        <Form.Group>
            <br />
            <Form.Label>{props.label}</Form.Label>
            <InputGroup>
                {dropdownTitle === "feet" ?
                    <>
                        <DropdownButton
                            variant="outline-secondary"
                            title={feetDropdownTitle}
                            align="end"
                        //defaultValue={"feet"}
                        >
                            {feetDropItems}
                        </DropdownButton>
                        <DropdownButton
                         style={{marginLeft: "auto"}}
                            variant="outline-secondary"
                            title={inchesDropdownTitle}
                            align="end"
                            disabled={inchesDisabled}
                        //defaultValue={"feet"}
                        >
                            {inchesDropItems}
                        </DropdownButton>
                    </>
                    :
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
                }
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
