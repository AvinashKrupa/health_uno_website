import {Card, Col, Form, Row} from "react-bootstrap";
import AutoSuggestInput from "./AutoSuggestInput";
import Input from "../../../../commonComponent/Input";
import KeyValueSelector from "../../../../commonComponent/KeyValueSelector";
import SelectorForMedicine from "../../../../commonComponent/SelectorForMedicine";
import Selector from "../../../../commonComponent/Select";
import React from "react";
import {ACTIONS} from "../AddPrescription";
import {API, get} from "../../../../api/config/APIController";
import moment from "moment";
import {DAYS_LIST, PERIODICITY_LIST} from "../constants";

export default function PrescriptionComponent({
                                                  index,
                                                  prescription,
                                                  dispatch,
                                                  addToast,
                                                  medicineTypesList,
                                                  handleClickOpen,
                                                  resetValue,
                                                  shouldResetValue,
                                                  setShouldResetValue,
                                                  setSelectedSectionIndex
                                              }) {
    const getSuggestions = async (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        if (inputLength >= 2 && inputLength <= 12) {
            let response = await get(`${API.GET_MEDICINE}name=${inputValue.toUpperCase()}&type=${prescription.selectedType}&status=active`);
            return response
        }
        return [];
    };

    function onPrescriptionOptionChange(event) {
        handleClickOpen(index, event.target.value);
    }

    function selectMedicineName(selectionObj) {
        dispatch({
            type: ACTIONS.CHANGE_MEDICINE_NAME, payload: {id: index, value: selectionObj}
        })
    }

    function setStartDate(date) {
        const selectedDate = `${moment(date).format('YYYY-MM-DD')}`;
        dispatch({
            type: ACTIONS.SET_START_DATE, payload: {id: index, value: selectedDate}
        })
    }

    function setSelectedMedicineFromType(value) {
        const typeInfo = value.split('|');
        dispatch({
            type: ACTIONS.SET_MEDICINE_TYPE, payload: {
                id: index, value: {
                    "name": typeInfo[1],
                    "status": "active",
                    "_id": typeInfo[0]
                }
            }
        })
    }

    function onDosageChange(value) {
        dispatch({
            type: ACTIONS.CHANGE_DOSAGE_NAME, payload: {id: index, value: value}
        })
    }

    function onCommentChange(value) {
        dispatch({
            type: ACTIONS.CHANGE_COMMENT, payload: {id: index, value: value}
        })
    }

    function onDaysSelect(value) {
        dispatch({
            type: ACTIONS.SET_DAYS, payload: {id: index, value: value}
        })
    }

    function onPeriodicitySelect(value) {
        dispatch({
            type: ACTIONS.SET_PERIODITY, payload: {id: index, value: value}
        })
    }

    function setSos(event) {
        dispatch({
            type: ACTIONS.CHANGE_SOS, payload: {id: index, value: event.target.checked}
        })
    }

    function setStat(event) {
        dispatch({
            type: ACTIONS.CHANGE_STAT, payload: {id: index, value: event.target.checked}
        })
    }

    function onDosageSlotChange(event) {
        dispatch({
            type: ACTIONS.CHANGE_DOSAGE_SLOT, payload: {id: index, value: event.target.value}
        })
    }

    return (
        <>
            <Row classNme="g-2">
                <div className="prescriptionSection">
                    <Row className="choosetemp">
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
                        <AutoSuggestInput
                            selectMedicineName={selectMedicineName}
                            getSuggestions={getSuggestions}
                            addToast={addToast}
                            resetValue={resetValue}
                            shouldResetValue={shouldResetValue}
                            setShouldResetValue={setShouldResetValue}
                            setSelectedSectionIndex={setSelectedSectionIndex}
                        />
                    </div>
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
                                label="Days"
                                defaultValue={prescription.prescriptions[0].days}
                                id="Time Slots"
                                options={DAYS_LIST}
                                handleSelect={onDaysSelect}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <KeyValueSelector
                                value={prescription.prescriptions[0].periodicity}
                                label="Periodicity"
                                defaultValue={prescription.prescriptions[0].periodicity}
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


                            <div key={`inline-radio`} className="">
                                <Form.Check
                                    label="Before Food"
                                    name={`dosage-time-slot-${index}`}
                                    type="radio"
                                    // id={`inline-radio-${index}`}
                                    value="beforeFood"
                                    onChange={onDosageSlotChange}
                                    checked={
                                        prescription.prescriptions[0].dosage.before_food
                                    }
                                />
                                <Form.Check
                                    label="After Food"
                                    name={`dosage-time-slot-${index}`}
                                    type="radio"
                                    value="afterFood"
                                    // id={`inline-radio-2`}
                                    onChange={onDosageSlotChange}
                                    checked={
                                        prescription.prescriptions[0].dosage.after_food
                                    }
                                />
                                <Form.Check
                                    label="With Food"
                                    name={`dosage-time-slot-${index}`}
                                    type="radio"
                                    value="withFood"
                                    // id={`inline-radio-3`}
                                    onChange={onDosageSlotChange}
                                    checked={
                                        prescription.prescriptions[0].dosage.with_food
                                    }
                                />
                                <Form.Check
                                    label="Other"
                                    name={`dosage-time-slot-${index}`}
                                    type="radio"
                                    value="otherFood"
                                    // id={`inline-radio-4`}
                                    onChange={onDosageSlotChange}
                                    checked={
                                        prescription.prescriptions[0].dosage.other
                                    }
                                />
                            </div>

                            {prescription.prescriptions[0].dosage.other &&
                            <div className="otherdoage"><Input type="text" placeholder="Enter other details"
                                                               id="other"
                                                               onChange={() => null}/>
                            </div>}

                            <div key={`inline-checkbox`} className="">
                                <Form.Check
                                    label="SOS"
                                    name="grup"
                                    type={'checkbox'}
                                    id={`inline-checkbox-1`}
                                    checked={prescription.prescriptions[0].dosage.sos}
                                    onChange={setSos}
                                />
                                <Form.Check
                                    label="STAT"
                                    name="grup"
                                    type={'checkbox'}
                                    id={`inline-checkbox-2`}
                                    checked={prescription.prescriptions[0].dosage.stat}
                                    onChange={setStat}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
