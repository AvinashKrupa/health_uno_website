import { InviteImage, copy } from "../../../constants/PatientImages";
import { Row, Col, Image, } from "react-bootstrap";
import { useState } from "react";
import CustomButton from '../../../commonComponent/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import ModalDialog from "../../../commonComponent/ModalDialog";

const Invite = (props) => {
  const [showShare, setShowShare] = useState(false);

  const [copyContent, setCopyContent] = useState("https://healthunoapp/invite");

  const handleCopy = (e) => {
    e.preventDefault();
    setCopyContent(e.target.value)
  }


  return (
    <>
      <Row>
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
                  <input type="text" value="https://healthunoapp/invite" readOnly onChange={(e) => handleCopy(e)} />

                  <CopyToClipboard text={'https//:healthunoapp/invite'}
                  >
                    <button className="copy-button" >
                      Copy Code
                      <Image className="copy" src={copy} onClick={handleCopy} />
                    </button>
                  </CopyToClipboard>

                </form>
                <div>
                  <CustomButton text={'Share'} className="share-button" onClick={() => {
                    setShowShare(true)
                  }}></CustomButton>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Row>
      <ModalDialog onSubmit={()=>setShowShare(!showShare)} title="Send Invitation" show={showShare} closeDialog={() => setShowShare(!showShare)}>
        <div className="share-buttons">
          <WhatsappShareButton url="https://healthunoapp/invite">
            <WhatsappIcon  size={50} round={true} />
          </WhatsappShareButton>
          <EmailShareButton url="https://healthunoapp/invite" >
            <EmailIcon size={50} round={true} />
          </EmailShareButton>
          <TwitterShareButton url="https://healthunoapp/invite">
            <TwitterIcon  size={50} round={true}/>
          </TwitterShareButton>
          <FacebookShareButton url="https://healthunoapp/invite">
            <FacebookIcon size={50} round={true} />
          </FacebookShareButton>
          <LinkedinShareButton url="https://healthunoapp/invite">
            <LinkedinIcon size={50} round={true} />
          </LinkedinShareButton>
        </div>
      </ModalDialog>
    </>
  );
};

export default Invite;
