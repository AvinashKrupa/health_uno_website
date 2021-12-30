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

  const [copyContent, setCopyContent] = useState("http://onelink.to/jaysu6");

  const handleCopy = (e) => {
    e.preventDefault();
    setCopyContent(e.target.value)
  }

  const shareURL = 'http://onelink.to/jaysu6'

  const patientShareMessage = `I'm inviting you to use the Healthuno app. Use the Healthuno app to receive new rewards for each referral and exclusive access to the Healthuno Health Club Membership plan (Launching soon) Here's my code: ${props.huno_id}- Just enter it during registration.\nT&C apply!! \n ${window.location.origin}/refer_invite\nDownload the application now to get benefits: `

  const docShareMessage = `Now Share the benefits of digitizing your practice with your peers. Share the Healthuno app with your colleagues and get exclusive Lifetime Free Access to Healthuno and Healthuno Prime for Physicians! Limited period Offer! Download Now! T&C Apply!! \n ${window.location.origin}/physicianReferralProgram \n`;
  
  const shareMessage = window.location.pathname && window.location.pathname.includes('doctor') ? docShareMessage : patientShareMessage;

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
                  <input type="text" value={shareURL} readOnly onChange={(e) => handleCopy(e)} />

                  <CopyToClipboard text={shareURL}
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
      <ModalDialog onSubmit={()=>setShowShare(!showShare)} title="Send Invitation" isConfirm={true} show={showShare} closeDialog={() => setShowShare(!showShare)}>
        <div className="share-buttons">
          <WhatsappShareButton title={shareMessage} url={shareURL} >
            <WhatsappIcon  size={50} round={true} />
          </WhatsappShareButton>
          <EmailShareButton title={shareMessage} body={shareMessage} url={shareURL}>
            <EmailIcon size={50} round={true} />
          </EmailShareButton>
          <TwitterShareButton title={shareMessage} url={shareURL} >
            <TwitterIcon  size={50} round={true}/>
          </TwitterShareButton>
          <FacebookShareButton quote={shareMessage} title={shareMessage} url={shareURL} >
            <FacebookIcon size={50} round={true} />
          </FacebookShareButton>
          <LinkedinShareButton  url={shareURL} source={shareMessage} summary={shareMessage} title={shareMessage} >
            <LinkedinIcon size={50} round={true} />
          </LinkedinShareButton>
        </div>
      </ModalDialog>
    </>
  );
};

export default Invite;
