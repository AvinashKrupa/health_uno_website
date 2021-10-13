import { Col, InputGroup, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import ReportCard from "../../components/ReportCard";
import { back_icon } from "../../../constants/DoctorImages";
import { API, post } from "../../../api/config/APIController";
import { useToasts } from "react-toast-notifications";
import InfiniteScroll from "react-infinite-scroll-component";

const Reports = (props) => {
  const [prescriptionsSelected, setPrescriptionsSelected] = useState(true);
  const [investigationsSelected, setInvestigationsSelected] = useState(false);
  const [totalInvestigation, setTotalInvestigation] = useState(0);
  const [totalPrescription, setTotalPrescription] = useState(0);
  const [page, setPage] = useState(1);
  const [prescriptionPage, setPrescriptionPage] = useState(0);

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
    return () => {};
  }, []);

  const { addToast } = useToasts();
  const [investigationsReports, setInvestigationsReports] = useState([]);
  const [prescriptionReports, setPrescriptionReports] = useState([]);

  function getInvestigationsReports(
    patient_id,
    sortBy = "asc",
    isPagination = false
  ) {
    let params = {
      patient_id: patient_id,
      limit: 20,
      page: isPagination ? page : 1,
      sort_order: sortBy,
    };
    post(API.GET_REPORTS_FOR_DOCTOR, params)
      .then((response) => {
        if (response.status === 200 && response.data && response.data.data) {
          setTotalInvestigation(response.data.data.total);

          if (isPagination) {
            setPage(page + 1);
            if (page > 1) {
              setInvestigationsReports([
                ...investigationsReports,
                ...response.data.data.docs,
              ]);
            } else {
              setInvestigationsReports(response.data.data.docs);
            }
          } else {
            setPage(page + 1);
            setInvestigationsReports(response.data.data.docs);
          }
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }
  const fetchMoreData = () => {
    if (totalInvestigation > investigationsReports.length) {
      getInvestigationsReports(props.match.params.patient_id, "asc", true);
    }
  };
  function getPrescriptionsReports(
    patient_id,
    sortBy = "asc",
    isPagination = false
  ) {
    let params = {
      patient_id: patient_id,
      limit: 20,
      page: isPagination ? page : 1,
      sort_order: sortBy,
    };
    post(API.GET_PRESCRIPTIONS_FOR_DOCTOR, params)
      .then((response) => {
        if (response.status === 200 && response.data && response.data.data) {
          setTotalPrescription(response.data.data.total);

          if (isPagination) {
            setPrescriptionPage(prescriptionPage + 1);
            if (prescriptionPage > 1) {
              setPrescriptionReports([
                ...prescriptionReports,
                ...response.data.data.docs,
              ]);
            } else {
              setPrescriptionReports(response.data.data.docs);
            }
          } else {
            setPrescriptionPage(prescriptionPage + 1);
            setPrescriptionReports(response.data.data.docs);
          }
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }
  const fetchMorePrescriptionData = () => {
    if (totalPrescription > prescriptionReports.length) {
      getPrescriptionsReports(props.match.params.patient_id, "asc", true);
    }
  };

  return (
    <>
      <Row>
        <Col className="report-page-left-navbar" />
        <Col className="report-page-content-container">
          <Row className="back-navigation">
            <div className="back-nav-container-dr">
              <img
                src={back_icon}
                alt="back_icon-img"
                onClick={() => props.history.goBack()}
              ></img>
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
              <Col className="padding-0"></Col>
            </Row>
            {prescriptionsSelected ? (
              <Row>
                <InputGroup>
                  <InfiniteScroll
                    dataLength={prescriptionReports.length}
                    next={fetchMorePrescriptionData}
                    hasMore={true}
                    className="load-data"
                  >
                    {prescriptionReports &&
                      prescriptionReports.map((report) => {
                        return (
                          <ReportCard report={report} history={props.history} />
                        );
                      })}
                  </InfiniteScroll>
                  {!prescriptionReports.length && (
                    <div className="empty-list-container_center">
                      <h4>No prescriptions found</h4>
                    </div>
                  )}
                </InputGroup>
              </Row>
            ) : null}
            {investigationsSelected ? (
              <Row>
                <InputGroup>
                  <InfiniteScroll
                    dataLength={investigationsReports.length}
                    next={fetchMoreData}
                    hasMore={true}
                    className="load-data"
                  >
                    {investigationsReports &&
                      investigationsReports.map((report) => {
                        return (
                          <ReportCard report={report} history={props.history} />
                        );
                      })}
                  </InfiniteScroll>
                  {!investigationsReports.length && (
                    <div className="empty-list-container_center">
                      <h4>No reports found</h4>
                    </div>
                  )}
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
