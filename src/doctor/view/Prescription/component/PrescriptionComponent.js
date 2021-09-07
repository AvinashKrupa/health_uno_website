import {Card, Col, Form, Row} from "react-bootstrap";
import AutoSuggestInput from "./AutoSuggestInput";
import Input from "../../../../commonComponent/Input";
import KeyValueSelector from "../../../../commonComponent/KeyValueSelector";
import SelectorForMedicine from "../../../../commonComponent/SelectorForMedicine";
import Selector from "../../../../commonComponent/Select";
import React, {useState} from "react";
import {ACTIONS} from "../AddPrescription";
import {API, get} from "../../../../api/config/APIController";
import moment from "moment";
import {DAYS_LIST, PERIODICITY_LIST} from "../constants";
const prescription_JSON = require('../../../../JSON/prescription.json');

export default function PrescriptionComponent({index, prescription, dispatch, addToast, medicineTypesList}){
    console.log('prescriptionprescription', prescription)
    const [openDialog, setOpenDialog] = React.useState(false);
    let [medicineList, setMedicineList] = useState([]);
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleProceed = () => {
        setOpenDialog(false);
        // setPrescriptionType(tempPrescriptionType)
        // setMedicineWithType([]);
        // setSelectedMedicineFromType('');
        // getMedicineType(tempPrescriptionType)
    };

    function getMedicineListWithType(name, presType = 'brand') {
        get(`${API.GET_MEDICINE}am`)
            .then(response => {
                if (response.status === 200) {
                    setMedicineList(prescription_JSON.data);
                    console.log('medicineList :', medicineList);
                } else {
                    addToast(response.data.message, {appearance: "error"});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: "error"});
            });
    }

    function onPrescriptionOptionChange(event) {
        dispatch({
            type:ACTIONS.CHANGE_PRESCRIPTION_TYPE, payload: {id: index, value:event.target.value}
        })
        handleClickOpen();
    }
    function setStartDate(date) {
        const selectedDate = `${moment(date).format('YYYY-MM-DD')}`;
        debugger
        dispatch({
            type:ACTIONS.SET_START_DATE, payload: {id: index, value:selectedDate}
        })
    }
    function setSelectedMedicineFromType(value) {
        const typeInfo = value.split('|');
        dispatch({
            type:ACTIONS.SET_MEDICINE_TYPE, payload: {id: index, value: {
                    "name": typeInfo[1],
                    "status": "active",
                    "_id": typeInfo[0]
                }}
        })
    }
    function onDosageChange(value) {
        dispatch({
            type:ACTIONS.CHANGE_DOSAGE_NAME, payload: {id: index, value:value}
        })
    }
    function onCommentChange(value) {
        dispatch({
            type:ACTIONS.CHANGE_COMMENT, payload: {id: index, value:value}
        })
    }

    function onDaysSelect(value) {
        debugger
        dispatch({
            type:ACTIONS.SET_DAYS, payload: {id: index, value:value}
        })
    }

    function onPeriodicitySelect(value) {
        debugger
        dispatch({
            type:ACTIONS.SET_PERIODITY, payload: {id: index, value:value}
        })
    }
    return(
        <>
            <Row classNme="g-2">
                <div className="prescriptionSection">
                    <Row className="choosetemp">
                        <Col md><p>Prescription</p></Col>
                        <Col md className="Choosetemplate"><p>Choose template</p></Col>
                    </Row>
                        <div key={`inline-radio`} className="">
                            <Form.Check
                                label="Brand"
                                name={`Prescription${index}`}
                                type={'radio'}
                                onChange={onPrescriptionOptionChange}
                                value="brand"
                                checked={
                                    prescription.selectedType ===
                                    "brand"
                                }
                            />
                            <Form.Check
                                label="Composition"
                                name={`Prescription${index}`}
                                type={'radio'}
                                onChange={onPrescriptionOptionChange}
                                value="composition"
                                checked={
                                    prescription.selectedType ===
                                    "composition"
                                }
                            />
                        </div>
                </div>
            </Row>
            <Row className="g-4">
                <Col xs={12} md={4}>
                    <div className="medicine-autosuggest-container">
                        <div style={{marginBottom: "8px"}}>Medicine</div>
                        {/*<AutoSuggestInput getSuggestions={getSuggestions}/>*/}
                    </div>
                    {/*<Input*/}
                    {/*    type="text"*/}
                    {/*    placeholder="Enter Medicine Name"*/}
                    {/*    id="medicine"*/}
                    {/*    label="Medicine"*/}
                    {/*    onChange={() => null}*/}
                    {/*/>*/}

                    <Row className="g-3">
                        <Col xs={12} md={4}>
                            <Input
                                type="text"
                                placeholder="Morning"
                                id="Morning"
                                label="Time Slots"
                                onChange={() => null}
                            />
                        </Col>
                        <Col className="timeSlots" xs={12} md={4}>
                            <Input
                                type="text"
                                placeholder="After noon"
                                id="afternoon"
                                label="Time Slots"
                                onChange={() => null}
                            />
                        </Col>
                        <Col className="timeSlots" xs={12} md={4}>
                            <Input
                                type="text"
                                placeholder="Night"
                                id="night"
                                label="Time Slots"
                                onChange={() => null}
                            />
                        </Col>
                    </Row>


                    <Row className="g-3">
                        <Col xs={12} md={6}>
                            <KeyValueSelector
                                value={prescription.prescriptions[0].days}
                                label="time_slots"
                                defaultValue={"1"}
                                id="Time Slots"
                                options={DAYS_LIST}
                                handleSelect={onDaysSelect}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <KeyValueSelector
                                value={prescription.prescriptions[0].periodicity}
                                label="Periodicity"
                                defaultValue={'days'}
                                id="Periodicity"
                                options={PERIODICITY_LIST}
                                handleSelect={onPeriodicitySelect}
                            />
                        </Col>
                    </Row>


                </Col>


                <Col>
                    <SelectorForMedicine
                        label="Medicine Type"
                        defaultValue="Select"
                        value={prescription.prescriptions[0].medicinetype}
                        id="MedicineType"
                        options={medicineTypesList}
                        handleSelect={setSelectedMedicineFromType}
                    />
                    <Input
                        type="date"
                        placeholder="Start Date"
                        id="mediStart Date"
                        label="Start Date"
                        onChange={setStartDate}
                        value={prescription.prescriptions[0].start_date}
                    />
                    <Input
                        type="text"
                        placeholder="Enter text here"
                        id="mediAdd Comments"
                        label="Add Comments"
                        value={prescription.prescriptions[0].add_comments}
                        onChange={onCommentChange}
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
                                            value={prescription.prescriptions[0].dosage.dosage_text}
                                            onChange={onDosageChange}
                                        />
                                    </Col>
                                    <Col sm={6} className="dosage-container"><Selector
                                        defaultValue="10 Mg"
                                        value={prescription.prescriptions[0].dosage.qty}
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

                            <div className="otherdoage"><Input type="text" placeholder="Enter other details"
                                                               id="other"
                                                               onChange={() => null}/>
                            </div>

                                <div key={`inline-checkbox`} className="">
                                    <Form.Check
                                        label="SOS"
                                        name="grup"
                                        type={'checkbox'}
                                        id={`inline-checkbox-1`}
                                    />
                                    <Form.Check
                                        label="STAT"
                                        name="grup"
                                        type={'checkbox'}
                                        id={`inline-checkbox-2`}
                                    />
                                </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
