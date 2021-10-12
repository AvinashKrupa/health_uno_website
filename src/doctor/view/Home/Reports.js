import {Col, InputGroup, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import ReportCard from "../../components/ReportCard";
import {back_icon} from "../../../constants/DoctorImages";
import {API, post} from "../../../api/config/APIController";
import {useToasts} from "react-toast-notifications";

const Reports = (props) => {
    const [prescriptionsSelected, setPrescriptionsSelected] = useState(true);
    const [investigationsSelected, setInvestigationsSelected] = useState(false);
  
    const handleInvestigationsClick = () => {
      setPrescriptionsSelected(false);
      setInvestigationsSelected(true);
    };
  
    const handlePrescriptionsClick = () => {
      setPrescriptionsSelected(true);
      setInvestigationsSelected(false);
    };

    useEffect(() => {
        getInvestigationsReports(props.match.params.patient_id);
        getPrescriptionsReports(props.match.params.patient_id);
        return () => {
        };
    }, []);


    const {addToast} = useToasts();
    const [investigationsReports, setInvestigationsReports] = useState([]);
    const [prescriptionReports, setPrescriptionReports] = useState([]);

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

    function getPrescriptionsReports(patient_id) {
        let params = {
            patient_id: patient_id
        }
        post(API.GET_PRESCRIPTIONS_FOR_DOCTOR, params)
            .then(response => {
                if (response.status === 200 && response.data && response.data.data) {
                    setPrescriptionReports(response.data.data)
                } else {
                    addToast(response.data.message, {appearance: 'error'});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: 'error'});
            });
    }

    return (
        <>
      <Row>
        <Col className="report-page-left-navbar" />
        <Col className="report-page-content-container">
          <Row className='back-navigation'>
                         <div className="back-nav-container-dr">
                           <img src={back_icon} alt='back_icon-img' onClick={() => props.history.goBack()}></img>
                           <span>Reports</span>
                       </div>
                     </Row>
          <Row
            className="report-page-card-container"
            style={{ marginTop: "43px" }}
          >
            <Row
              style={{ marginTop: "28px", marginLeft: "32px" }}
              className="padding-0"
            >
              <Col className="padding-0">
                <span
                  className={
                    prescriptionsSelected
                      ? "report-page-text-type-selected"
                      : "report-page-text-type-unselected"
                  }
                  onClick={handlePrescriptionsClick}
                >
                  Prescriptions
                </span>
                <span
                  className={
                    investigationsSelected
                      ? "report-page-text-type-selected"
                      : "report-page-text-type-unselected"
                  }
                  style={{ marginLeft: "16px" }}
                  onClick={handleInvestigationsClick}
                >
                  Investigations
                </span>
              </Col>
              <Col className="padding-0">
              </Col>
            </Row>
            {prescriptionsSelected ? (
              <Row>
                <InputGroup>
                  {prescriptionReports && prescriptionReports.map((report) => {
                    return( <ReportCard report={report} history={props.history}/>);
                  })}
                  {!prescriptionReports.length &&
                  <div className="empty-list-container_center">
                    <h4>No prescriptions found</h4>
                  </div>
                  }
                </InputGroup>
              </Row>
            ) : null}
            {investigationsSelected ? (
              <Row>
                <InputGroup>
                 {investigationsReports && investigationsReports.map((report) => {
                      return( <ReportCard report={report} history={props.history}/>);
                  })}
                  {!investigationsReports.length &&
                  <div className="empty-list-container_center">
                    <h4>No reports found</h4>
                  </div>
                  }
                </InputGroup>
              </Row>
            ) : null}
          </Row>
        </Col>
      </Row>
    </>
    );
};

export default Reports;
