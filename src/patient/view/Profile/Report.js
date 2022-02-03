import ReportCard from "./ReportCard";
import { Row, Col, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { API, post } from "../../../api/config/APIController";
import { getData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import InfiniteScroll from "react-infinite-scroll-component";

const Report = (props) => {
  const [totalInvestigation, setTotalInvestigation] = useState(0);
  const [totalPrescription, setTotalPrescription] = useState(0);
  const [page, setPage] = useState(1);
  const [prescriptionPage, setPrescriptionPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getInvestigationsReports();
    getPrescriptionsReports();
    var selection = localStorage.getItem("patient-report-selection");
    if (selection === "1") {
      handleSelection();
    }
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { addToast } = useToasts();
  const [investigationsReports, setInvestigationsReports] = useState([]);
  const [prescriptionReports, setPrescriptionReports] = useState([]);

  const [prescriptionsSelected, setPrescriptionsSelected] = useState(true);
  const [investigationsSelected, setInvestigationsSelected] = useState(false);

  const handleSelection = () => {
    setPrescriptionsSelected(!prescriptionsSelected);
    setInvestigationsSelected(!investigationsSelected);
    handleSetLocalStorage(!investigationsSelected);
  };

  const handleSetLocalStorage = (value) => {
    if (value) {
      localStorage.setItem("patient-report-selection", 1);
    } else {
      localStorage.setItem("patient-report-selection", 0);
    }
  };

  function getInvestigationsReports(sortBy = "asc", isPagination = false) {
    const userInfo = JSON.parse(getData("userInfo"));

    let params = {
      // patient_id: userInfo._id,
      limit: 20,
      page: isPagination ? page : 1,
      sort_order: sortBy,
    };

    if (userInfo) {
      post(API.GETREPORTS, params)
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
  }
  const fetchMoreData = () => {
    if (totalInvestigation > investigationsReports.length) {
      getInvestigationsReports("asc", true);
    }
  };

  function getPrescriptionsReports(sortBy = "asc", isPagination = false) {
    let params = {
      limit: 20,
      page: isPagination ? page : 1,
      sort_order: sortBy,
    };
    post(API.GET_PRESCRIPTIONS, params)
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

  const handleDeleteReport = (id) => {
    let params = {
      report_id: id,
    };
    
    if (id && !isLoading) {
      setIsLoading(true);
      post(API.DELETEREPORT, params)
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(false);
            addToast(response.data.message, { appearance: "success" });
            getInvestigationsReports();
          } else {
            setIsLoading(false);
            addToast(response.data.message, { appearance: "error" });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          addToast(error.message, { appearance: "error" });
        });
    }
  };

  const fetchMorePrescriptionData = () => {
    if (totalPrescription > prescriptionReports.length) {
      getPrescriptionsReports("asc", true);
    }
  };
  return (
    <>
      <Row>
        <Col className="report-page-content-container">
          <Row style={{ marginTop: "25px" }}>
            <span className="report-page-text-heading">Reports</span>
          </Row>
          <Row
            className="report-page-card-container"
            style={{ marginTop: "15px" }}
          >
            <Row
              style={{ marginTop: "28px", marginLeft: "4px" }}
              className="padding-0"
            >
              <Col className="padding-0">
                <span
                  className={
                    prescriptionsSelected
                      ? "report-page-text-type-selected"
                      : "report-page-text-type-unselected"
                  }
                  onClick={handleSelection}
                >
                  Prescriptions
                </span>
                <span
                  className={
                    investigationsSelected
                      ? "report-page-text-type-selected"
                      : "report-page-text-type-unselected"
                  }
                  style={{ marginLeft: "50px" }}
                  onClick={handleSelection}
                >
                  Investigations
                </span>
              </Col>
              <Col className="padding-0"></Col>
            </Row>
            {prescriptionsSelected ? (
              <Row style={{ marginLeft: "-40px" }}>
                <InputGroup>
                  <InfiniteScroll
                    dataLength={prescriptionReports.length}
                    next={fetchMorePrescriptionData}
                    hasMore={true}
                    className="load-data"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      {prescriptionReports &&
                        prescriptionReports.map((report, key) => {
                          return (
                            <ReportCard
                              key={key}
                              report={report}
                              history={props.history}
                            />
                          );
                        })}
                    </div>
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
                <InputGroup style={{ marginLeft: "-23px" }}>
                  <InfiniteScroll
                    dataLength={investigationsReports.length}
                    next={fetchMoreData}
                    hasMore={true}
                    className="load-data"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                      }}
                    >
                      {investigationsReports &&
                        investigationsReports.map((report, key) => {
                          return (
                            <ReportCard
                              key={key}
                              report={report}
                              history={props.history}
                              handleDelete={handleDeleteReport}
                              isDeleted={true}
                              isLoading={isLoading}
                            />
                          );
                        })}
                    </div>
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
export default Report;
