import { Row, Col } from "react-bootstrap";
import Input from "../../../commonComponent/Input";
import {API, get} from '../../../api/config/APIController';
import { useToasts } from "react-toast-notifications";
import { useEffect, useState } from "react";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";

const DocRegistrationPage2 = (props) => {

  // Get departments, specializations and qualifications from server
  useEffect(() => {
    getDepartment();
    getSpecialization();
    getQualification();
    return () => {};  
  }, []);

  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [qualifications, setQualifications] = useState([]);

  const {councilRegistrationNo, dateOfRegistration, dateOfRenewal,fee, setDepartment,
    setCouncilRegistrationNo, setDateOfRegistration, setDateOfRenewal,
    setSpecialization, setQualification, setFee} = props;

  const { addToast } = useToasts();

  const setDepartmentValue = (value) => {
    const departmentInfo = value.split('|');
    setDepartment(departmentInfo[0]);
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
        console.log('error: ', error);
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
                defaultValue="Select department"
                options={departments}
                handleSelect={setDepartmentValue}
              />
            </Col>
            <Col>
              <Input
                label="Medical Council Registration Number"
                placeholder="9876503210"
                type="number"
                value={councilRegistrationNo}
                onChange={setCouncilRegistrationNo}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Input
               label="Date of Registration"
               type="date"
               value={dateOfRegistration}
               onChange={setDateOfRegistration}
              />
            </Col>
            <Col>
              <Input
               label="Date of Renewal"
               type="date"
               value={dateOfRenewal}
               onChange={setDateOfRenewal}
              />
            </Col>
          </Row>

          <Row>
            <Col>
            <KeyValueSelector
                label="Specialization"
                id="specialization"
                defaultValue="Select specialization"
                options={specializations}
                handleSelect={setSpecializationValue}
              />
            </Col>
            <Col>
              <KeyValueSelector
                label="Highest Qualification"
                id="qualification"
                defaultValue="Select qualification"
                options={qualifications}
                handleSelect={setQualificationValue}
              />
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col>
              <Input
                label="Consulting Fee"
                placeholder="120 per hour"
                type="text"
                value={fee}
                onChange={setFee}
              />
            </Col>
          </Row>
        </Col>
        <Col lg='3'></Col>
      </Row>
    </>
  );
};
export default DocRegistrationPage2;