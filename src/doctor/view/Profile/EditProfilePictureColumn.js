import AnchorLink from 'react-anchor-link-smooth-scroll';
import {doctor} from "../../../constants/DoctorImages";
import {Col, Container, Image, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {API, get} from "../../../api/config/APIController";
import {useToasts} from "react-toast-notifications";
import {withRouter} from 'react-router-dom'
import ProfileButton from "../../../commonComponent/ProfileButton";
import {Card} from "@material-ui/core";
import UploadImage from '../../../commonComponent/Upload';
import {storeData} from "../../../storage/LocalStorage/LocalAsyncStorage";

const EditProfilePictureColumn = (props) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobile, setMobile] = useState('');
    const [doctorMedId, setDoctorMedId] = useState('');
    const [appointmentStats, setAppointmentStats] = useState({});
    const {addToast} = useToasts();

    const[ image, setImage ]= useState();

  const handleImage = (file)=> {
     setImage(file)
     props.setProfilePic(file)
  }
    useEffect(() => {
        getUserProfile()
        return () => {
        };
    }, []);

  useEffect(() => {
        getUserProfile()
        setTimeout(()=>props.setReloadSideColumn(false),1000)
    }, [props.reloadSideColumn]);

    function getUserProfile() {
        get(API.GET_PROFILE)
            .then(response => {
                if (response.status === 200) {
                    let user = response.data.data.user;
                    let additionalInfo = response.data.data.additional_info;
                    if (user) {
                        storeData('userInfo', JSON.stringify(user));
                    }
                    setDoctorMedId(additionalInfo.qualif.med_reg_num);
                    setFirstName(user.first_name);
                    setLastName(user.last_name);
                    setMobile(user.mobile_number);
                    setImage(user.dp)
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
                <Image src={image ? image :doctor} className="profile-picture-image"/>
                <UploadImage getImage={handleImage}  className='edit-fa-camera'/>
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
                        flexDirection: "column",
                        display: "flex",
                    }}>
                        <Row className="doctor-appointment-count-title">Appointments</Row>
                        <div className="doctor-appointment-count-cards-container">
                            <div className="doctor-appointment-count-container">
                                <Card className="doctor-appointment-count-card">
                                    <div className="doctor-appointment-count-card-subcontainer">
                                        <Row className="doctor-detail-appointment">
                                            <div>Scheduled</div>
                                        </Row>
                                        <Row className="doctor-detail-appointment-count">
                                            <div>{appointmentStats?.scheduled}</div>
                                        </Row>
                                    </div>
                                </Card>
                            </div>
                            <div className="doctor-appointment-count-container">
                                <Card className="doctor-appointment-count-card">
                                    <div className="doctor-appointment-count-card-subcontainer">
                                        <Row className="doctor-detail-appointment">
                                            <div>Completed</div>
                                        </Row>
                                        <Row className="doctor-detail-appointment-count">
                                            <div>{appointmentStats?.completed}</div>
                                        </Row>
                                    </div>
                                </Card>
                            </div>


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
