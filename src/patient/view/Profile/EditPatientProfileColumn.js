import AnchorLink from "react-anchor-link-smooth-scroll";
import { useState, useEffect } from "react";
import { doctor } from "../../../constants/DoctorImages";
import { Card, Col, Container, Image, Button, Row } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import ListGroup from "react-bootstrap/ListGroup";
import React from "react";
import ProfileButton from "../../../commonComponent/ProfileButton";
import { withRouter } from "react-router-dom";
import { API, get, post } from "../../../api/config/APIController";
import {
  storeData,
  getData,
} from "../../../storage/LocalStorage/LocalAsyncStorage";
import { useToasts } from "react-toast-notifications";
import ImageUpload from "../../../commonComponent/ImageUpload/ImageUpload";
import AccordionButton from "../../../commonComponent/AccordionButton";

const EditProfilePictureColumn = (props) => {
  const [selectedMenu, setSelectedMenu] = useState("");
  useEffect(() => {
    const accessToken = getData("ACCESS_TOKEN");
    if (!accessToken) {
      props.history.push(`/`);
      return;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [image, setImage] = useState(props.img);
  const { addToast } = useToasts();
  function updateUserProfile(file) {
    let params = {
      dp: file,
    };
    post(API.UPDATE_PROFILE, params, true)
      .then((response) => {
        if (response.status === 200) {
          addToast(response.data.message, { appearance: "success" });
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
        props.setReloadSideColumn(true);
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  const handleImage = (file) => {
    setImage(file);
    updateUserProfile(file);
  };
  useEffect(() => {
    getUserProfile();
    setTimeout(() => props.setReloadSideColumn(false), 1000);
  }, [props.reloadSideColumn]); // eslint-disable-line react-hooks/exhaustive-deps

  function getUserProfile() {
    get(API.GET_PROFILE)
      .then((response) => {
        if (response.status === 200) {
          let user = response.data.data.user;
          let additionalInfo = response.data.data.additional_info;
          if (user) {
            storeData("userInfo", JSON.stringify(user));
          }
          if (additionalInfo) {
            storeData("additional_info", JSON.stringify(additionalInfo));
          }
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }
  return (
    <Container className="profile-left-Column">
      <Row>
        <h2 className="profile-tile-text">Profile</h2>
      </Row>
      <div className="profile-picture">
        <ImageUpload classname="upload-image" getImage={handleImage} />
        <Image src={image ? image : doctor} className="profile-picture-image" />
      </div>
      <Row className="profile-container">
        <Col lg="12">
          <span className="doctor-name">{props.doctorName}</span>
        </Col>
        <Col lg="12">
          <div>
            <span className="doctor-detail">+91 - {props.doctorMobile} </span>
          </div>
          <div>
            <span className="doctor-detail">
              HealthUno Id:{" "}
              <span style={{ color: "#28a3da" }}>&nbsp;{props.userId}</span>
            </span>
          </div>
        </Col>
        <Col>
          <Row style={{ cursor: "pointer" }}>
            {/*<Col lg='3' sm='1' xs='1'></Col>*/}
            <Col className="button-section">
              <AnchorLink href="#second-page">
                <ProfileButton
                  active={props.match.params.type}
                  route={"editProfile"}
                  fontText={"fa-pen"}
                  btnText={"Edit Profile"}
                  onClick={() => {
                    props.history.push("/patient/profile/editProfile");
                  }}
                ></ProfileButton>
              </AnchorLink>
              <AnchorLink href="#second-page">
                <ProfileButton
                  active={props.match.params.type}
                  route={"uploadReport"}
                  fontText={"fa-upload"}
                  btnText={"Upload Report"}
                  onClick={() => {
                    props.history.push("/patient/profile/uploadReport");
                  }}
                ></ProfileButton>
              </AnchorLink>
              <Accordion>
                <AccordionButton
                  active={props.match.params.type}
                  selectedMenu={selectedMenu}
                  eventKey="0"
                  route={"support"}
                  fontText={"fa-question-circle"}
                  btnText={"Help and Support"}
                ></AccordionButton>
                <Accordion.Collapse eventKey="0">
                  <ListGroup defaultActiveKey="#link1">
                    <ListGroup.Item
                      onClick={() => {
                        setSelectedMenu("chat");
                        props.history.push("/patient/profile/support");
                      }}
                      action
                      active={selectedMenu === "chat"}
                    >
                      Chat
                    </ListGroup.Item>
                    <ListGroup.Item
                      active={selectedMenu === "call"}
                      onClick={() => {
                        setSelectedMenu("call");
                        window.location.href = "tel:+91 8001156789";
                      }}
                      action
                    >
                      Call
                    </ListGroup.Item>
                    <ListGroup.Item
                      action
                      active={selectedMenu === "email"}
                      onClick={() => {
                        setSelectedMenu("email");
                        window.location.href = "mailto:support@healthuno.com";
                      }}
                    >
                      Email
                    </ListGroup.Item>
                  </ListGroup>
                </Accordion.Collapse>
              </Accordion>
              <AnchorLink href="#second-page">
                <ProfileButton
                  active={props.match.params.type}
                  route={"terms"}
                  fontText={"fa-file-contract"}
                  btnText={"Terms and Conditions"}
                  onClick={() => {
                    props.history.push("/patient/profile/terms");
                  }}
                ></ProfileButton>
              </AnchorLink>
              <AnchorLink href="#second-page">
                <ProfileButton
                  active={props.match.params.type}
                  route={"faq"}
                  fontText={"fa-info-circle"}
                  btnText={"FAQ"}
                  onClick={() => {
                    props.history.push("/patient/profile/faq");
                  }}
                ></ProfileButton>
              </AnchorLink>
              <AnchorLink href="#second-page">
                <ProfileButton
                  active={props.match.params.type}
                  route={"invite"}
                  fontText={"fa-share-alt"}
                  btnText={"Refer and Invite"}
                  onClick={() => {
                    props.history.push("/patient/profile/invite");
                  }}
                ></ProfileButton>
              </AnchorLink>
              <AnchorLink href="#second-page">
                <ProfileButton
                  active={props.match.params.type}
                  route={"about"}
                  fontText={"fa-question-circle"}
                  btnText={"About Us"}
                  onClick={() => {
                    props.history.push("/patient/profile/about");
                  }}
                ></ProfileButton>
              </AnchorLink>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row></Row>
    </Container>
  );
};

export default withRouter(EditProfilePictureColumn);
