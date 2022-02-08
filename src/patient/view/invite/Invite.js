import { InviteImage, copy } from "../../../constants/PatientImages";
import { Row, Col, Image, Dropdown, DropdownButton } from "react-bootstrap";
import { useState } from "react";
import CustomButton from "../../../commonComponent/Button";
import { CopyToClipboard } from "react-copy-to-clipboard";
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
    setCopyContent(e.target.value);
  };

  const shareURL = "http://onelink.to/jaysu6";

  const patientShareMessage = `I'm inviting you to use the Healthuno app. Use the Healthuno app to receive new rewards for each referral and exclusive access to the Healthuno Health Club Membership plan (Launching soon) Here's my code: ${props.huno_id}- Just enter it during registration.\nT&C apply!! \n ${window.location.origin}/refer_invite\nDownload the application now to get benefits: `;

  const docShareMessage = `Now Share the benefits of digitizing your practice with your peers. Share the Healthuno app with your colleagues and get exclusive Lifetime Free Access to Healthuno and Healthuno Prime for Physicians! Limited period Offer! Download Now! T&C Apply!! \n ${window.location.origin}/physicianReferralProgram \n`;

  const shareMessageData =
    window.location.pathname && window.location.pathname.includes("doctor")
      ? docShareMessage
      : patientShareMessage;
  const [shareMessage, setShareMessage] = useState(shareMessageData);

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
                <h2 className="content-header">
                  Invite your friends and family
                </h2>
                <p className="text">
                  Share the app with your friends and family, Refer and earn
                  exciting rewards.
                </p>
              </div>
              <div className="invite-link">
                <form>
                  <input
                    type="text"
                    value={shareURL}
                    readOnly
                    onChange={(e) => handleCopy(e)}
                  />

                  <CopyToClipboard text={shareURL}>
                    <button className="copy-button">
                      Copy Code
                      <Image className="copy" src={copy} onClick={handleCopy} />
                    </button>
                  </CopyToClipboard>
                </form>
                <div>
                  {window.location.pathname &&
                  window.location.pathname.includes("doctor") ? (
                    <DropdownButton id="dropdown-item-button" title="Share">
                      <Dropdown.Item
                        onClick={() => {
                          setShareMessage(docShareMessage);
                          setShowShare(true);
                        }}
                        as="button"
                      >
                        Refer a Doctor
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setShareMessage(patientShareMessage);
                          setShowShare(true);
                        }}
                        as="button"
                      >
                        Refer a Patient
                      </Dropdown.Item>
                    </DropdownButton>
                  ) : (
                    <CustomButton
                      text={"Share"}
                      className="share-button"
                      onClick={() => {
                        setShowShare(true);
                      }}
                    ></CustomButton>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Row>
      <ModalDialog
        onSubmit={() => setShowShare(!showShare)}
        title="Send Invitation"
        isConfirm={true}
        show={showShare}
        closeDialog={() => setShowShare(!showShare)}
      >
        {/* {window.location.pathname &&
          window.location.pathname.includes("doctor") && (
            <div key={`inline-radio`} className="mb-3">
              <InputGroup>
                <Form.Check
                  inline
                  label="would you like to refer a patient?"
                  name="group1"
                  type={"radio"}
                  id={`inline-radio-1`}
                />
                <Form.Check
                  inline
                  label="would you like to refer a doctor?"
                  name="group1"
                  type={"radio"}
                  id={`inline-radio-2`}
                />
              </InputGroup>
            </div>

            //   <InputGroup>
            //     <Form.Check
            //       type={"radio"}
            //       id={`default-radio`}
            //       label={`would you like to refer a patient?`}
            //     />

            //     <Form.Check
            //       type={"radio"}
            //       id={`default-radio1`}
            //       label={`would you like to refer a doctor?`}
            //     />
            //   </InputGroup>
            // </div>
          )} */}
        <div className="share-buttons">
          <WhatsappShareButton title={shareMessage} url={shareURL}>
            <WhatsappIcon size={50} round={true} />
          </WhatsappShareButton>
          <EmailShareButton
            title={shareMessage}
            body={shareMessage}
            url={shareURL}
          >
            <EmailIcon size={50} round={true} />
          </EmailShareButton>
          <TwitterShareButton title={shareMessage} url={shareURL}>
            <TwitterIcon size={50} round={true} />
          </TwitterShareButton>
          <FacebookShareButton
            quote={shareMessage}
            title={shareMessage}
            url={shareURL}
          >
            <FacebookIcon size={50} round={true} />
          </FacebookShareButton>
          <LinkedinShareButton
            url={shareURL}
            source={shareMessage}
            summary={shareMessage}
            title={shareMessage}
          >
            <LinkedinIcon size={50} round={true} />
          </LinkedinShareButton>
        </div>
      </ModalDialog>
    </>
  );
};

export default Invite;
