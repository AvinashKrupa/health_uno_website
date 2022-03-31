import { Row, Col, Image, Form } from "react-bootstrap";
import Input from "../../../commonComponent/Input";
import { API, get } from "../../../api/config/APIController";
import { useToasts } from "react-toast-notifications";
import { useEffect, useState } from "react";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
import moment from "moment";
import Dropzone from "react-dropzone";
import { upload } from "../../../constants/PatientImages";
import SignatureCanvas from "react-signature-canvas";

const DocRegistrationPage2 = (props) => {
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [medicalCertError, setMedicalCertError] = useState(false);
  const [medicalCertFiles, setMedicalCertFiles] = useState([]);
  const [signatureError, setSignatureError] = useState(false);
  const [isUploadSignature, setIsUploadSignature] = useState(false);
  const [isDigitalSignature, setIsDigitalSignature] = useState(false);
  const [signatureFiles, setSignatureFiles] = useState([]);

  const {
    councilRegistrationNo,
    department,
    specialization,
    qualification,
    dateOfRegistration,
    dateOfRenewal,
    fee,
    medicalCertificate,
    signature,
    signPad,
    signatureDataURL,
    setDepartment,
    setCouncilRegistrationNo,
    setDateOfRegistration,
    setDateOfRenewal,
    setSpecialization,
    setQualification,
    setFee,
    setMedicalCertificate,
    setSignature,
    setSignPad,
    setSignatureDataURL,
  } = props;

  let unmounted = false;
  // Get departments, specializations and qualifications from server
  useEffect(() => {
    if (!unmounted) {
      getDepartment();
      getSpecialization();
      getQualification();

      if (medicalCertificate) {
        setMedicalCertFiles([medicalCertificate]);
      }
      if (signature) {
        if (signature?.path !== undefined) {
          setSignatureFiles([signature]);
          setIsUploadSignature(true);
          setIsDigitalSignature(false);
        } else {
          setIsUploadSignature(false);
          setIsDigitalSignature(true);
        }
      }
    }
    return () => {
      unmounted = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { addToast } = useToasts();

  const setDepartmentValue = (value) => {
    const departmentInfo = value.split("|");
    setDepartment(departmentInfo[0]);
  };

  const getDepartmentValue = (value) => {
    if (value) {
      const selectedDepartment = departments.find(
        (department) => department.id === value
      );
      return selectedDepartment
        ? `${selectedDepartment.id}|${selectedDepartment.value}`
        : "";
    } else {
      return "";
    }
  };

  const getSpecializationValue = (value) => {
    if (value) {
      const selectedSpecialization = specializations.find(
        (specialization) => specialization.id === value
      );
      return selectedSpecialization
        ? `${selectedSpecialization.id}|${selectedSpecialization.value}`
        : "";
    } else {
      return "";
    }
  };

  const getQualificationValue = (value) => {
    if (value) {
      const selectedQualification = qualifications.find(
        (qualification) => qualification.id === value
      );
      return selectedQualification
        ? `${selectedQualification.id}|${selectedQualification.value}`
        : "";
    } else {
      return "";
    }
  };

  const setSpecializationValue = (value) => {
    const specializationInfo = value.split("|");
    setSpecialization(specializationInfo[0]);
  };

  const setQualificationValue = (value) => {
    const specializationInfo = value.split("|");
    setQualification(specializationInfo[0]);
  };

  // Get department from server
  function getDepartment() {
    get(API.GETDEPARTMENTS)
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: info.title, id: info._id };
          });
          setDepartments(data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function getSpecialization() {
    get(API.GETSPECIALITIES)
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: info.title, id: info._id };
          });
          setSpecializations(data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  function getQualification() {
    get(API.GETQUALIFICATIONS)
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: info.name, id: info._id };
          });
          setQualifications(data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  const setSignatureType = (value) => {
    if (value == "digital") {
      setIsDigitalSignature(true);
      setIsUploadSignature(false);
    } else {
      setIsUploadSignature(true);
      setIsDigitalSignature(false);
    }
  };

  function dataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  const saveSignature = () => {
    if (signPad.isEmpty()) {
      addToast("Please create digital signature.", { appearance: "error" });
    } else {
      setSignatureDataURL(signPad.getTrimmedCanvas().toDataURL("image/png"));
      setSignature(
        dataURIToBlob(signPad.getTrimmedCanvas().toDataURL("image/png"))
      );
    }
  };

  const clearSignature = () => {
    signPad.clear();
    setSignatureDataURL("");
    setSignatureFiles([]);
    setSignature("");
  };

  const resetSignature = () => {
    setSignatureFiles([]);
    setSignature("");
    setSignatureDataURL("");
    setSignPad({});
    setIsUploadSignature(false);
    setIsDigitalSignature(false);
  };

  return (
    <>
      <Row>
        <Col lg="3"></Col>
        <Col>
          <Row>
            <Col>
              <KeyValueSelector
                label="Department"
                id="department"
                value={getDepartmentValue(department)}
                defaultValue="Select department"
                options={departments}
                handleSelect={setDepartmentValue}
              />
            </Col>
            <Col>
              <Input
                label="Medical Council Registration Number"
                placeholder="Type your registration Number"
                type="text"
                value={councilRegistrationNo}
                onChange={setCouncilRegistrationNo}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <br />
              <Form.Label>Date of Registration</Form.Label>
              <br />
              <Form.Control
                type="date"
                value={dateOfRegistration}
                onChange={(e) => setDateOfRegistration(e.target.value)}
                min={moment(new Date())
                  .subtract(100, "years")
                  .format("YYYY-MM-DD")}
                max={moment(new Date()).format("YYYY-MM-DD")}
              />
            </Col>
            <Col>
              <br />
              <Form.Label>Date of Renewal</Form.Label>
              <br />
              <Form.Control
                type="date"
                value={dateOfRenewal}
                onChange={(e) => setDateOfRenewal(e.target.value)}
                min={moment(new Date()).format("YYYY-MM-DD")}
                max={moment(new Date()).add(100, "years").format("YYYY-MM-DD")}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <KeyValueSelector
                label="Specialization"
                id="specialization"
                value={getSpecializationValue(specialization)}
                defaultValue="Select specialization"
                options={specializations}
                handleSelect={setSpecializationValue}
              />
            </Col>
            <Col>
              <KeyValueSelector
                label="Highest Qualification"
                value={getQualificationValue(qualification)}
                id="qualification"
                defaultValue="Select qualification"
                options={qualifications}
                handleSelect={setQualificationValue}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Input
                label="Consulting Fee"
                placeholder="120 per consultation"
                type="number"
                value={fee}
                onChange={setFee}
              />
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col>
              <br />
              <label className="form-label">Upload Medical Certificate</label>
              <div className="upload-file" style={{ marginTop: 0 }}>
                {medicalCertFiles.map((fileName) => (
                  <div className="uploaded" key={fileName.name}>
                    <div>
                      <p className="file-name" key={fileName}>
                        {fileName.name}{" "}
                      </p>
                      <p>{moment(fileName.lastModifiedDate).format("ll")}</p>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setMedicalCertFiles([]);
                        setMedicalCertificate("");
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    setMedicalCertError(false);
                    setMedicalCertFiles(
                      acceptedFiles.map((file) =>
                        Object.assign(file, {
                          preview: URL.createObjectURL(file),
                        })
                      )
                    );
                    setMedicalCertificate(acceptedFiles[0]);
                  }}
                  accept="image/jpeg,.pdf"
                  maxFiles={1}
                  onDropRejected={(fileRejections, event) => {
                    setMedicalCertError(true);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      {medicalCertFiles.length === 0 && (
                        <div className="upload-text">
                          <Image src={upload} alt="upload" />
                          <p>Drag and Drop file here</p>
                        </div>
                      )}
                    </div>
                  )}
                </Dropzone>
              </div>
              <div className="note">
                Please upload report in pdf or jpeg format
              </div>
              {medicalCertError && (
                <div
                  className="note"
                  style={{ color: "red", fontSize: "18px" }}
                >
                  Please upload single report file
                </div>
              )}
            </Col>
            <Col>
              <div>
                <br />
                Add Signature
              </div>
              {!isUploadSignature && !isDigitalSignature && (
                <>
                  <div className="text-center">
                    <br />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSignatureType("digital")}
                    >
                      Digital Signature
                    </button>
                    &nbsp;&nbsp;
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSignatureType("upload")}
                    >
                      Upload Signature
                    </button>
                  </div>
                </>
              )}
              {isUploadSignature && (
                <>
                  <div className="upload-file" style={{ marginTop: 0 }}>
                    {signatureFiles.map((fileName) => (
                      <div className="uploaded" key={fileName.name}>
                        <div>
                          <p className="file-name" key={fileName}>
                            {fileName.name}{" "}
                          </p>
                          <p>
                            {moment(fileName.lastModifiedDate).format("ll")}
                          </p>
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setSignatureFiles([]);
                            setSignature("");
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        setSignatureError(false);
                        setSignatureFiles(
                          acceptedFiles.map((file) =>
                            Object.assign(file, {
                              preview: URL.createObjectURL(file),
                            })
                          )
                        );
                        setSignature(acceptedFiles[0]);
                      }}
                      accept="image/jpeg"
                      maxFiles={1}
                      onDropRejected={(fileRejections, event) => {
                        setSignatureError(true);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          {signatureFiles.length === 0 && (
                            <div className="upload-text">
                              <Image src={upload} alt="upload" />
                              <p>Drag and Drop file here</p>
                            </div>
                          )}
                        </div>
                      )}
                    </Dropzone>
                  </div>
                  <div className="note">
                    Please upload report in jpeg format
                  </div>
                  {medicalCertError && (
                    <div
                      className="note"
                      style={{ color: "red", fontSize: "18px" }}
                    >
                      Please upload single signature file
                    </div>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => resetSignature()}
                  >
                    Reset
                  </button>
                </>
              )}
              {isDigitalSignature && (
                <div>
                  <SignatureCanvas
                    penColor="black"
                    canvasProps={{ className: "sigCanvas" }}
                    ref={(ref) => {
                      setSignPad(ref);
                    }}
                  />
                  <div className="note">
                    Please create your digital signature
                  </div>
                  {signatureError && (
                    <div
                      className="note"
                      style={{ color: "red", fontSize: "18px" }}
                    >
                      Please create you digital signature
                    </div>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => saveSignature()}
                  >
                    Save
                  </button>
                  &nbsp;&nbsp;
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => clearSignature()}
                  >
                    Clear
                  </button>
                  &nbsp;&nbsp;
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => resetSignature()}
                  >
                    Reset
                  </button>
                </div>
              )}
              {signatureDataURL ? (
                <div className="signatureContainer">
                  <img className="img" src={signatureDataURL} />
                </div>
              ) : null}
            </Col>
          </Row>
        </Col>
        <Col lg="3"></Col>
      </Row>
    </>
  );
};
export default DocRegistrationPage2;
