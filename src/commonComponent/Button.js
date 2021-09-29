import { Button } from "react-bootstrap";
import Spinner from "./Spinner";

const CustomButton = ({text, disabled, onClick, className, type, importantStyle, showLoader}) => {
    return (
      <>
        <Button style={importantStyle} className={`button ${className}`} type={type} disabled={disabled} onClick={onClick}>
            {showLoader? <Spinner showLoader={true} width={30} height={30}/> : text}</Button>
      </>
    );
  };

  export default CustomButton;

