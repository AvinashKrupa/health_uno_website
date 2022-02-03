import { Form } from "react-bootstrap";

const CheckboxList = (props) => {
  return (
    <>
        {props.list.map((value, key) => (
          <div key={key} style={{display: 'flex', flexDirection: 'row'}}>
            <Form.Check
              type="checkbox"
              label={value}
              value={value}
              onChange={()=>{}}
              checked={props.selectedLanguages.includes(value)}
              className="checkbox_container"
              onClick={(e) => {
                props.onClick(value)
              }}
            />
          </div>
        ))}
    </>
  );
};

export default CheckboxList;
