import {Button} from "react-bootstrap";
import React from "react";
import moment from "moment";

const ReportCard = (props) => {
    return (
        <>
            <div className="report-container">
                <div style={{flexDirection: "row"}}>
                    <div className="report-name">{props.report.title || props.report.name}</div>
                    <div className="report-date-info">{moment(props.report?.updated_at || props.report?.created_at).format('DD MMM YY, hh:mm a')}</div>
                </div>
                <div style={{flexDirection: "column"}}>
                    <Button className="report-view-button"
                            onClick={() => {
                                props.history.push({
                                    pathname: '/doctor/view_report',
                                    state: { url: props.report.url }
                                });
                            }}
                    >View</Button>
                </div>
            </div>
        </>
    );
};
export default ReportCard;
