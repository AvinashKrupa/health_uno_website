import React, {useState} from "react";
import Input from "../../../commonComponent/Input";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
import Selector from "../../../commonComponent/Select";
import TextArea from "../../../commonComponent/TextArea";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import CustomButton from '../../../commonComponent/Button';
import {back_icon} from "../../../constants/DoctorImages";


const AddPrescription = (props) => {
  let [medicineCount, setMedicineCount] = useState(1);


  function renderAddMedicineComponent() {
    return (
        <>
          <Row classNme="g-2">
            <div className="prescriptionSection">
              <Row className="choosetemp">
                <Col md><p>Prescription</p></Col>
                <Col md className="Choosetemplate"><p>Choose template</p></Col>
              </Row>


              {['radio'].map((type) => (
                  <div key={`inline-${type}`} className="">
                    <Form.Check
                        label="Brand"
                        name="Prescription"
                        type={type}
                        id={`inline-${type}-1`}
                    />
                    <Form.Check
                        label="Composition"
                        name="Prescription"
                        type={type}
                        id={`inline-${type}-2`}
                    />
                  </div>
              ))}
            </div>
          </Row>
          <Row className="g-4">
            <Col xs={12} md={4}>
              <Input
                  type="text"
                  placeholder="Enter Medicine Name"
                  id="medicine"
                  label="Medicine"
                  onChange={()=>null}
              />

              <Row className="g-3">
                <Col xs={12} md={4}>
                  <Input
                      type="text"
                      placeholder="Morning"
                      id="Morning"
                      label="Time Slots"
                      onChange={()=>null}
                  />
                </Col>
                <Col className="timeSlots" xs={12} md={4}>
                  <Input
                      type="text"
                      placeholder="After noon"
                      id="afternoon"
                      label="Time Slots"
                      onChange={()=>null}
                  />
                </Col>
                <Col className="timeSlots" xs={12} md={4}>
                  <Input
                      type="text"
                      placeholder="Night"
                      id="night"
                      label="Time Slots"
                      onChange={()=>null}
                  />
                </Col>
              </Row>


              <Row className="g-3">
                <Col xs={12} md={6}>
                  <Input
                      type="text"
                      placeholder="Morning"
                      id="Morning"
                      label="Time Slots"
                      onChange={()=>null}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <KeyValueSelector
                      value='0'
                      label="Periodicity"
                      defaultValue="Select"
                      id="Periodicity"
                      options={[]}
                  />
                </Col>
              </Row>


            </Col>


            <Col>
              <Selector
                  label="Medicine Type"
                  defaultValue="Select"
                  id="MedicineType"
                  options={[]}
              />
              <Input
                  type="date"
                  placeholder="Start Date"
                  id="mediStart Date"
                  label="Start Date"
                  onChange={()=>null}
              />
              <Input
                  type="text"
                  placeholder="Eneter text here"
                  id="mediAdd Comments"
                  label="Add Comments"
                  onChange={()=>null}
              />
            </Col>

            <Col sm={5}>
              <Card>
                <Card.Body>
                  <Row>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                      <Col sm={6}>
                        <Input
                            type="text"
                            placeholder="Enter text here"
                            id="dosage"
                            label="Dosage"
                            onChange={()=>null}
                        />
                      </Col>
                      <Col sm={6} className="dosage-container"><Selector
                          defaultValue="10 Mg"
                          id="MedicineType"
                          options={[]}
                      /></Col>
                    </div>
                  </Row>


                  {['radio'].map((type) => (
                      <div key={`inline-${type}`} className="">
                        <Form.Check
                            label="Before Food"
                            name="dosage"
                            type={type}
                            id={`inline-${type}-1`}
                        />
                        <Form.Check
                            label="After Food"
                            name="dosage"
                            type={type}
                            id={`inline-${type}-2`}
                        />
                        <Form.Check
                            label="With Food"
                            name="dosage"
                            type={type}
                            id={`inline-${type}-3`}
                        />
                        <Form.Check
                            label="Other"
                            name="dosage"
                            type={type}
                            id={`inline-${type}-4`}
                        />
                      </div>
                  ))}

                  <div className="otherdoage"><Input type="text" placeholder="Enter other details" id="other" onChange={()=>null}/>
                  </div>

                  {['checkbox'].map((type) => (
                      <div key={`inline-${type}`} className="">
                        <Form.Check
                            label="SOS"
                            name="grup"
                            type={type}
                            id={`inline-${type}-1`}
                        />
                        <Form.Check
                            label="STAT"
                            name="grup"
                            type={type}
                            id={`inline-${type}-2`}
                        />
                      </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
    )
  }

  return (
      <Row>
        <Col lg="1" sm="1" xs='1'/>
        <Col lg="10" sm="10" xs='10'>
          <Row className='back-navigation'>
            <div className="back-nav-container">
              <img src={back_icon} alt='back_icon-img' onClick={() => props.history.goBack()}></img>
              <span>Add Prescription</span>
            </div>
          </Row>
          <div className="container">
            <div className="addPrescription">
              <Row className="topsctionName">
                <Col xs={12} md={4}>
                  <Input
                      type="text"
                      placeholder="eg John"
                      id="firstName"
                      label="Patient Name"
                      readonly="true"
                  />
                </Col>
                <Col xs={12} md={4}>
                  <Input
                      type="number"
                      placeholder="35"
                      id="age"
                      label="Age"
                      readonly="true"
                  />
                </Col>

                <Col md>
                  <Row className="g-2">
                    <Col xs={12} md={6}>
                      <KeyValueSelector
                          label="Height"
                          defaultValue="Select"
                          id="Height"
                          options={[]}
                      />
                    </Col>
                    <Col xs={12} md={6}>
                      <KeyValueSelector
                          value='0'
                          label="Weight"
                          defaultValue="Select"
                          id="Weight"
                          options={[]}
                      />
                    </Col>
                  </Row>
                </Col>

              </Row>

              {[...Array(medicineCount)].map((value, index) => (
                      renderAddMedicineComponent()
                  )
              )}
              <div className="actionSave">
                <Button variant="outline-primary">Save as Template</Button>{' '}
                <Button variant="secondary" onClick={() => {
                  setMedicineCount(medicineCount + 1);
                }}
                >Add New Medicine</Button>{' '}
              </div>

              <Row className="g-2">
                <Col sm={6}>
                  <Row className="investigationscheck">
                    {['checkbox'].map((type) => (
                        <div key={`inline-${type}`} className="">
                          <Form.Check
                              label="Required Investigations"
                              type={type}
                              id={`inline-${type}-1`}
                          />
                        </div>
                    ))}


                  </Row>
                  <Row>
                    {
                      <TextArea
                          id={'Investigations'}
                          placeholder="Enter text here"
                          rows={3}
                          cols={35}
                      ></TextArea>
                    }
                  </Row>
                </Col>

                <div className="AddAnotherTest">
                  <p>+ Add Another Test</p>
                </div>

              </Row>


              <Row className="sendPrescriptionAction">
                <CustomButton text={'Send Prescription'} className="primary SendPrescription"></CustomButton>
              </Row>
            </div>
          </div>
        </Col>
        <Col lg="1" sm="1" xs='1'/>
      </Row>
  );
};
export default AddPrescription;
