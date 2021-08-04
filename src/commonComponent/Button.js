import { Button } from "react-bootstrap";

const CustomButton = ({text, disabled, onClick, className}) => {
    return (
      <>
        <Button className={`button ${className}`} disabled={disabled} onClick={onClick}>{text}</Button>
      </>
    );
  };
  
  export default CustomButton;
  
  