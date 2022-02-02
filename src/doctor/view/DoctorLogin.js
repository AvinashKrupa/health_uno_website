import React, { useContext, useState } from "react";
import {
  Col,
  Container,
  Dropdown,
  DropdownButton,
  FormControl,
  Image,
  InputGroup,
  Row,
} from "react-bootstrap";
import {
  doctor,
  frame,
  logo,
  plant,
  group,
} from "../../constants/PatientImages";
import { H1, H3 } from "./../../commonComponent/TextSize";
import { API, post } from "../../api/config/APIController";
import { AuthContext } from "../../context/AuthContextProvider";
import CustomButton from "./../../commonComponent/Button";
import { useToasts } from "react-toast-notifications";
import { storeData } from "../../storage/LocalStorage/LocalAsyncStorage";
import ModalDialog from "../../commonComponent/ModalDialog";

const DoctorLogin = ({ history }) => {
  let timer = null;
  const { addToast } = useToasts();
  const authContext = useContext(AuthContext);
  const [mobileNumber, setMobileNumber] = useState(
    authContext.phone ? authContext.phone : ""
  );
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [suspendResponse, setSuspendResponse] = useState({});
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleOnChange = (e) => {
    if (isNaN(Number(e.target.value))) {
      setMobileNumberError("Please enter a valid mobile number");
    } else {
      setMobileNumberError("");
    }
  };

  function debounce() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      onClick();
    }, 1000);
  }

  const onClick = () => {
    const numbers = Array.from(mobileNumber);
    const isNumber = (currentValue) => !isNaN(currentValue);

    if (
      !numbers.every(isNumber) ||
      numbers.length < 10 ||
      numbers.length > 10
    ) {
      return;
    }
    let params = {
      mobile_number: mobileNumber,
      country_code: "+91",
      type: 2,
    };

    authContext.setPhone(mobileNumber);
    setShowLoader(true);
    post(API.SENDOTP, params, true)
      .then((response) => {
        if (response.status === 200) {
          storeData("USER_TYPE", 2);
          setShowLoader(false);
          addToast(response.data.message, { appearance: "success" });
          history.push("/doctor/otp");
        } else {
          setShowLoader(false);
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        if(error.response.data.data){
          setShowPopUp(true)
          setSuspendResponse(error.response)
        }
        setShowLoader(false);
        addToast(error.response.data.message, { appearance: "error" });
      });
  };

  const renderSuspendResponse = () => {
    let SuspendResponseText = ''
    if(isMobile){
      SuspendResponseText = `${suspendResponse && suspendResponse.data && suspendResponse.data.message}`
    }else{
      SuspendResponseText = `${suspendResponse && suspendResponse.data && suspendResponse.data.message} \n For more information call on : <a href="tel:${suspendResponse && suspendResponse.data && suspendResponse.data.data && suspendResponse.data.data.call}">${suspendResponse && suspendResponse.data && suspendResponse.data.data && suspendResponse.data.data.call}</a>`
    }
    return { __html: SuspendResponseText };
  } 

  const token = localStorage.getItem("ACCESS_TOKEN");
  const userType = localStorage.getItem("USER_TYPE");
  return (
    <>
    {token && userType === '2' ? history.push("/doctor/home") :
      <Container fluid>
        <Row className="login-container LoginPageDoctor">
          <Col className="left-nav">
            <Row>
              <Col lg="10" md="10" sm="12" className="text-container">
                <div className="description">
                  <Col lg="1">
                    <Image src={doctor}></Image>
                  </Col>
                  <Col lg="11" className="login-icon-side-txt">
                    <div>
                      <H3 text="Manage your clinic"></H3>
                    </div>
                    <p>
                      Track and manage all your appointments and modify them
                      with our user-friendly UI
                    </p>
                  </Col>
                </div>

                <div className="description">
                  <Col lg="1">
                    <Image src={frame}></Image>
                  </Col>
                  <Col lg="11" className="login-icon-side-txt">
                    <div>
                      <H3 text="Medical Records Management"></H3>
                    </div>
                    <p>
                      {" "}
                      Use our proprietary software to store and manage all
                      patient records digitally secured and stored in a secure
                      cloud database with access control
                    </p>
                  </Col>
                </div>

                <div className="description">
                  <Col lg="1">
                    <Image src={plant}></Image>
                  </Col>
                  <Col lg="11" className="login-icon-side-txt">
                    <div>
                      <H3 text="Mentoring/Peer Review consultation"></H3>
                    </div>
                    <p>
                      {" "}
                      Ask another panel physician to join your current/upcoming
                      consultation and provide additional advice as required
                    </p>
                  </Col>
                </div>
              </Col>
            </Row>
            <Row className="doctor-image">
              <Col>
                {" "}
                <Image src={group}></Image>
              </Col>
            </Row>
          </Col>

          <Col className="form">
            <div>
              <div className="logo">
                <Image
                  style={{ cursor: "pointer" }}
                  src={logo}
                  onClick={() => history.push("/")}
                ></Image>
              </div>
              <div className="form-details">
                <div className="right-nav">
                  <H1 text={"Hello there !"}></H1>
                  <H3 text={"Welcome"}></H3>
                  <p> Sign in to continue with your mobile number </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      debounce();
                    }}
                  >
                    <InputGroup
                      size="sm"
                      style={{ maxWidth: "350px" }}
                      onChange={(e) => setMobileNumber(e.target.value)}
                    >
                      <DropdownButton variant="outline-secondary" title="+91">
                        <Dropdown.Item>+91</Dropdown.Item>
                      </DropdownButton>
                      <FormControl
                        type="text"
                        value={mobileNumber}
                        pattern="\d*"
                        maxLength="10"
                        onChange={handleOnChange}
                      />
                      <p
                        style={{
                          marginBottom: mobileNumberError ? "20px" : "60px",
                        }}
                        className="description-small"
                      >
                        A 4 digit OTP will be sent through SMS to verify your
                        mobile number
                      </p>
                      {!!mobileNumberError && (
                        <div
                          style={{ textAlign: "center" }}
                          className="error-text"
                        >
                          {mobileNumberError}
                        </div>
                      )}
                    </InputGroup>
                    {showLoader && (
                      <CustomButton
                        type="submit"
                        disabled
                        onClick={debounce}
                        importantStyle={{ backgroundColor: "#e2e9e9" }}
                        showLoader={showLoader}
                      ></CustomButton>
                    )}
                    {!showLoader && (
                      <CustomButton
                        type="submit"
                        disabled={
                          !(mobileNumber.length === 10 && !mobileNumberError)
                        }
                        onClick={debounce}
                        text={"Continue"}
                      ></CustomButton>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        {showPopUp && (
        <ModalDialog
          onSubmit={() => {
            // window.location.href = 'tel:' + suspendResponse && suspendResponse.data && suspendResponse.data.data && suspendResponse.data.data.call
            window.open(`tel:${suspendResponse && suspendResponse.data && suspendResponse.data.data && suspendResponse.data.data.call}`);
          }}
          btnText={"Call"}
          show={showPopUp}
          isConfirm={!isMobile}
          closeDialog={() => {
            setShowPopUp(false);
            setSuspendResponse({});
          }}
        >
          <h6 className="title">Account</h6>
          <p className="text">
            <span dangerouslySetInnerHTML={renderSuspendResponse()} /> 
          </p>
        </ModalDialog>
      )}
      </Container>
}
    </>
  );
};

export default DoctorLogin;
