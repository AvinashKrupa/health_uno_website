import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import ReportCard from "../../components/ReportCard";
import {back_icon} from "../../../constants/DoctorImages";
import {API, post} from "../../../api/config/APIController";
import {useToasts} from "react-toast-notifications";

const Reports = (props) => {
    useEffect(() => {
        getInvestigationsReports(props.match.params.patient_id);
        return () => {
        };
    }, []);


    const {addToast} = useToasts();
    const [investigationsReports, setInvestigationsReports] = useState([]);

    function getInvestigationsReports(patient_id) {
        let params = {
            patient_id: patient_id,
        }
        post(API.GET_REPORTS_FOR_DOCTOR, params)
            .then(response => {
                if (response.status === 200 && response.data && response.data.data) {
                    console.log('response.data: ', response.data);
                    setInvestigationsReports(response.data.data)
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    return (
        <div>
            <Row>
                <Col lg="1" sm="1" xs='1'/>
                <Col lg="10" sm="10" xs='10'>
                    <Row className='back-navigation'>
                        <div className="back-nav-container-dr">
                            <img src={back_icon} alt='back_icon-img' onClick={() => props.history.goBack()}></img>
                            <span>Reports</span>
                        </div>
                    </Row>
                    <Row style={{marginTop: "32px",}}>
                        <Col className="report-cards-container">
                            {investigationsReports && investigationsReports.map((report) => {
                                return( <ReportCard report={report} history={props.history}/>);
                            })}
                            {!investigationsReports.length &&
                            <div className="empty-list-container_center">
                                <h4>No reports found</h4>
                            </div>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default Reports;
