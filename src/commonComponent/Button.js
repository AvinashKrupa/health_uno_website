import { Button } from "react-bootstrap";

const CustomButton = ({text, disabled, onClick, className, type}) => {
    return (
      <>
        <Button className={`button ${className}`} type={type} disabled={disabled} onClick={onClick}>{text}</Button>
      </>
    );
  };
  
  export default CustomButton;
  
  