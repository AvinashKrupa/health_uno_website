import AnchorLink from 'react-anchor-link-smooth-scroll';
import {doctor} from "../../../constants/DoctorImages";
import {Col, Container, Image, Row} from "react-bootstrap";
import React from "react";
import ProfileButton from "../../../commonComponent/ProfileButton";
import {withRouter} from "react-router-dom";

const editProfilePictureColumn = (props) => {
    return (
        <Container className="profile-left-Column">
            <Row>
                <h2 className="profile-tile-text">Profile</h2>
            </Row>
            <Row>
                <Image src={doctor} className="profile-picture-image"/>
            </Row>
            <Row className="profile-container">
                <Col lg="10">
                    <span className="doctor-name">{props.doctorName}</span>
                </Col>
                <Col lg="10">
                    <span className="doctor-detail">+91 - {props.doctorMobile} | HealthUno Id: {props.doctorId}</span>
                </Col>
                <Row style={{cursor: 'pointer'}}>
                    <Col lg='3' sm='1' xs='1'></Col>
                    <Col lg='6'>
                        <AnchorLink href='#second-page'>
                            <ProfileButton
                                active={props.match.params.type}
                                route={'editProfile'}
                                fontText={'fa-pen'}
                                btnText={'Edit Profile'}
                                onClick={() => {
                                    props.history.push('/patient/profile/editProfile')
                                }}
                            >
                            </ProfileButton>
                        </AnchorLink>
                        <AnchorLink href='#second-page'>
                            <ProfileButton
                                active={props.match.params.type}
                                route={'uploadReport'}
                                fontText={'fa-upload'}
                                btnText={'Upload Report'}
                                onClick={() => {
                                    props.history.push('/patient/profile/uploadReport')
                                }}
                            >
                            </ProfileButton>
                        </AnchorLink>
                        <AnchorLink href='#second-page'>
                            <ProfileButton
                                active={props.match.params.type}
                                route={'support'}
                                fontText={'fa-question-circle'}
                                btnText={'Help and Support'}
                                onClick={() => {
                                    props.history.push('/patient/profile/support')
                                }}
                            >
                            </ProfileButton>
                        </AnchorLink>
                        <AnchorLink href='#second-page'>
                            <ProfileButton
                                active={props.match.params.type}
                                route={'invite'}
                                fontText={'fa-share-alt'}
                                btnText={'Refer and Invite'}
                                onClick={() => {
                                    props.history.push('/patient/profile/invite')
                                }}
                            >
                            </ProfileButton>
                        </AnchorLink>
                        <AnchorLink href='#second-page'>
                            <ProfileButton
                                active={props.match.params.type}
                                route={'about'}
                                fontText={'fa-question-circle'}
                                btnText={'About Us'}
                                onClick={() => {
                                    props.history.push('/patient/profile/about')
                                }}
                            >
                            </ProfileButton>
                        </AnchorLink>
                    </Col>
                </Row>
            </Row>
            <Row>
            </Row>
        </Container>
    );
};

export default withRouter(editProfilePictureColumn);
