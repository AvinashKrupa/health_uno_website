import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import PDFViewer from "mgr-pdf-viewer-react";
import { back_icon } from "../constants/DoctorImages";
import { API, post } from "../api/config/APIController";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

export const PDFViewerScreen = (props) => {
  const { addToast } = useToasts();
  if (props.location?.state?.url) {
    localStorage.setItem("PDF_URL", props.location?.state?.url);
  }
  const [viewPdf, setViewPdf] = useState("");
  const [viewPdfBase64, setViewPdfBase64] = useState("");
  const [source, setSource] = useState({});
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState(0);

  useEffect(() => {
    getPublicLink();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function getPublicLink() {
    let params = {
      file_url: props.location?.state?.url
        ? props.location?.state?.url
        : localStorage.getItem("PDF_URL"),
    };
    setLoading(true);

    post(API.GETPUBLICLINKFILE, params)
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          getBase64(response.data.data.url);
          setViewPdf(response.data.data.url);
          setNumber(
            response.data.data.url &&
              response.data.data.url.toLowerCase().search("pdf")
          );
          setSource({
            uri: response.data.data.url,
            cache: true,
          });
        } else {
          addToast(response.data.message, {
            appearance: "error",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        addToast(error.response.data.message, {
          appearance: "error",
        });
      });
  }

  function getBase64(url) {
    return axios
      .get(url, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        let data = Buffer.from(response.data, "binary").toString("base64");
        setViewPdfBase64(data);
      });
  }

  return (
    <Row>
      <Col lg="1" md="2" sm="1" xs="1"></Col>
      <Col lg="10" md="9" sm="10" xs="11">
        <button className="back-nav-container back-navigation">
          <img
            src={back_icon}
            alt="back_icon-img"
            onClick={() => props.history.goBack()}
          ></img>
          <span>Report Preview</span>
        </button>
        <div
          style={{
            marginTop: window.screen.availWidth > 415 ? "20px" : "80px",
          }}
          className="pdf-view"
        >
          <br></br>

          <div className="pdf-container">
            {viewPdfBase64 &&
              (number > 0 ? (
                <PDFViewer
                  document={{
                    base64: viewPdfBase64,
                  }}
                />
              ) : (
                <>
                  <Image src={viewPdf}></Image>
                </>
              ))}
            {!viewPdf && <>No File Available</>}
          </div>
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            {viewPdf && (
              <button className="report-card-button">
                <a href={viewPdf}>Download</a>
              </button>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default PDFViewerScreen;
