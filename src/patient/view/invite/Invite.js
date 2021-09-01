import { InviteImage ,copy } from "../../../constants/PatientImages";
import { Row, Col, Image, } from "react-bootstrap";
import { useState } from "react";
import CustomButton from '../../../commonComponent/Button';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const Invite = (props) => {

  const [copyContent,setCopyContent]=useState("http/:Healthunoapp/invite");

  const handleCopy = (e) =>{
    e.preventDefault();
    setCopyContent(e.target.value)
   }
  

  return (
    <>
      <Row>
          </Row>
          <Row>
            <Col lg="12">
             <div className="invite-user">
                <div>
                    <Image className="invite-image" src={InviteImage} />
                </div>
                <div className="content">
                    <h2 className="content-header">Invite your friends and family</h2>
                    <p className="text">Share the app with your friends and family, Refer and earn exciting rewards.</p>
                </div>
                <div className="invite-link">
                <form>
                      <input type="text"value="http/:Healthunoapp/invite" readOnly  onChange={(e)=>handleCopy(e)}/>
                     
                      <CopyToClipboard text={'http/:Healthunoapp/invite'}
                        >
                        <button className="copy-button" >
                          Copy Code
                          <Image className="copy" src={copy} onClick={handleCopy}/>
                        </button>
                      </CopyToClipboard>
                      
                    </form>
                    <div>
                      <CustomButton text={'Share'} className="share-button" onClick={() => {}}></CustomButton>
                    </div>
                </div>
             </div>
            </Col>
          </Row>
    </>
  );
};

export default Invite;
