import React from 'react';
import { Modal } from 'react-bootstrap';
import {Button,} from 'react-bootstrap';

function ModalDialog(props) {
  const {show, closeDialog, title, children, onSubmit, btnText} = props;
  
    return (
      <>  
         <Modal show={show} onHide={closeDialog}>
           <span className='model-title' >{title}</span>
           <div>
           <i class="fas fa-times" onClick={closeDialog} style={{position: 'absolute', right: '21px',top: '18px'}} ></i>
           </div>
          <Modal.Body>
            {children}
            <Button variant="primary" onClick={onSubmit}>
              {btnText}
            </Button>
          </Modal.Body>
        </Modal>
      </>
    );
  }
  
export default ModalDialog