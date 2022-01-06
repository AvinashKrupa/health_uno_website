import { Row, Col, Image } from "react-bootstrap";
import Timer from "../../../commonComponent/Timer";
import ModalDialog from "../../../commonComponent/ModalDialog";
import CustomButton from "../../../commonComponent/Button";
import { useState } from "react";
import { Card, CardContent, CardMedia } from "@material-ui/core";
import TextArea from "../../../commonComponent/TextArea";
import { useToasts } from "react-toast-notifications";
import { camera } from "../../../constants/PatientImages";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import {
  capitalizeFirstLetter,
  convert24hto12h,
  getTimer,
  replaceUnderscore,
} from "../../../utils/utilities";
import { getColorForAppointmentStatus } from "../../../utils/Colors";
import IframeModal from "../IframeModal";
import Checkbox from "../../../commonComponent/Checkbox";
import { API, get, post } from "../../../api/config/APIController";
import { clearSession } from "../../../storage/LocalStorage/LocalAsyncStorage";

const DoctorAppointmentsCard = (props) => {
  const [toggleModal, setToggleModal] = useState(false);
  const [enableMeetingButton, setEnableMeetingButton] = useState(false);
  const [reason, setReason] = useState("");
  const { addToast } = useToasts();
  const [id, setId] = useState(props?.appointment._id);
  const [modalShow, setModalShow] = useState(false);
  const [termsCondition, setTermsCondition] = useState(false);
  const [show, setShow] = useState(false);
  const [showLastAttempt, setShowLastAttempt] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");

  function getCancelCountOfAppointment(id, reason) {
    get(API.GETCOUNTOFCANCELAPPOINTMENT)
      .then((response) => {
        if (response.status == 200) {
          const { number_of_attempts, title, message } = response.data.data;

          if (number_of_attempts == 1 || number_of_attempts == 2) {
            setMessage(message);
            setTitle(title);
            setShow(true);
          } else if (number_of_attempts >= 3) {
            setShowLastAttempt(true);
          } else {
            props.cancelAppointment(props?.appointment._id, reason);
          }
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }
  const handleLogout = (routeName) => {
    post(API.LOGOUT)
      .then((response) => {
        if (response.status === 200) {
          addToast(response.data.message, { appearance: "success" });
          clearSession();
          props.history.push(`${routeName}`);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  };
  function onSubmit() {
    if (reason === "") {
      addToast("Please enter cancel reason", { appearance: "error" });
    } else if (termsCondition === false) {
      addToast("Please accept terms and condition", { appearance: "error" });
    } else {
      setToggleModal(false);
      getCancelCountOfAppointment(props?.appointment._id, reason);
    }
  }

  function handleEnableButton() {
    setEnableMeetingButton(true);
  }

  const timerEnable = getTimer(
    `${props?.appointment.time.date} ${props?.appointment.time.slot}`
  );
  const buttonTitle =
    props.appointment.status === "scheduled" ? "Cancel" : "Prescription";
  const isPrescriptionPresent = props.appointment?.presc_url;
  const appointmentStatus = capitalizeFirstLetter(props?.appointment.status);
  const canShowTransactionStatus =
    appointmentStatus === "Cancelled" && props.appointment.transaction_status;
  return (
    <>
      <Card
        style={{ height: "max-content" }}
        className="upcoming-appointment-card-container"
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <CardMedia
              className="upcoming-appointment-card-image"
              image={props?.appointment.dp}
            ></CardMedia>
          </div>
          <div>
            <CardContent>
              <div className="doctor-card-doctor-name text-tooltip">{`Dr ${props?.appointment.first_name} ${props?.appointment.last_name}`}</div>
              <div className="doctor-card-doctor-name">
                <Image
                  className="card-image-video-camera"
                  src={camera}
                  alt="Video Camera"
                />
              </div>
              <div className="doctor-card-doctor-details">
                {" "}
                {`${props?.appointment.address.city}, ${props?.appointment.address.country} | ${props?.appointment.exp} Y Exp`}
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <span className="doctor-card-fee-label">Fee:</span>
                <span className="doctor-card-fee-value">
                  Rs {props?.appointment.fee}
                </span>{" "}
                <span
                  className="doctor-card-app-status"
                  style={{
                    color: getColorForAppointmentStatus(
                      props?.appointment.status
                    ),
                  }}
                >{`(${appointmentStatus})`}</span>
              </div>
              {canShowTransactionStatus && (
                <div>
                  <span className="doctor-card-fee-label">Refund Status:</span>
                  <span className="doctor-card-refund-status">
                    {replaceUnderscore(props?.appointment?.transaction_status)}
                  </span>{" "}
                </div>
              )}
              <span>
                <span
                  className="doctor-card-specialization-text"
                  style={{ marginTop: "10px" }}
                >
                  {props?.appointment.specialities.map((s) => {
                    return (
                      <span
                        key={s}
                        style={{ padding: "4px", marginRight: "10px" }}
                        className="doctor-card-specialization-container"
                      >
                        {s}
                      </span>
                    );
                  })}
                </span>
              </span>
              <div style={{ position: "relative" }}>
                <span className="card-text-date-and-time">
                  {`${props?.appointment.time.date}, ${convert24hto12h(
                    props?.appointment.time.slot
                  )}`}
                  <span className="card-text-time">
                    {["scheduled", "ongoing"].includes(
                      props.appointment.status
                    ) &&
                      timerEnable && (
                        <Timer
                          time={props?.appointment.time.utc_time}
                          handleEnableButton={handleEnableButton}
                        ></Timer>
                      )}
                  </span>
                </span>
              </div>
              <Row className="card-buttons-row">
                <Col>
                  {["scheduled", "ongoing"].includes(
                    props.appointment.status
                  ) ? (
                    <CustomButton
                      className="card-button-join"
                      disabled={
                        !(
                          enableMeetingButton ||
                          props.appointment.is_joining ||
                          props.appointment.status === "ongoing"
                        )
                      }
                      onClick={() => {
                        props.history.push({
                          pathname: `/patient/videoMeeting/${props?.appointment.doctor_id}`,
                          state: { appointment_id: props?.appointment._id },
                        });
                      }}
                      text={"Join meeting"}
                    ></CustomButton>
                  ) : (
                    <CustomButton
                      className="card-button-join"
                      onClick={() =>
                        props.history.push(
                          `/patient/slotBooking/${props?.appointment.doctor_id}`
                        )
                      }
                      text={"Rebook"}
                    ></CustomButton>
                  )}
                </Col>
                <Col>
                  {props.appointment.status === "scheduled" && (
                    <span
                      onClick={setToggleModal}
                      className={`card-text-${buttonTitle}`}
                    >
                      {buttonTitle}
                    </span>
                  )}
                  {props.appointment.status !== "scheduled" && (
                    <button
                      disabled={!isPrescriptionPresent}
                      className={
                        !isPrescriptionPresent
                          ? "card-text-button-disabled"
                          : `card-text-${buttonTitle}`
                      }
                      onClick={() =>
                        props.history.push({
                          pathname: "/patient/reports/view",
                          state: { url: isPrescriptionPresent },
                        })
                      }
                    >
                      {" "}
                      {buttonTitle}
                    </button>
                  )}
                </Col>
              </Row>
            </CardContent>
          </div>
        </div>
      </Card>
      <ModalDialog
        btnText={"Confirm"}
        onSubmit={onSubmit}
        show={toggleModal}
        title={"Cancel Appointment"}
        closeDialog={() => {
          setReason("");
          setToggleModal(!toggleModal);
          setTermsCondition(false);
        }}
      >
        <TextArea
          id={"reason"}
          label="Describe the reason"
          value={reason}
          onChange={setReason}
          rows={4}
          cols={35}
        ></TextArea>
        <Col md>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Checkbox
              id="term"
              checked={termsCondition}
              handleSelect={setTermsCondition}
            />
            <span>
              I accept{" "}
              <a
                style={{ color: "blue", lineHeight: "65px" }}
                onClick={() => setModalShow(true)}
              >
                <span style={{ textDecoration: "underline" }}>
                  Cancellation policy
                </span>
              </a>
            </span>
          </div>
        </Col>
      </ModalDialog>
      <ModalDialog
        modalClassName={"terms-content"}
        isConfirm={true}
        show={modalShow}
        title={"Cancellation Policy"}
        closeDialog={() => {
          setModalShow(false);
        }}
      >
        <IframeModal
          url={`${process.env.REACT_APP_BASE_URL}cancellation_policy`}
        />
      </ModalDialog>
      {show && (
        <ModalDialog
          onSubmit={() => {
            if (reason == "") {
              addToast("Please enter cancel reason", { appearance: "error" });
            } else if (termsCondition === false) {
              addToast("Please accept terms and condition", {
                appearance: "error",
              });
            } else {
              setShow(false);
              props.cancelAppointment(props?.appointment._id, reason);
              setReason("");
            }
          }}
          btnText={"Yes"}
          cancelBtnText={"No"}
          show={show}
          closeDialog={() => {
            setShow(false);
          }}
        >
          <h6 className="title">{title}</h6>
          <p className="text">{message}</p>
        </ModalDialog>
      )}
      {showLastAttempt && (
        <ModalDialog
          onSubmit={() => {
            if (reason == "") {
              addToast("Please enter cancel reason", { appearance: "error" });
            } else if (termsCondition === false) {
              addToast("Please accept terms and condition", {
                appearance: "error",
              });
            } else {
              handleLogout("/patient/");
              setShowLastAttempt(false);
            }
          }}
          btnText={"Okay"}
          show={showLastAttempt}
          closeDialog={() => {
            setShowLastAttempt(false);
          }}
        >
          <h6 className="title">Account</h6>
          <p className="text">
            You've reached your maximum cancellation limit, cannot cancel
            appointment. Please contact support
          </p>
        </ModalDialog>
      )}
    </>
  );
};
export default withRouter(DoctorAppointmentsCard);
