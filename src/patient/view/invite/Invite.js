import { InviteImage, copy } from "../../../constants/PatientImages";
import { Row, Col, Image, } from "react-bootstrap";
import { useState } from "react";
import CustomButton from '../../../commonComponent/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  EmailShareButton,
  FacebookShareButton,
  InstapaperShareButton,
  LinkedinShareButton,
  MailruShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  InstapaperIcon,
  LinkedinIcon,
  MailruIcon,
  RedditIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import ModalDialog from "../../../commonComponent/ModalDialog";

const Invite = (props) => {
  const [showShare, setShowShare] = useState(false);

  const [copyContent, setCopyContent] = useState("http//:healthunoapp/invite");

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
                  <input type="text" value="http//:healthunoapp/invite" readOnly onChange={(e) => handleCopy(e)} />

                  <CopyToClipboard text={'http//:healthunoapp/invite'}
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
          <WhatsappShareButton url="www.google.com">
            <WhatsappIcon  size={50} round={true} />
          </WhatsappShareButton>
          <EmailShareButton url="www.google.com" >
            <EmailIcon size={50} round={true} />
          </EmailShareButton>
          <TwitterShareButton url="www.google.com">
            <TwitterIcon  size={50} round={true}/>
          </TwitterShareButton>

          <MailruShareButton url="www.google.com" >
            <MailruIcon size={50} round={true} />
          </MailruShareButton>
          <FacebookShareButton url="www.google.com">
            <FacebookIcon size={50} round={true} />
          </FacebookShareButton>
          <InstapaperShareButton url="www.google.com">
            <InstapaperIcon size={50} />
          </InstapaperShareButton>
          <LinkedinShareButton url="www.google.com">
            <LinkedinIcon size={50} round={true} />
          </LinkedinShareButton>
          <RedditShareButton url="www.google.com">
            <RedditIcon  size={50} round={true}/>
          </RedditShareButton>
          <TelegramShareButton url="www.google.com">
            <TelegramIcon  size={50} round={true}/>
          </TelegramShareButton>
        </div>
      </ModalDialog>
    </>
  );
};

export default Invite;
