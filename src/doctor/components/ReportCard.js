import {Button} from "react-bootstrap";
import React from "react";
import moment from "moment";

const ReportCard = (props) => {
    return (
        <>
            <div className="report-container">
                <div style={{flexDirection: "row"}}>
                    <div className="report-name">{props.report.title}</div>
                    <div className="report-date-info">{moment(props.report?.updated_at).format('llll')}</div>
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
