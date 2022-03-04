import { Row, Col, Form } from "react-bootstrap";
import Input from "../../../commonComponent/Input";
import {API, get} from '../../../api/config/APIController';
import { useToasts } from "react-toast-notifications";
import { useEffect, useState } from "react";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
import moment from "moment";

const DocRegistrationPage2 = (props) => {

  // Get departments, specializations and qualifications from server
  useEffect(() => {
    getDepartment();
    getSpecialization();
    getQualification();
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [qualifications, setQualifications] = useState([]);

  const {councilRegistrationNo, department, specialization, qualification, dateOfRegistration, dateOfRenewal,fee, setDepartment,
    setCouncilRegistrationNo, setDateOfRegistration, setDateOfRenewal,
    setSpecialization, setQualification, setFee, setMedicalCertificate, setSignature} = props;

  const { addToast } = useToasts();

  const setDepartmentValue = (value) => {
    const departmentInfo = value.split('|');
    setDepartment(departmentInfo[0]);
  }

  const getDepartmentValue = value => {
    if(value){
      const selectedDepartment = departments.find(department => department.id === value)
      return selectedDepartment ? `${selectedDepartment.id}|${selectedDepartment.value}` : ''
    }else{
      return ''
    }
  }

  const getSpecializationValue = value => {
    if(value){
      const selectedSpecialization = specializations.find(specialization => specialization.id === value)
      return selectedSpecialization ? `${selectedSpecialization.id}|${selectedSpecialization.value}` : ''
    }else{
      return ''
    }
  }

  const getQualificationValue = value => {
    if(value){
      const selectedQualification = qualifications.find(qualification => qualification.id === value)
      return selectedQualification ? `${selectedQualification.id}|${selectedQualification.value}` : ''
    }else{
      return ''
    }
  }

  const setSpecializationValue = (value) => {
    const specializationInfo = value.split('|');
    setSpecialization(specializationInfo[0]);
  }

  const setQualificationValue = (value) => {
    const specializationInfo = value.split('|');
    setQualification(specializationInfo[0]);
  }

  // Get department from server
  function getDepartment() {
    get(API.GETDEPARTMENTS)
      .then(response => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return {value: info.title, id: info._id};
          });
          setDepartments(data);
        } else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast(error.response.data.message, { appearance: 'error' });
      });
  }

  function getSpecialization() {
    get(API.GETSPECIALITIES)
      .then(response => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return {value: info.title, id: info._id};
          });
          setSpecializations(data);
        } else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast(error.response.data.message, { appearance: 'error' });
      });
  }

  function getQualification() {
    get(API.GETQUALIFICATIONS)
      .then(response => {
        if (response.status === 200) {
          let data = response.data.data.map((info) => {
            return {value: info.name, id: info._id};
          });
          setQualifications(data);
        } else {
          addToast(response.data.message, { appearance: 'error' });
        }
      })
      .catch(error => {
        addToast(error.response.data.message, { appearance: 'error' });
      });
  }

  return (
    <>
      <Row>
        <Col lg='3'></Col>
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
                <Form.Control type="date" value={dateOfRegistration} onChange={(e) => setDateOfRegistration(e.target.value)}
                              min={moment(new Date()).subtract(100, 'years').format('YYYY-MM-DD')}
                              max={moment(new Date()).format('YYYY-MM-DD')}/>
            </Col>
            <Col>
            <br />
                <Form.Label>Date of Renewal</Form.Label>
                <br />
                <Form.Control type="date" value={dateOfRenewal} onChange={(e) => setDateOfRenewal(e.target.value)}
                              min={moment(new Date()).format('YYYY-MM-DD')}
                              max={moment(new Date()).add(100, 'years').format('YYYY-MM-DD')}
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
                placeholder="120 per hour"
                type="text"
                value={fee}
                onChange={setFee}
              />
            </Col>
            <Col>
              <Input
                label="Upload Medical Certificate"
                type="file"
                className="form-controlß"
                onChange={setMedicalCertificate}
              />
            </Col>
          </Row>
          <Row>
            <Col> 
            </Col>
            <Col>
              Add Signature
            </Col>
          </Row>
        </Col>
        <Col lg='3'></Col>
      </Row>
    </>
  );
};
export default DocRegistrationPage2;
