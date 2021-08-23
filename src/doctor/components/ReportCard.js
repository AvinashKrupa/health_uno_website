import {Button} from "react-bootstrap";
import React from "react";

const ReportCard = (props) => {
    //Todo: need to integrate with API
    return (
        <>
            <div className="report-container">
                <div style={{flexDirection: "row"}}>
                    <div className="report-name">Lungs X-ray</div>
                    <div className="report-date-info">31 July 21 , 4:10 pm</div>
                </div>
                <div style={{flexDirection: "column"}}>
                    <Button className="report-view-button">View</Button>
                </div>
            </div>
        </>
    );
};
export default ReportCard;
