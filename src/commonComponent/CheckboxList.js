import { Form } from "react-bootstrap";

const CheckboxList = (props) => {
  return (
    <>
        {props.list.map((value) => (
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <Form.Check
              type="checkbox"
              label={value}
              value={value}
              className="checkbox_container"
              onClick={(e) => props.onClick(e.target.value)}
            />
          </div>
        ))}
    </>
  );
};

export default CheckboxList;