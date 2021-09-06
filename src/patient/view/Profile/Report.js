import ReportCard from "./ReportCard";
import { Row, Col, Image, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { API, post } from "../../../api/config/APIController";
import { getData } from "../../../storage/LocalStorage/LocalAsyncStorage";
const Report = () => {

  useEffect(() => {
    getPrescriptionsReports();
    return () => {};
  }, []);

  const { addToast } = useToasts();
  const [prescriptionsReports, setPrescriptionsReports] = useState([]);

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


 

function getPrescriptionsReports() {
    const userInfo = JSON.parse(getData('userInfo'));

    let params = {
      // patient_id: userInfo._id,
    }

    if(userInfo) {
      post(API.GETREPORTS, params)
      .then(response => {
        if (response.status === 200 && response.data && response.data.data) {
          console.log('response.data: ', response.data);
          setPrescriptionsReports(response.data.data)
        } else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast(error.response.data.message, { appearance: 'error' });
      });
    }
  }


  return (
    <>
      <Row>
        <Col className="report-page-left-navbar" />
        <Col className="report-page-content-container">
          <Row style={{ marginTop: "32px" }}>
            <span className="report-page-text-heading">
              Report
            </span>
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
                  {prescriptionsReports && prescriptionsReports.map((report) => {
                      return( <ReportCard report={report}/>);
                  })}
                </InputGroup>
              </Row>
            ) : null}
            {investigationsSelected ? (
              <Row>
                <InputGroup>
                  {/* <ReportCard title="Investigations" />
                  <ReportCard title="Investigations" />
                  <ReportCard title="Investigations" />
                  <ReportCard title="Investigations" />
                  <ReportCard title="Investigations" />
                  <ReportCard title="Investigations" /> */}
                </InputGroup>
              </Row>
            ) : null}
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default Report;