import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { back_icon } from "../constants/DoctorImages";
export const PDFViewer = (props) => {
  const [viewPdf, setViewPdf] = useState(props.location?.state?.url);
  console.log('viewPdf: ', viewPdf);
  const number = viewPdf && viewPdf.toLowerCase().search('pdf');

  return (
    <Row>
        <Col lg='1' md='2' sm='1' xs='1'></Col>
        <Col lg='10' md='9' sm='10' xs='11'>
        <button className="back-nav-container back-navigation">
                    <img src={back_icon} alt='back_icon-img' onClick={() =>  props.history.goBack()}></img>
                    <span>Report Preview</span>
                 </button>
            <div style={{marginTop: window.screen.availWidth > 415 ? '20px' : '80px'}} className='pdf-view'>
                <br></br>
                <div className="pdf-container">
                    {viewPdf && (
                      number > 0  ? (
                        <iframe title='pdf'src={`http://docs.google.com/gview?url=${viewPdf}&embedded=true`} frameborder="0"
                                 style={{height: '100%', width: '500px'}}
                        ></iframe>
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

export default PDFViewer;
