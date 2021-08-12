import React from "react";
import Sidebar from "react-sidebar";
import FilterConsultants from "../view/Home/FilterConsultants";

const TopConsultantsFilter = (props) => {

  return (
    <>
      <Sidebar
        styles={{
          sidebar: {
            width: "325px",
            background: "rgba(243, 243, 243, 1)",
            overflowY: 'none'
          },
        }}
        pullRight={true}
        sidebar={<FilterConsultants toggleSidebar={props.toggleSidebar}toggle={props.toggleSidebar} callBackFilter={props.callBackFilter} />}
        open={props.sidebarOpen}
        onSetOpen={props.toggleSidebar}
      >
        {props.children}
      </Sidebar>
    </>
  );
};

export default TopConsultantsFilter;