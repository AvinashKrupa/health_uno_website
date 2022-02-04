import { Col, Row } from "react-bootstrap";
import { API, post } from "../../api/config/APIController";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import "react-input-range/lib/css/index.css";
import Notification from "./Notification";

const NotificationSidebarComponent = (props) => {
  const [notifications, setNotifications] = useState([]);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [page, setPage] = useState(1);
  useEffect(() => {
    getNotificationsList();
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (props.sidebarOpen) {
      setPage(1);
      setTimeout(() => getNotificationsList(), 0);
    }
    return () => {};
  }, [props.sidebarOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const { addToast } = useToasts();

  function getNotificationsList(isPagination = false) {
    let params = {
      limit: 10,
      page: isPagination ? page : 1,
    };
    post(API.GET_NOTIFICATIONS, params)
      .then((response) => {
        setTotalNotifications(response.data.data.total);

        if (isPagination) {
          setPage(page + 1);
          if (page > 1) {
            setNotifications([...notifications, ...response?.data?.data?.docs]);
          } else {
            setNotifications(response?.data?.data?.docs);
          }
        } else {
          setPage(2);
          setNotifications(response?.data?.data?.docs);
        }
      })
      .catch((error) => {
        addToast(error?.data?.message, { appearance: "error" });
      });
  }

  const fetchMoreData = () => {
    if (totalNotifications > notifications.length) {
      getNotificationsList(true);
    }
  };

  return (
    <>
      <Row
        id="notification-sidebar"
        className="filter_menu_continer"
        style={{ overflow: "auto", height: "100vh" }}
      >
        <Col style={{ paddingLeft: "26px", paddingRight: "26px" }}>
          <Row className="notification-close-button-container filter-close">
            <Col className="notification-container-header">Notifications</Col>
            <Col
              className="notification-container-close-button"
              onClick={props.toggleSidebar}
            >
              <i className="fas fa-times"></i>
            </Col>
          </Row>
          <Row
            style={{
              marginTop: "16px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <div>
              <InfiniteScroll
                dataLength={notifications.length}
                next={fetchMoreData}
                hasMore={true}
                className="load-data"
                // children="notification-sidebar"
                scrollableTarget="notification-sidebar"
                onScroll={(event, abc) => {
                }}
              >
                {notifications.map((notification_item, key) => (
                  <Notification key={key} item={notification_item} />
                ))}
              </InfiniteScroll>
            </div>
            {!notifications.length && (
              <div className="empty-list-container_center">
                <div className="no-notification">
                  <div>No notification found</div>
                </div>
              </div>
            )}
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default NotificationSidebarComponent;
