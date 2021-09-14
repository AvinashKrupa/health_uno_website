import {Button, Card, Col, Form, Row} from "react-bootstrap";
import AutoSuggestInput from "./AutoSuggestInput";
import Input from "../../../../commonComponent/Input";
import SelectorForMedicine from "../../../../commonComponent/SelectorForMedicine";
import React from "react";
import {ACTIONS} from "../AddPrescription";
import {API, get} from "../../../../api/config/APIController";
import moment from "moment";
import {DAYS_LIST, DOSAGE_LIST, PERIODICITY_LIST} from "../constants";
import {IoCloseSharp} from "react-icons/io5";

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
            dispatch({
                type: ACTIONS.VALIDATE_MEDICINE_INFO, payload: {id: index}
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
        dispatch({
            type: ACTIONS.VALIDATE_MEDICINE_INFO, payload: {id: index}
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

    function onDosageQuantity(value) {
        dispatch({
            type: ACTIONS.SET_DOSAGE_TYPE, payload: {id: index, value: value}
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

    function onOtherDetails(value) {
        dispatch({
            type: ACTIONS.CHANGE_OTHER_DETAILS, payload: {id: index, value: value}
        })
    }

    function onBlur(value) {
            dispatch({
                type: ACTIONS.VALIDATE_MEDICINE_INFO, payload: {id: index}
            })
    }

    return (
        <>
            <Row classNme="g-2">
                <div className="prescriptionSection">
                    <Row className="choosetemp">
                        <Col md className="Choosetemplate">
                            <IoCloseSharp style={{cursor: 'pointer'}} color={'#000'} size={34} onClick={() =>
                                dispatch({
                                    type: ACTIONS.DELETE_MEDICINE, payload: {id: index}
                                })
                            }/>
                        </Col>
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
                        {!!prescription.validationInfo.medicine_error &&
                        <span className="error-text">{prescription.validationInfo.medicine_error}</span>
                        }
                    </div>
                    <Row>
                        <div style={{marginTop: 20, marginBottom: 10}}>Time Slots</div>
                    </Row>
                    <Row className="g-3 time-slots-container">
                        <Col xs={12} md={4}>
                            <Button className={'time-slots-button'}
                                    style={{
                                        backgroundColor: prescription.medicineItem.time_slots.includes('Morning') ? '#28A3DA' : '#FFFFFF',
                                        color: prescription.medicineItem.time_slots.includes('Morning') ? '#FFFFFF' : '#28A3DA'
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (prescription.medicineItem.time_slots.includes('Morning')) {
                                            dispatch({
                                                type: ACTIONS.REMOVE_TIME_SLOT, payload: {id: index, value: 'Morning'}
                                            })
                                            dispatch({
                                                type: ACTIONS.VALIDATE_MEDICINE_INFO, payload: {id: index}
                                            })
                                        } else {
                                            dispatch({
                                                type: ACTIONS.ADD_TIME_SLOT, payload: {id: index, value: 'Morning'}
                                            })
                                            dispatch({
                                                type: ACTIONS.VALIDATE_MEDICINE_INFO, payload: {id: index}
                                            })
                                        }

                                    }}
                            >
                                <span
                                    style={{color: prescription.medicineItem.time_slots.includes('Morning') ? '#FFFFFF' : '#000000'}}
                                >Morning</span>
                            </Button>
                        </Col>
                        <Col className="timeSlots" xs={12} md={4}>
                            <Button className={'time-slots-button'}
                                    style={{
                                        backgroundColor: prescription.medicineItem.time_slots.includes('Afternoon') ? '#28A3DA' : '#FFFFFF',
                                        color: prescription.medicineItem.time_slots.includes('Afternoon') ? '#FFFFFF' : '#28A3DA'
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (prescription.medicineItem.time_slots.includes('Afternoon')) {
                                            dispatch({
                                                type: ACTIONS.REMOVE_TIME_SLOT, payload: {id: index, value: 'Afternoon'}
                                            })
                                            dispatch({
                                                type: ACTIONS.VALIDATE_MEDICINE_INFO, payload: {id: index}
                                            })
                                        } else {
                                            dispatch({
                                                type: ACTIONS.ADD_TIME_SLOT, payload: {id: index, value: 'Afternoon'}
                                            })
                                            dispatch({
                                                type: ACTIONS.VALIDATE_MEDICINE_INFO, payload: {id: index}
                                            })
                                        }

                                    }}
                            >
                                <span
                                    style={{color: prescription.medicineItem.time_slots.includes('Afternoon') ? '#FFFFFF' : '#000000'}}
                                >Afternoon</span>
                            </Button>
                        </Col>
                        <Col className="timeSlots" xs={12} md={4}>
                            <Button className={'time-slots-button'}
                                    style={{
                                        backgroundColor: prescription.medicineItem.time_slots.includes('Night') ? '#28A3DA' : '#FFFFFF',
                                        color: prescription.medicineItem.time_slots.includes('Night') ? '#FFFFFF' : '#28A3DA'
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (prescription.medicineItem.time_slots.includes('Night')) {
                                            dispatch({
                                                type: ACTIONS.REMOVE_TIME_SLOT, payload: {id: index, value: 'Night'}
                                            })
                                            dispatch({
                                                type: ACTIONS.VALIDATE_MEDICINE_INFO, payload: {id: index}
                                            })
                                        } else {
                                            dispatch({
                                                type: ACTIONS.ADD_TIME_SLOT, payload: {id: index, value: 'Night'}
                                            })
                                            dispatch({
                                                type: ACTIONS.VALIDATE_MEDICINE_INFO, payload: {id: index}
                                            })
                                        }

                                    }}
                            >
                                <span
                                    style={{color: prescription.medicineItem.time_slots.includes('Night') ? '#FFFFFF' : '#000000'}}
                                >Night</span>
                            </Button>
                        </Col>
                        {!prescription.medicineItem.time_slots.length && !!prescription.validationInfo.time_slot_error &&
                        // {!prescription.medicineItem.time_slots.length &&
                        // <span className="error-text">Please select timings</span>
                        <span className="error-text">{prescription.validationInfo.time_slot_error}</span>
                        }
                    </Row>


                    <Row className="g-3">
                        <Col xs={12} md={6}>
                            <SelectorForMedicine
                                label="Days"
                                defaultValue="Select"
                                value={prescription.medicineItem.days}
                                options={DAYS_LIST}
                                handleSelect={onDaysSelect}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <SelectorForMedicine
                                label="Periodicity"
                                defaultValue="Select"
                                value={prescription.medicineItem.periodicity}
                                options={PERIODICITY_LIST}
                                handleSelect={onPeriodicitySelect}
                            />
                        </Col>
                    </Row>


                </Col>


                <Col>
                    <SelectorForMedicine
                        label="Medicine Type"
                        defaultValue={"Select"}
                        value={prescription.medicineItem.medicinetype}
                        options={medicineTypesList}
                        handleSelect={setSelectedMedicineFromType}
                    />
                    {!!prescription.validationInfo.medicine_type_error &&
                    <span className="error-text">{prescription.validationInfo.medicine_type_error}</span>
                    }
                    <Input
                        type="date"
                        placeholder="Start Date"
                        label="Start Date"
                        onChange={setStartDate}
                        value={prescription.medicineItem.start_date}
                    />
                    <Input
                        type="text"
                        placeholder="Enter text here"
                        label="Add Comments"
                        value={prescription.medicineItem.add_comments}
                        onChange={onCommentChange}
                    />
                </Col>

                <Col sm={5}>
                    <Card style={{height: '100%'}}>
                        <Card.Body>
                            <Row>
                                <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                                    <Col sm={6}>
                                        <Input
                                            type="text"
                                            placeholder="Enter text here"
                                            label="Dosage"
                                            value={prescription.medicineItem.dosage.dosage_text}
                                            onChange={onDosageChange}
                                            onBlur={onBlur}
                                        />
                                    </Col>
                                    <Col sm={6} className="dosage-container">
                                        <SelectorForMedicine
                                            defaultValue="Select"
                                            value={prescription.medicineItem.dosage.qty}
                                            options={DOSAGE_LIST}
                                            handleSelect={onDosageQuantity}
                                        />
                                    </Col>
                                </div>
                                <Row>
                                    {!!prescription.validationInfo.dosage_error &&
                                    <span className="error-text">{prescription.validationInfo.dosage_error}</span>
                                    }
                                </Row>
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
                                        prescription.medicineItem.dosage.before_food
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
                                        prescription.medicineItem.dosage.after_food
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
                                        prescription.medicineItem.dosage.with_food
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
                                        prescription.medicineItem.dosage.other
                                    }
                                />
                            </div>

                            {prescription.medicineItem.dosage.other &&
                            <div className="otherdoage"><Input type="text" placeholder="Enter other details"
                                                               onChange={onOtherDetails}/>
                            </div>}

                            <div key={`inline-checkbox`} className="">
                                <Form.Check
                                    label="SOS"
                                    name="grup"
                                    type={'checkbox'}
                                    id={`inline-checkbox-1`}
                                    checked={prescription.medicineItem.dosage.sos}
                                    onChange={setSos}
                                />
                                <Form.Check
                                    label="STAT"
                                    name="grup"
                                    type={'checkbox'}
                                    id={`inline-checkbox-2`}
                                    checked={prescription.medicineItem.dosage.stat}
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
