import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import PDFViewer from 'mgr-pdf-viewer-react';
import { back_icon } from "../constants/DoctorImages";
import {getData} from "../storage/LocalStorage/LocalAsyncStorage";
import { API, post } from "../api/config/APIController";
import { useToasts } from "react-toast-notifications";

export const PDFViewerScreen = (props) => {
  const { addToast } = useToasts();
  if(props.location?.state?.url){
    localStorage.setItem('PDF_URL',props.location?.state?.url)
  }
  const [viewPdf, setViewPdf] = useState('');
  const [source, setSource] = useState({});
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState(0);
  const userType = JSON.parse(getData('USER_TYPE'));

  useEffect(() => {
    getPublicLink();
  },[])

  function getPublicLink() {
    let params = {
      file_url: props.location?.state?.url ? props.location?.state?.url : localStorage.getItem('PDF_URL'),
    };
    setLoading(true);

    post(API.GETPUBLICLINKFILE, params)
      .then(response => {
        setLoading(false);
        if (response.status == 200) {
          setViewPdf(response.data.data.url);
          setNumber(response.data.data.url && response.data.data.url.toLowerCase().search('pdf'))
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
      .catch(error => {
        setLoading(false);
        addToast(error.response.data.message, {
          appearance: "error",
        });
      });
  }
  return (
    <Row>
        <Col lg='1' md='2' sm='1' xs='1'></Col>
        <Col lg='10' md='9' sm='10' xs='11'>
        <button className="back-nav-container back-navigation">
                    <img src={back_icon} alt='back_icon-img' onClick={() => props.history.goBack()}></img>
                    <span>Report Preview</span>
                 </button>
            <div style={{marginTop: window.screen.availWidth > 415 ? '20px' : '80px'}} className='pdf-view'>
                <br></br>




                <div className="pdf-container">
                    {viewPdf && (
                      number > 0  ? (
                          <PDFViewer document={{
                              url: viewPdf
                          }} />
                              ) : (
                        <>
                          <Image src={viewPdf}></Image>
                        </>
                     )
                    )}
                    {!viewPdf && <>No File Available</>}
                </div>
                <div style={{textAlign: 'center', marginBottom: '50px'}}>
                 { viewPdf &&
                 <button className='report-card-button'><a href={viewPdf} >Download</a></button>  }
                </div>
            </div>
        </Col>
    </Row>
  );
};

export default PDFViewerScreen;
