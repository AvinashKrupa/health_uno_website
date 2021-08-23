import {Col, Row} from "react-bootstrap";
import React from "react";
import ReportCard from "../../components/ReportCard";

const Reports = (props) => {
    return (
        <div>
            <Row>
                <Col lg="1" sm="1" xs='1'/>
                <Col lg="10" sm="10" xs='10'>
                    <Row className='back-navigation'>
                        <div style={{
                            backgroundColor: '',
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <div style={{cursor: 'pointer'}}>
                                <i onClick={() => props.history.goBack()} class="fas fa-arrow-left"></i>
                                <span style={{marginLeft: 10}}>Reports</span>
                            </div>
                        </div>
                    </Row>
                    <Row style={{marginTop: "32px",}}>
                        <Col>
                            <ReportCard/>
                        </Col>
                        <Col>
                            <ReportCard/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: "32px",}}>
                        <Col>
                            <ReportCard/>
                        </Col>
                        <Col/>
                    </Row>
                </Col>
                <Col lg="1" sm="1" xs='1'/>
            </Row>
        </div>
    );
};

export default Reports;
