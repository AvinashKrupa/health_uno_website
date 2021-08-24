import {Col, Row} from "react-bootstrap";
import React from "react";
import ReportCard from "../../components/ReportCard";
import {back_icon} from "../../../constants/DoctorImages";

const Reports = (props) => {
    return (
        <div>
            <Row>
                <Col lg="1" sm="1" xs='1'/>
                <Col lg="10" sm="10" xs='10'>
                    <Row className='back-navigation'>
                        <div className="back-nav-container">
                            <img src={back_icon} alt='back_icon-img' onClick={()=>props.history.goBack()}></img>
                            <span>Reports</span>
                        </div>
                    </Row>
                    <Row style={{marginTop: "32px",}}>
                        <Col className="report-cards-container">
                            <ReportCard/>
                            <ReportCard/>
                            <ReportCard/>
                            <ReportCard/>
                            <ReportCard/>
                        </Col>
                    </Row>
                </Col>
                <Col lg="1" sm="1" xs='1'/>
            </Row>
        </div>
    );
};

export default Reports;
