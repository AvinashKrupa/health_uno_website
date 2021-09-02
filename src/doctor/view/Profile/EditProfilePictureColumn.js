import AnchorLink from 'react-anchor-link-smooth-scroll';
import {doctor} from "../../../constants/DoctorImages";
import {Col, Container, Image, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {API, get} from "../../../api/config/APIController";
import {useToasts} from "react-toast-notifications";
import {withRouter} from 'react-router-dom'
import ProfileButton from "../../../commonComponent/ProfileButton";

const EditProfilePictureColumn = (props) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [doctorMedId, setDoctorMedId] = useState('');
    const [appointmentStats, setAppointmentStats] = useState({});
    const {addToast} = useToasts();
    useEffect(() => {
        getUserProfile()
        return () => {
        };
    }, []);

    function getUserProfile() {
        get(API.GET_PROFILE)
            .then(response => {
                if (response.status === 200) {
                    let user = response.data.data.user;
                    let additionalInfo = response.data.data.additional_info;
                    setDoctorMedId(additionalInfo.qualif.med_reg_num);
                    setFirstName(user.first_name);
                    setLastName(user.last_name);
                    setMobile(user.mobile_number);
                    setAppointmentStats(additionalInfo.appointment_stats);
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    return (
        <Container className="profile-left-Column">
            <Row>
                <h2 className="profile-tile-text">Profile</h2>
            </Row>
            <Row>
                <Image src={doctor} className="profile-picture-image"/>
            </Row>
            <Row className="profile-container">
                <Col lg="12">
                    <span className="doctor-name">{`Dr ${firstName} ${lastName}`}</span>
                </Col>
                <Col lg="12">
                    <span className="doctor-detail">+91 - {mobile} | Id: #{doctorMedId}</span>
                </Col>
                <Col lg="12">


                    <div style={{
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "space-between",
                        marginLeft: '10%',
                        marginRight: '10%'
                    }}>
                        <div className="doctor-appointment-count-container">
                            <Row className="doctor-detail-appointment">
                                <div>Completed Appointments</div>

                            </Row>
                            <Row className="doctor-detail-appointment-count">
                                <div>{appointmentStats?.completed}</div>
                            </Row>
                        </div>
                        <div className="doctor-appointment-count-container">
                            <Row className="doctor-detail-appointment">
                                <div>Scheduled Appointments</div>
                            </Row>
                            <Row className="doctor-detail-appointment-count">
                                <div>{appointmentStats?.scheduled}</div>
                            </Row>
                        </div>


                    </div>
                    {/*<div style={{*/}
                    {/*    flexDirection: "row",*/}
                    {/*    display: "flex",*/}
                    {/*    justifyContent: "space-between",*/}
                    {/*    marginLeft: '20%',*/}
                    {/*    marginRight: '20%'*/}
                    {/*}}>*/}
                    {/*    */}
                    {/*    */}
                    {/*</div>*/}

                </Col>
                <Col>
                    <Row style={{cursor: 'pointer'}}>
                        <Col className="button-section">
                            <AnchorLink href='#second-page'>
                                <ProfileButton
                                    active={props.match.params.type}
                                    route={'editProfile'}
                                    fontText={'fa-pen'}
                                    btnText={'Edit Profile'}
                                    onClick={() => {
                                        props.history.push('/doctor/profile/editProfile')
                                    }}
                                >
                                </ProfileButton>
                            </AnchorLink>
                            <AnchorLink href='#second-page'>
                                <ProfileButton
                                    active={props.match.params.type}
                                    route={'updateSchedule'}
                                    fontText={'fa-calendar'}
                                    btnText={'Update Schedule'}
                                    onClick={() => {
                                        props.history.push('/doctor/profile/updateSchedule')
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
                                        props.history.push('/doctor/profile/support')
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
                                        props.history.push('/doctor/profile/invite')
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
                                        props.history.push('/doctor/profile/about')
                                    }}
                                >
                                </ProfileButton>
                            </AnchorLink>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
            </Row>
        </Container>
    );
};

export default withRouter(EditProfilePictureColumn);
