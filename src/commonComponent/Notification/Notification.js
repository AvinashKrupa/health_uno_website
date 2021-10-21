import React from "react";
import {timeSince} from "../../utils/utilities";

const Notification = (props) => {
  return (
    <div className="notification-container">
        <div className="notification-title">{props?.item?.title || "New notification received"}</div>
        <div className="notification-description">{props?.item?.message}</div>
        {props?.item?.updated_at && <div className="notification-time">{timeSince(props?.item?.updated_at)}</div>}
    </div>
  );
};

export default Notification;
