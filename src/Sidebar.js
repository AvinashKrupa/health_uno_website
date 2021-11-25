import SideNav, {NavIcon, NavItem, NavText } from '@trendmicro/react-sidenav';
import  ClickOutside  from 'react-click-outside';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import {clearSession, getData} from "./storage/LocalStorage/LocalAsyncStorage";
import { withRouter } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications';
import {API, post} from './api/config/APIController';
import React, { useState } from "react";
import GeneralTermsAndConditions from './commonComponent/GeneralTermsandConditions';
import ModalDialog from './commonComponent/ModalDialog';

const sidebar = ['home', 'appointments', 'profile', 'faq', 'reports']

const Sidebar = (props) => {
    const [expanded,setExpanded] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const userType = JSON.parse(getData('USER_TYPE'));
    const newRoutes = props.location.pathname.split("/") || [];
    let defaultSelection = "home"
    for (let i = 0; i <newRoutes.length ; i++) {
        const found = sidebar.includes(newRoutes[i])
        if(found){
            defaultSelection = newRoutes[i];
        }
    }
    const {addToast} = useToasts();

    const handleLogout = (routeName) => {
        post(API.LOGOUT)
        .then(response => {
          if (response.status === 200) {
            
            addToast(response.data.message, {appearance: 'success'});
            clearSession();
            props.history.push(`${routeName}`);
          } else {
            addToast(response.data.message, {appearance: 'error'});
          }
        })
        .catch(error => {
          addToast(error.response.data.message, {appearance: "error"});
        });
    }

    return (
        <div className="sidebarMenu">

           <ClickOutside
            onClickOutside={() => {
                setExpanded(false)
                }}
            >

            <SideNav onSelect={(selected) => {
                const userType = JSON.parse(getData('USER_TYPE'));
                let routeName = '/patient/';

                if (userType === 2) {
                    routeName = '/doctor/';
                    // if(sidebar.includes('reports')) {
                    //     return;
                    // }
                }

                if( selected === 'profile') {
                    selected = 'profile/editProfile';
                    props.history.push(`${routeName}${selected}`);
                }
                if( selected === 'faq') {
                    selected = 'faq';
                    props.history.push(`${routeName}${selected}`);
                }

                if( selected === 'signOut') {
                    handleLogout(routeName);
                }
                setExpanded(false)
                sidebar.includes(selected) && props.history.push(`${routeName}${selected}`);
            }}
            expanded={expanded}
            onToggle={(expanded) => {
                setExpanded(expanded)
            }}
            >
                <SideNav.Toggle/>
                <SideNav.Nav defaultSelected={defaultSelection}>
                    <NavItem className="setLogo">
                        <NavIcon>
                            <img alt='logo' src={process.env.PUBLIC_URL + '/assets/logo.png'}></img>
                        </NavIcon>
                        <NavText className="setLogotext">
                            HealthUno
                        </NavText>
                    </NavItem>
                    <NavItem active={defaultSelection === 'home'} eventKey="home">
                        <NavIcon>
                            <i className="fa fa-fw fa-home" style={{fontSize: '1.65em'}}/>
                        </NavIcon>
                        <NavText>
                            Home
                        </NavText>
                    </NavItem>
                    <NavItem active={defaultSelection === 'appointments'} eventKey="appointments">
                        <NavIcon>
                            <i className="fa fa-fw fa-calendar" style={{fontSize: '1.75em'}}/>
                        </NavIcon>
                        <NavText>
                            Appointments
                        </NavText>
                    </NavItem>

                    {userType === 1 && <NavItem active={defaultSelection === 'reports'} eventKey="reports">
                        <NavIcon>
                            <i className="fa fa-fw fa-briefcase" style={{fontSize: '1.75em'}}/>
                        </NavIcon>
                        <NavText>
                            Reports
                        </NavText>
                    </NavItem>}

                    <NavItem active={defaultSelection === 'profile'} eventKey="profile">
                        <NavIcon>
                            <i className="fa fa-fw fa-user" style={{fontSize: '1.75em'}}/>
                        </NavIcon>
                        <NavText>
                            Profile
                        </NavText>
                    </NavItem>
                    <NavItem active={false} onSelect={() => setModalShow(true)}>
                        <NavIcon>
                            <i className="fa fa-fw fa-file-contract" style={{fontSize: '1.75em'}}/>
                        </NavIcon>
                        <NavText>
                            Terms and Conditions
                        </NavText>
                    </NavItem>
                    <NavItem active={defaultSelection === 'faq'} eventKey="faq">
                        <NavIcon>
                            <i className="fa fa-fw fa-question-circle" style={{fontSize: '1.75em'}}/>
                        </NavIcon>
                        <NavText>
                            FAQ
                        </NavText>
                    </NavItem>
                    <NavItem active={defaultSelection === 'signOut'} eventKey="signOut">
                        <NavIcon>
                            <i className="fa fa-fw fas fa-sign-out-alt" style={{fontSize: '1.75em'}}/>
                        </NavIcon>
                        <NavText>
                            Sign Out
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
         </ClickOutside>
         <ModalDialog
          modalClassName={"terms-content"}
          isConfirm={true}
          show={modalShow}
          title={"Terms and conditions"}
          closeDialog={() => {
            setModalShow(false);
          }}
        >
          <GeneralTermsAndConditions />
        </ModalDialog>
        </div>
    );
};

export default withRouter(Sidebar);
