import React from "react";

const Notification = (props) => {
  return (
    <div className="notification-container">
        <div className="notification-title">{props?.item?.message}</div>
        <div className="notification-description">{props?.item?.message}</div>
    </div>
  );
};

export default Notification;
