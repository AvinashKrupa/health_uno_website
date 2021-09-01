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
    display: '-webkit-inline-box',
    borderRadius: 2,
    marginBottom: 8,
    marginRight: 8,
    width: 200,
    height: 200,
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
          alt='upload-report'
        />
      </div>
    </div>
  ));


  return (
    <>
      <Row>
          </Row>
          <Row >
            <Col lg="12">
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
                      <button className="view-button" onClick={() => setFiles([])}>Delete</button>
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
                {files.length > 0 && <h4>Preview</h4>}
                <aside style={thumbsContainer}>
                  
                  {thumbs}
                </aside>
                <div className="button-div">
                  <button className="upload-button " type="button">Upload</button>
                </div>
              </div>
            </Col>
      </Row>
    </>
  );
};

export default UploadReport;
