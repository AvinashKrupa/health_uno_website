import Input from "../../../commonComponent/Input";
import Select from "../../../commonComponent/Select";
import { Row, Col, Image } from "react-bootstrap";
import { useState } from "react";
import { upload } from "../../../constants/PatientImages"
import moment from "moment";
import Dropzone from 'react-dropzone';
import { pdf } from "../../../constants/PatientImages"

const UploadReport = (props) => {

  const [reportName, setReportName] = useState("");
  const [uploadData, setUploadDate] = useState("");
  const [reportType, setReportType] = useState("");
  const [files, setFiles] = useState([]);

  let reportOptions = ["Type1", "Type2", "Type3"]

  const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  };

  const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  };

  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };

  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        {console.log(file.type, file.name)}
        <img
          src={file.type === "application/pdf" ? pdf : file.preview}
          style={img}
        />
      </div>
    </div>
  ));


  return (
    <>
      <Row>
        <Col lg="1" sm="1" xs="1" />
        <Col lg="11" md="11" sm="11" xs="10">
          <Row className="header">
            <span>Profile</span>
          </Row>
          <Row >
            <Col lg="3">
              <Image className="profile-image" src="" />
            </Col>
            <Col lg="9">
              <div className="upload-report">
                <Row className="content">
                  <Col lg="6">
                    <Input label="Report Name" type="text" placeholder="Consultation Report" value={reportName} onChange={setReportName} />
                  </Col>
                  <Col lg="6">
                    <Input label="Upload Date" type="date" placeholder="05-July-2021" value={uploadData} onChange={setUploadDate} />
                  </Col>
                </Row>
                {files.length === 0 &&
                  <div className="report-type">
                    <Select
                      label="Report Type"
                      defaultValue="Select"
                      id="report-type"
                      options={reportOptions}
                      handleSelect={setReportType}
                    />
                  </div>}

                <div className="upload-file">
                  {files.map(fileName => (
                    <div className="uploaded" key={fileName.name}>
                      <div>
                        <p className="file-name" key={fileName}>{fileName.name} </p>
                        <p>{moment(fileName.lastModifiedDate).format('ll')}</p>

                      </div>
                      <button className="view-button">Delete</button>
                    </div>))}
                  <Dropzone
                    onDrop={acceptedFiles =>

                      setFiles(acceptedFiles.map(file => Object.assign(file, {
                        preview: URL.createObjectURL(file)
                      })))}
                    accept="image/jpeg,.pdf"

                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {files.length === 0 && <div className="upload-text">
                          <Image src={upload} alt="upload" />
                          <p>Drag and Drop the files here</p>
                        </div>
                        }
                      </div>

                    )}
                  </Dropzone>

                </div>

                <div className="note">
                  Please upload report in pdf or jpeg format
                </div>
                <aside style={thumbsContainer}>
                  {thumbs}
                </aside>
                <div className="button-div">
                  <button className="upload-button " type="button">Upload</button>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default UploadReport;
