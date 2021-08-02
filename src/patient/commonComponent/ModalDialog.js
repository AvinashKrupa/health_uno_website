import React from 'react';
import { Modal } from 'react-bootstrap';
import {Button,} from 'react-bootstrap';

function ModalDialog(props) {
  const {show, closeDialog, title, children, onSubmit, btnText} = props;
  
    return (
      <>  
        <Modal show={show} onHide={closeDialog}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {children}
          </Modal.Body>
          <Modal.Footer>
            <span></span>
            <Button variant="primary" onClick={onSubmit}>
              {btnText}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
export default ModalDialog