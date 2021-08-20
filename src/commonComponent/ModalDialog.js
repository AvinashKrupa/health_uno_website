import React from 'react';
import { Modal } from 'react-bootstrap';
import CustomButton from '../commonComponent/Button';

function ModalDialog(props) {
  const {show, closeDialog, title, children, onSubmit, btnText} = props;
  
    return (
      <>  
        <Modal show={show}>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
            <i class="far fa-times-circle" style={{fontSize: '24px', color: 'white'}} onClick={closeDialog}></i>
          </Modal.Header>
          <Modal.Body>
            {children}
          </Modal.Body>
          <Modal.Footer>
           <button className={'card-text-close'} onClick={closeDialog}> cancel</button>
            <CustomButton onClick={onSubmit}
              text={'Confirm'}
            >
            </CustomButton>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
export default ModalDialog