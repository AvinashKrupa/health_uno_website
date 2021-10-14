import {Col, Row} from "react-bootstrap";
import {API, get} from '../../api/config/APIController';
import React, {useEffect, useState} from "react";
import {useToasts} from 'react-toast-notifications';
import "react-input-range/lib/css/index.css";

let isDefaultSet = true;

const NotificationSidebarComponent = (props) => {
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        getNotificationsList()
        return () => {
        };
    }, []);

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
                    <Row style={{marginTop: "40px"}} className='filter-close'>
            <span
                style={{
                    height: "12px",
                    width: "12px",
                    paddingLeft: "290px",
                    cursor: 'pointer'
                }}
                onClick={props.toggleSidebar}
            >
              <i class="fas fa-times"></i>
            </span>
                    </Row>
                    <Row style={{marginTop: "16px "}}>
                        <div>Amit</div>
                    </Row>

                </Col>
            </Row>
        </>
    );
};
export default NotificationSidebarComponent;
