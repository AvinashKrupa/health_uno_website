import Input from "../../../commonComponent/Input";
import TextArea from "../../../commonComponent/TextArea";
import { Col, Image, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { API, get, post } from "../../../api/config/APIController";
import { useToasts } from "react-toast-notifications";
import CustomButton from "../../../commonComponent/Button";
import Spinner from "../../../commonComponent/Spinner";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
import { getData, storeData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import MultiSelect from "../../../commonComponent/MultiSelect/MultiSelect";
import InputWithDropdown from "../../../commonComponent/InputWithDropdown";
import moment from "moment";
import Dropzone from 'react-dropzone';
import { upload } from "../../../constants/PatientImages";
import SignatureCanvas from 'react-signature-canvas';
import Constants from "../../../constants";
import axios from "axios";

const DoctorEditProfile = (props) => {
  // Get state and language from server

  const [showLoader, setShowLoader] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [experience, setExperience] = useState(1);
  const [loader, setLoader] = useState(false);
  const [dataLanguage, setDataLanguage] = useState([]);
  const [language, setLanguage] = useState([]);
  const relationTypes = ["S/o", "W/o", "D/o"];
  const [relationType, setRelationType] = useState("");
  const [relativeName, setRelativeName] = useState("");
  const [medicalCertificateUrl, setMedicalCertificateUrl] = useState("");
  const [medicalCertificate, setMedicalCertificate] = useState("");
  const [signature, setSignature] = useState("");
  const [signPad, setSignPad] = useState({});  
  const [signatureDataURL,setSignatureDataURL] = useState('');
  const [medicalCertError, setMedicalCertError] = useState(false);
  const [medicalCertFiles, setMedicalCertFiles] = useState([]);
  const [signatureError, setSignatureError] = useState(false);
  const [isUploadSignature, setIsUploadSignature] = useState(false);
  const [isDigitalSignature, setIsDigitalSignature] = useState(false);
  const [signatureFiles, setSignatureFiles] = useState([]);

  useEffect(() => {
    getUserProfile();
    getState();
    getLanguage();
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [dataState, setDataState] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const { addToast } = useToasts();

  const setLanguageValue = (e) => {
    const value = e.target.value;
    setLanguage(value);
  };

  const getStateValue = (value) => {
    if (value) {
      const selectedState = dataState.find((state) => state.value === value);
      return selectedState ? `${selectedState.id}|${selectedState.value}` : "";
    } else {
      return "";
    }
  };

  // Get language from server
  function getLanguage() {
    get(API.GETLANGUAGE)
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: info.name, id: info._id };
          });
          setDataLanguage(data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.data.message, { appearance: "error" });
      });
  }

  const getCityValue = (value) => {
    if (value) {
      const selectedCity = dataCity.find((city) => city.value === value);
      return selectedCity ? `${selectedCity.id}|${selectedCity.value}` : "";
    } else {
      return "";
    }
  };

  function getUserProfile() {
    get(API.GET_PROFILE)
      .then((response) => {
        if (response.status === 200) {
          let user = response.data.data.user;
          const additional_info = response.data.data["additional_info"];
          if (user) {
            storeData("userInfo", JSON.stringify(user));
          }
          if (additional_info) {
            storeData("additional_info", JSON.stringify(additional_info));
          }
          const selectedLanguage = user.language.map(
            (language) => language._id
          );
          let additionalInfo = response.data.data.additional_info;
          setFirstName(user.first_name);
          setLastName(user.last_name);
          setEmail(user.email);
          setGender(user.gender);
          setDescription(additionalInfo.desc);
          setMobile(user.mobile_number);
          setBirthDate(user.dob);
          setRelativeName(additionalInfo.relative_name);
          setRelationType(additionalInfo.relation);
          setAddressLine1(additionalInfo.address.line1);
          setAddressLine2(additionalInfo.address.line2);
          setState(additionalInfo.address.state);
          setCity(additionalInfo.address.city);
          setCountry(additionalInfo.address.country);
          setExperience(additionalInfo.qualif.exp);
          setLanguage(selectedLanguage);
          setSignatureDataURL(additional_info.digital_signature_url);
          setMedicalCertificateUrl(additional_info.medical_cert_url);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  // Edit Profile
  function updateUserProfile() {
    let params = {
      first_name: firstName,
      last_name: lastName,
      desc: description,
      type: "2",
      ...(props.profilePic && { dp: props.profilePic && props.profilePic }),
      address: {
        line1: addressLine1,
        line2: addressLine2,
        state: state,
        city: city,
        country: country,
      },
      language: language,
      qualif: {
        exp: Number(experience),
      },
      relative_name: relativeName,
      relation: relationType,
    };
    setShowLoader(true);

    const formData = new FormData();
    formData.append('medical_cert_file',medicalCertificate);
    formData.append('digital_signature_file',signature);
    formData.append('user_data',JSON.stringify(params));

    const token = getData("ACCESS_TOKEN");
    
    return new Promise(async (resolve, reject) => {
      axios({
        method: "post",
        url: Constants.BASE_URL + API.UPDATE_PROFILE,
        data: formData,
        headers: { Authorization: "Bearer " + token },
      })
        .then((response) => {
          if (response.status === 200) {
            setShowLoader(false);
            addToast(response.data.message, { appearance: "success" });
          } else {
            setShowLoader(false);
            addToast(response.data.message, { appearance: "error" });
          }
          props.setReloadSideColumn(true);
        })
        .catch((error) => {
          setShowLoader(false);
          addToast(error.response.data.message, { appearance: "error" });
        });
    });
    /*
    post(API.UPDATE_PROFILE, params, true)
      .then((response) => {
        if (response.status === 200) {
          setShowLoader(false);
          addToast(response.data.message, { appearance: "success" });
        } else {
          setShowLoader(false);
          addToast(response.data.message, { appearance: "error" });
        }
        props.setReloadSideColumn(true);
      })
      .catch((error) => {
        setShowLoader(false);
        addToast(error.response.data.message, { appearance: "error" });
      });
    */
  }

  const setIdAndState = (value) => {
    const stateInfo = value.split("|");
    getCity(stateInfo[0]);
    setState(stateInfo[1]);
    stateInfo[1] === "Select state" && setCity("Select city");
  };

  const setCityValue = (value, id) => {
    const cityInfo = value.split("|");
    setCity(cityInfo[1]);
  };

  // Get city from server
  function getCity(id) {
    setLoader(true);
    post(API.GETCITY, { countryId: 101, stateId: parseInt(id) })
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: info.name, id: info.id };
          });
          setLoader(false);
          setDataCity(data);
          setCity("Select city");
        } else {
          setLoader(false);
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        setLoader(false);
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  // Get state from server
  function getState() {
    post(API.GETSTATE, { countryId: 101 })
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return { value: info.name, id: info.id };
          });
          setDataState(data);
        } else {
          addToast(response.data.message, { appearance: "error" });
        }
      })
      .catch((error) => {
        addToast(error.response.data.message, { appearance: "error" });
      });
  }

  const setSignatureType = (value) => {
    
    if(value == 'digital'){
      setIsDigitalSignature(true)
      setIsUploadSignature(false)
    }else{
      setIsUploadSignature(true)
      setIsDigitalSignature(false)
    }
  }

  function dataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

  const saveSignature = () => {
    if(signPad.isEmpty()){
      addToast("Please create digital signature.", { appearance: 'error' });
    }else{      
      setSignatureDataURL(signPad.getTrimmedCanvas().toDataURL('image/png'));
      setSignature(dataURIToBlob(signPad.getTrimmedCanvas().toDataURL('image/png')));
    }     
  }

  const clearSignature = () => {
    signPad.clear();
    setSignatureDataURL('');
    setSignatureFiles([]);
    setSignature("");
  }

  const resetSignature = () => {
    setSignatureFiles([]);
    setSignature("");
    setSignatureDataURL('');
    setSignPad({});
    setIsUploadSignature(false)
    setIsDigitalSignature(false)
  }


  return (
    <div className="form-wizard edit-doctor-container">
      <Row>
        <Row>
          <h2 style={{ marginLeft: 0 }} className="sub-title">
            Edit Profile
          </h2>
        </Row>
        {/* <Col md className="registration-page-1-column">
          <Input
            label="First Name"
            type="text"
            placeholder="eg John"
            maxLength="20"
            value={firstName}
            onChange={setFirstName}
          />
        </Col>
        <Col md className="registration-page-1-column">
          <Input
            label="Last Name"
            type="text"
            placeholder="eg Doe"
            maxLength="20"
            value={lastName}
            onChange={setLastName}
          />
        </Col> */}
        <Col className="registration-page-1-column" md>
          <Row>
            <Col md>
              <Input
                label="First Name"
                type="text"
                placeholder="eg John"
                maxLength="20"
                value={firstName}
                onChange={setFirstName}
              />
            </Col>
            <Col md>
              <Input
                label="Last Name"
                type="text"
                placeholder="eg Doe"
                maxLength="20"
                value={lastName}
                onChange={setLastName}
              />
            </Col>
          </Row>
        </Col>
        <Col className="registration-page-1-column" md>
          <InputWithDropdown
            type="text"
            placeholder="Enter Name"
            id="relativeName"
            label="Relative Name"
            maxLength="20"
            value={relativeName}
            selectedValue={relationType}
            onChange={setRelativeName}
            options={relationTypes}
            optionChange={setRelationType}
          />
        </Col>
      </Row>
      <Row>
        <Col md>
          <Input
            label="Mobile Number"
            type="number"
            readonly={true}
            value={mobile}
            onChange={setMobile}
          />
        </Col>
        <Col md>
          <Input
            label="Email"
            type="email"
            readonly={true}
            value={email}
            onChange={setEmail}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Input
            label="Date of Birth"
            type="date"
            readonly={true}
            onChange={setBirthDate}
            value={birthDate}
          />
        </Col>
        <Col md>
          <Input readonly={true} label="Gender" value={gender} id="gender" />
        </Col>
      </Row>
      <Row className="form-wizard-text-area">
        <Col>
          <TextArea
            label="Profile Description"
            type="textarea"
            row="3"
            value={description}
            placeholder="Write here"
            onChange={setDescription}
          />
        </Col>
      </Row>

      <Row>
        <Col md>
          <Input
            type="text"
            placeholder="Enter address"
            id="addressLine1"
            label="Address Line 1"
            value={addressLine1}
            onChange={setAddressLine1}
          />
        </Col>
        <Col md>
          <Input
            type="text"
            placeholder="Enter address (optional)"
            id="addressLine2"
            label="Address Line 2"
            value={addressLine2}
            onChange={setAddressLine2}
          />
        </Col>
      </Row>
      <Row className="g-2">
        <Col md>
          <Input
            value={country}
            type="text"
            placeholder="India"
            id="country"
            label="Country"
          />
        </Col>
        <Col md>
          <Row className="g-2">
            <Col md>
              <KeyValueSelector
                defaultValue={state}
                value={getStateValue(state)}
                disabled={true}
                label="State"
                id="state"
                options={dataState}
                handleSelect={setIdAndState}
              />
            </Col>
            <Col md style={{ position: "relative" }}>
              {loader && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 6,
                    top: "60px",
                    left: "60px",
                  }}
                >
                  <Spinner showLoader={loader} width={40} height={40} />
                </div>
              )}
              <KeyValueSelector
                defaultValue={city}
                id="city"
                value={getCityValue(city)}
                options={dataCity}
                handleSelect={setCityValue}
                label="City"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="g-2">
        <MultiSelect
          label="Language"
          className="languageSelection"
          selected={language}
          options={dataLanguage}
          handleChange={setLanguageValue}
        />

        <Col md>
          <Input
            type="text"
            placeholder="Enter Your Experience"
            id="experienceField"
            label="Experience"
            value={experience}
            pattern="[0-9]*"
            onChange={(value) => {
              setExperience(value.replace(/\D/, "").slice(0, 2));
            }}
          />
        </Col>
        <Col md></Col>
      </Row>
      <Row>          
        <Col>
          <br/>
          <label className="form-label">Upload Medical Certificate</label>
          <div className="upload-file" style={{marginTop: 0}}>
            {medicalCertFiles.map((fileName) => (
              <div className="uploaded" key={fileName.name}>
                <div>
                  <p className="file-name" key={fileName}>
                    {fileName.name}{" "}
                  </p>
                  <p>{moment(fileName.lastModifiedDate).format("ll")}</p>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => {
                  setMedicalCertFiles([]);
                  setMedicalCertificate("");
                  }}>
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
            <div className="note" style={{ color: "red", fontSize: "18px" }}>
              Please upload single report file
            </div>
          )}
          {
            medicalCertificateUrl
              ? <div className="text-center"><a target="_blank" className="text-primary" href={medicalCertificateUrl}>Preview</a></div>
              : null
          }
        </Col>
        <Col>
          <div>
            <br/>
            Add Signature
          </div>
          {
            !isUploadSignature && !isDigitalSignature && 
            <>
              <div className="text-center">
                <br/>
                <button className="btn btn-primary btn-sm" onClick={ () => setSignatureType('digital')}>Digital Signature</button>
                &nbsp;&nbsp;
                <button className="btn btn-primary btn-sm" onClick={ () => setSignatureType('upload')}>Upload Signature</button>
              </div>
            </>
          }
          {
            isUploadSignature && <>
              <div className="upload-file" style={{marginTop: 0}}>
                {signatureFiles.map((fileName) => (
                  <div className="uploaded" key={fileName.name}>
                    <div>
                      <p className="file-name" key={fileName}>
                        {fileName.name}{" "}
                      </p>
                      <p>{moment(fileName.lastModifiedDate).format("ll")}</p>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => {
                      setSignatureFiles([]);
                      setSignature("");
                      }}>
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
                    setSignature(acceptedFiles[0])
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
                <div className="note" style={{ color: "red", fontSize: "18px" }}>
                  Please upload single signature file
                </div>
              )}
              <button className="btn btn-danger btn-sm" onClick={ () => resetSignature()}>Reset</button> 
            </>
          }
          {
            isDigitalSignature && 
            <div>
              <SignatureCanvas penColor='black' canvasProps={{className: 'sigCanvas'}} 
              ref={ (ref) => { setSignPad(ref) }  }
              />   
              <div className="note">
                Please create your digital signature
              </div>
              {signatureError && (
                <div className="note" style={{ color: "red", fontSize: "18px" }}>
                  Please create you digital signature
                </div>
              )}
              <button className="btn btn-primary btn-sm" onClick={ () => saveSignature()}>Save</button> 
              &nbsp;&nbsp;                         
              <button className="btn btn-warning btn-sm" onClick={ () => clearSignature()}>Clear</button>  
              &nbsp;&nbsp;                         
              <button className="btn btn-danger btn-sm" onClick={ () => resetSignature()}>Reset</button>                          
            </div>
          }
          {
            signatureDataURL
              ? <div className="signatureContainer"><img width="200" className="img" src={signatureDataURL} /></div>
              : null
          }
        </Col>
      </Row>
      <Col className="form-btn">
        {showLoader && (
          <CustomButton
            className="multistepform-button edit-profile-update-button"
            disabled
            onClick={updateUserProfile}
            importantStyle={{ backgroundColor: "#e2e9e9" }}
            showLoader={showLoader}
          ></CustomButton>
        )}
        {!showLoader && (
          <CustomButton
            className="multistepform-button edit-profile-update-button"
            onClick={updateUserProfile}
            text={"Update"}
          ></CustomButton>
        )}
      </Col>
    </div>
  );
};
export default DoctorEditProfile;
