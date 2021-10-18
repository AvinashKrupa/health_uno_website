import React from "react";
import Sidebar from "react-sidebar";
import NotificationSidebarComponent from "./NotificationSidebarComponent";

const NotificationSideBar = (props) => {
  return (
    <>
      <Sidebar
        styles={{
          sidebar: {
            width: "325px",
            background: "rgba(255, 255, 255, 1)",
            overflowY: 'auto'
          },
          root:{
            position:'fixed',
            zIndex: 99
          }
        }}
        pullRight={true}
        sidebar={<NotificationSidebarComponent toggleSidebar={props.toggleSidebar}  sidebarOpen={props.sidebarOpen}/>}
        open={props.sidebarOpen}
        onSetOpen={props.toggleSidebar}
      >
        {props.children}
      </Sidebar>
    </>
  );
};

export default NotificationSideBar;
