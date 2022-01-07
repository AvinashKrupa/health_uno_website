import React from "react";
import { Modal } from "react-bootstrap";
import "../patient/styles/model.scss";
import CustomButton from "../commonComponent/Button";

function ModalDialog(props) {
  const { show, closeDialog, title, children, onSubmit,cancelBtnText, btnText, isConfirm, modalClassName, isCancelButton=true } =
    props;

  return (
    <>
      <Modal className={modalClassName} onHide={isConfirm && closeDialog} show={show}>
        {title && <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
          <i
            class="far fa-times-circle"
            style={{ fontSize: "24px", color: "white" }}
            onClick={closeDialog}
          ></i>
        </Modal.Header>}
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          {isConfirm ? (
            <CustomButton onClick={closeDialog} text={"Ok"}></CustomButton>
          ) : (
            <>
              {isCancelButton && <button className={"card-text-close"} onClick={closeDialog}>
                {" "}
               {cancelBtnText?cancelBtnText:"Cancel"} 
              </button>}
              <CustomButton onClick={onSubmit} text={btnText}></CustomButton>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalDialog;
