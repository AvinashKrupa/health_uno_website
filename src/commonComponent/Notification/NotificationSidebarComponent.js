import {Col, Row} from "react-bootstrap";
import {API, get} from '../../api/config/APIController';
import React, {useEffect, useState} from "react";
import {useToasts} from 'react-toast-notifications';
import "react-input-range/lib/css/index.css";
import Notification from "./Notification";

const NotificationSidebarComponent = (props) => {
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        getNotificationsList()
        return () => {
        };
    }, []);

    useEffect(() => {
        if (props.sidebarOpen) {
            getNotificationsList()
        }
        return () => {
        };
    }, [props.sidebarOpen]);

    const {addToast} = useToasts();

    function getNotificationsList() {
        get(API.GET_NOTIFICATIONS)
            .then(response => {
                if (response.status === 200) {
                    setNotifications(response?.data?.data?.docs);
                } else {
                    addToast(response?.data?.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error?.data?.message, {appearance: 'error'});
            });
    }

    return (
        <>
            <Row className="filter_menu_continer">
                <Col style={{paddingLeft: "26px", paddingRight: "26px"}}>
                    <Row className='notification-close-button-container filter-close'>
                        <Col className="notification-container-header">Notifications</Col>
                        <Col className="notification-container-close-button" onClick={props.toggleSidebar}>
                            <i class="fas fa-times"></i>
                        </Col>
                    </Row>
                    <Row style={{
                        marginTop: "16px",
                        marginLeft: "10px",
                        marginRight: "10px",
                    }}>
                        {!notifications.length && (
                            <div className="empty-list-container">
                                <Notification item={{message: "No notification found"}}/>
                            </div>
                        )}
                        {notifications.map((notification_item) => <Notification item={notification_item}/>)}
                    </Row>

                </Col>
            </Row>
        </>
    );
};
export default NotificationSidebarComponent;
