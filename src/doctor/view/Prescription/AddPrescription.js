import React, {useEffect, useReducer, useState} from "react";
import Input from "../../../commonComponent/Input";
import TextArea from "../../../commonComponent/TextArea";
import {Button, Col, Form, Row} from "react-bootstrap";
import CustomButton from '../../../commonComponent/Button';
import {back_icon} from "../../../constants/DoctorImages";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {API, get, post} from "../../../api/config/APIController";
import {useToasts} from "react-toast-notifications";
import moment from "moment";
import PrescriptionComponent from "./component/PrescriptionComponent";
import SelectorForMedicine from "../../../commonComponent/SelectorForMedicine";
import {IoCloseSharp} from "react-icons/io5";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export const ACTIONS = {
    CHANGE_PRESCRIPTION_TYPE: 'CHANGE_PRESCRIPTION_TYPE',
    CHANGE_MEDICINE_NAME: 'CHANGE_MEDICINE_NAME',
    SET_MEDICINE_TYPE: 'SET_MEDICINE_TYPE',
    CHANGE_DOSAGE_NAME: 'CHANGE_DOSAGE_NAME',
    SET_DOSAGE_TYPE: 'SET_DOSAGE_TYPE',
    SET_START_DATE: 'SET_START_DATE',
    ADD_NEW_MEDICINE: 'ADD_NEW_MEDICINE',
    SET_DAYS: 'SET_DAYS',
    SET_PERIODITY: 'SET_PERIODITY',
    CHANGE_COMMENT: 'CHANGE_COMMENT',
    CHANGE_SOS: 'CHANGE_SOS',
    CHANGE_STAT: 'CHANGE_STAT',
    CHANGE_DOSAGE_SLOT: 'CHANGE_DOSAGE_SLOT',
    CHANGE_OTHER_DETAILS: 'CHANGE_OTHER_DETAILS',
    ADD_TIME_SLOT: 'ADD_TIME_SLOT',
    REMOVE_TIME_SLOT: 'REMOVE_TIME_SLOT',
    DELETE_MEDICINE: 'DELETE_MEDICINE',
    VALIDATE_MEDICINE_INFO: 'VALIDATE_MEDICINE_INFO',
    VALIDATE_ALL_MEDICINE_INFO: 'VALIDATE_ALL_MEDICINE_INFO',
}
const AddPrescription = (props) => {
    const {addToast} = useToasts();
    let [medicineCount, setMedicineCount] = useState(1);
    let [tempPrescriptionType, setTempPrescriptionType] = useState('');
    let [templateTitle, setTemplateTitle] = useState('');
    let [shouldResetValue, setShouldResetValue] = useState(false);
    let [medicineWithType, setMedicineWithType] = useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [investigationRequiredCheck, setInvestigationRequiredCheck] = React.useState(false);
    const [investigations, setInvestigations] = React.useState([""]);
    const [openSaveTemplateDialog, setOpenSaveTemplateDialog] = React.useState(false);
    const [userShouldProceed, setUserShouldProceed] = React.useState(false);
    const [selectedSectionIndex, setSelectedSectionIndex] = React.useState(null);
    const patientName = props.location?.state?.patientName || '';
    const patientAge = props.location?.state?.patientAge || '';
    const patientWeight = [{
        "name": `${props.location?.state?.patientWeight}` || '',
        "_id": `${props.location?.state?.patientWeight}` || ''
    }];
    const patientHeight = [{
        "name": `${props.location?.state?.patientHeight}` || '',
        "_id": `${props.location?.state?.patientHeight}` || ''
    }];

    const defaultValue = (selectedType) => {
        return {
            selectedType: selectedType,
            medicineItem:
                {
                    medicine: '',
                    medicinetype: '',
                    time_slots: [],
                    start_date: moment().format('YYYY-MM-DD'),
                    days: '1',
                    periodicity: 'days',
                    add_comments: '',
                    dosage: {
                        dosage_text: '',
                        qty: '1mg',
                        before_food: true,
                        after_food: false,
                        with_food: false,
                        other: false,
                        other_details: '',
                        sos: false,
                        stat: false,
                    },
                },
                validationInfo:{
                    medicine_error:'',
                    medicine_type_error:'',
                    dosage_error:'',
                    time_slot_error:'',
                }
        }
    }

    const prescriptionObj = {
        selectedType: 'brand',
        medicineItem:
            {
                medicine: '',
                medicinetype: '',
                time_slots: [],
                start_date: moment().format('YYYY-MM-DD'),
                days: '1',
                periodicity: 'days',
                add_comments: '',
                dosage: {
                    dosage_text: '',
                    qty: '1mg',
                    before_food: true,
                    after_food: false,
                    with_food: false,
                    other: false,
                    other_details: '',
                    sos: false,
                    stat: false,
                },
            },
        validationInfo:{
            medicine_error:'',
            medicine_type_error:'',
            dosage_error:'',
            time_slot_error:'',
        }
    }

    let initialState = [prescriptionObj];

    function updateInvestigationState(index,value) {
        investigations[index] = value
            setInvestigations(JSON.parse(JSON.stringify(investigations)));
    }

    function reducer(prescription_list, action) {
        switch (action.type) {
            case ACTIONS.ADD_NEW_MEDICINE:
                return [...prescription_list, action.payload];
            case ACTIONS.DELETE_MEDICINE:
                if (action.payload.id > -1) {
                    prescription_list.splice(action.payload.id, 1);
                }
                return [...prescription_list];
            case ACTIONS.CHANGE_PRESCRIPTION_TYPE:
                prescription_list[action.payload.id] = defaultValue(action.payload.value)
                setShouldResetValue(true);
                setUserShouldProceed(false);
                return [...prescription_list]
            case ACTIONS.CHANGE_MEDICINE_NAME:
                prescription_list[action.payload.id].medicineItem.medicine = action.payload.value._id
                return [...prescription_list];
            case ACTIONS.SET_MEDICINE_TYPE:
                prescription_list[action.payload.id].medicineItem.medicinetype = action.payload.value._id
                return [...prescription_list]
            case ACTIONS.CHANGE_DOSAGE_NAME:
                prescription_list[action.payload.id].medicineItem.dosage.dosage_text = action.payload.value
                return [...prescription_list]
            case ACTIONS.SET_DOSAGE_TYPE:
                prescription_list[action.payload.id].medicineItem.dosage.qty = action.payload.value
                return [...prescription_list]
            case ACTIONS.SET_START_DATE:
                prescription_list[action.payload.id].medicineItem.start_date = action.payload.value
                return [...prescription_list]
            case ACTIONS.SET_DAYS:
                prescription_list[action.payload.id].medicineItem.days = action.payload.value
                return [...prescription_list]
            case ACTIONS.SET_PERIODITY:
                prescription_list[action.payload.id].medicineItem.periodicity = action.payload.value
                return [...prescription_list]
            case ACTIONS.CHANGE_COMMENT:
                prescription_list[action.payload.id].medicineItem.add_comments = action.payload.value
                return [...prescription_list]
            case ACTIONS.CHANGE_SOS:
                prescription_list[action.payload.id].medicineItem.dosage.sos = action.payload.value
                return [...prescription_list]
            case ACTIONS.CHANGE_STAT:
                prescription_list[action.payload.id].medicineItem.dosage.stat = action.payload.value
                return [...prescription_list]
            case ACTIONS.ADD_TIME_SLOT:
                if (!prescription_list[action.payload.id].medicineItem.time_slots.includes(action.payload.value)) {
                    prescription_list[action.payload.id].medicineItem.time_slots.push(action.payload.value)
                }
                return [...prescription_list]
            case ACTIONS.REMOVE_TIME_SLOT:
                const arr = prescription_list[action.payload.id].medicineItem.time_slots.filter(e => e !== action.payload.value)
                prescription_list[action.payload.id].medicineItem.time_slots = arr
                return [...prescription_list]
            case ACTIONS.CHANGE_OTHER_DETAILS:
                prescription_list[action.payload.id].medicineItem.dosage.other_details = action.payload.value;
                return [...prescription_list]
            case ACTIONS.CHANGE_DOSAGE_SLOT:
                switch (action.payload.value) {
                    case 'beforeFood':
                        prescription_list[action.payload.id].medicineItem.dosage.before_food = true;
                        prescription_list[action.payload.id].medicineItem.dosage.after_food = false;
                        prescription_list[action.payload.id].medicineItem.dosage.with_food = false;
                        prescription_list[action.payload.id].medicineItem.dosage.other = false;
                        prescription_list[action.payload.id].medicineItem.dosage.other_details = '';
                        return [...prescription_list]
                    case 'afterFood':
                        prescription_list[action.payload.id].medicineItem.dosage.before_food = false;
                        prescription_list[action.payload.id].medicineItem.dosage.after_food = true;
                        prescription_list[action.payload.id].medicineItem.dosage.with_food = false;
                        prescription_list[action.payload.id].medicineItem.dosage.other = false;
                        prescription_list[action.payload.id].medicineItem.dosage.other_details = '';
                        return [...prescription_list]
                    case 'withFood':
                        prescription_list[action.payload.id].medicineItem.dosage.before_food = false;
                        prescription_list[action.payload.id].medicineItem.dosage.after_food = false;
                        prescription_list[action.payload.id].medicineItem.dosage.with_food = true;
                        prescription_list[action.payload.id].medicineItem.dosage.other = false;
                        prescription_list[action.payload.id].medicineItem.dosage.other_details = '';
                        return [...prescription_list]
                    case 'otherFood':
                        prescription_list[action.payload.id].medicineItem.dosage.before_food = false;
                        prescription_list[action.payload.id].medicineItem.dosage.after_food = false;
                        prescription_list[action.payload.id].medicineItem.dosage.with_food = false;
                        prescription_list[action.payload.id].medicineItem.dosage.other = true;
                        return [...prescription_list]
                    default:
                        return;
                }
            case ACTIONS.VALIDATE_MEDICINE_INFO:
                if (prescription_list[action.payload.id].medicineItem.medicine === '') {
                    prescription_list[action.payload.id].validationInfo.medicine_error = 'Please choose medicine';
                    // setUserShouldProceed(false);
                }else {
                    prescription_list[action.payload.id].validationInfo.medicine_error = '';
                    // setUserShouldProceed(true);
                }
                if (prescription_list[action.payload.id].medicineItem.medicinetype === '' || prescription_list[action.payload.id].medicineItem.medicinetype === "Select") {
                    prescription_list[action.payload.id].validationInfo.medicine_type_error = 'Please add dosage information';
                    // setUserShouldProceed(false);
                }else {
                    prescription_list[action.payload.id].validationInfo.medicine_type_error = '';
                    // setUserShouldProceed(true);
                }
                if (prescription_list[action.payload.id].medicineItem.dosage.dosage_text === '') {
                    prescription_list[action.payload.id].validationInfo.dosage_error = 'Please add dosage information';
                    // setUserShouldProceed(false);
                } else {
                prescription_list[action.payload.id].validationInfo.dosage_error = '';
                // setUserShouldProceed(true);
                }
                if (!prescription_list[action.payload.id].medicineItem.time_slots.length) {
                    prescription_list[action.payload.id].validationInfo.time_slot_error = 'Please select timings';
                    // setUserShouldProceed(false);
                }else {
                    prescription_list[action.payload.id].validationInfo.time_slot_error = '';
                    // setUserShouldProceed(true);
                }

                if (
                    !(prescription_list[action.payload.id].medicineItem.medicine === '') &&
                    !(prescription_list[action.payload.id].medicineItem.medicinetype === '' || prescription_list[action.payload.id].medicineItem.medicinetype === "Select") &&
                    !(prescription_list[action.payload.id].medicineItem.dosage.dosage_text === '') &&
                    prescription_list[action.payload.id].medicineItem.time_slots.length
                ) {
                    setUserShouldProceed(true);
                }else {
                    setUserShouldProceed(false);
                }
                return [...prescription_list]
            case ACTIONS.VALIDATE_ALL_MEDICINE_INFO:
                prescription_list.forEach((eachMedicine, index) =>{
                    if (index === prescription_list.length - 1){
                        setUserShouldProceed(false);
                    } else {
                        if (eachMedicine.medicineItem.medicine === '') {
                            eachMedicine.validationInfo.medicine_error = 'Please choose medicine';
                            // setUserShouldProceed(false);
                        }else {
                            eachMedicine.validationInfo.medicine_error = '';
                            // setUserShouldProceed(true);
                        }
                        if (eachMedicine.medicineItem.medicinetype === '' || eachMedicine.medicineItem.medicinetype === "Select") {
                            eachMedicine.validationInfo.medicine_type_error = 'Please add dosage information';
                            // setUserShouldProceed(false);
                        }else {
                            eachMedicine.validationInfo.medicine_type_error = '';
                            // setUserShouldProceed(true);
                        }
                        if (eachMedicine.medicineItem.dosage.dosage_text === '') {
                            eachMedicine.validationInfo.dosage_error = 'Please add dosage information';
                            // setUserShouldProceed(false);
                        } else {
                            eachMedicine.validationInfo.dosage_error = '';
                            // setUserShouldProceed(true);
                        }
                        if (!eachMedicine.medicineItem.time_slots.length) {
                            eachMedicine.validationInfo.time_slot_error = 'Please select timings';
                            // setUserShouldProceed(false);
                        }else {
                            eachMedicine.validationInfo.time_slot_error = '';
                            // setUserShouldProceed(true);
                        }

                        if (
                            !(eachMedicine.medicineItem.medicine === '') &&
                            !(eachMedicine.medicineItem.medicinetype === '' || eachMedicine.medicineItem.medicinetype === "Select") &&
                            !(eachMedicine.medicineItem.dosage.dosage_text === '') &&
                            eachMedicine.medicineItem.time_slots.length
                        ) {
                            setUserShouldProceed(true);
                        }else {
                            setUserShouldProceed(false);
                        }
                    }



                })

                return [...prescription_list]
            default:
                return prescription_list
        }
    }

    const [prescription_list, dispatch] = useReducer(reducer, initialState)


    useEffect(() => {
        getMedicineTypes();
    }, []);

    const handleClickOpen = (index, value) => {
        setOpenDialog(true);
        setSelectedSectionIndex(index)
        setTempPrescriptionType(value);
    };

    const handleClose = () => {
        setSelectedSectionIndex(null);
        setOpenDialog(false);
        setTempPrescriptionType('');
    };

    const handleSaveTemplateDialogClose = () => {
        setOpenSaveTemplateDialog(false);
    };

    const handleProceed = () => {
        dispatch({
            type: ACTIONS.CHANGE_PRESCRIPTION_TYPE, payload: {id: selectedSectionIndex, value: tempPrescriptionType}
        })
        setOpenDialog(false);
    };

    function getMedicineTypes() {
        get(`${API.GET_MEDICINE_TYPE}`)
            .then(response => {
                if (response.status === 200) {
                    setMedicineWithType(response.data.data);
                } else {
                    addToast(response.data.message, {appearance: "error"});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: "error"});
            });
    }

    const savePrescriptionAsTemplate = () => {
        let allMedicines = [];
        prescription_list.forEach(prescription => allMedicines.push(prescription.medicineItem))

        let params = {
            name: templateTitle,
            prescription_info: allMedicines
        };
        post(API.SAVE_PRESCRIPTION_AS_TEMPLATE, params)
            .then(response => {
                if (response.status === 200) {
                    addToast(response.data.message, {appearance: 'success'});
                } else {
                    addToast(response.data.message, {appearance: "error"});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: "error"});
            });
    }

    const submitPrescription = () => {
        let allMedicines = [];
        prescription_list.forEach(prescription => allMedicines.push(prescription.medicineItem))

        let params = {
            appointment_id: props.match.params.appointment_id,
            prescriptions: allMedicines,
            investigations: investigations,
        };
        post(API.SUBMIT_PRESCRIPTION, params)
            .then(response => {
                if (response.status === 200) {
                    addToast(response.data.message, {appearance: 'success'});
                    props.history.push('/doctor/home');
                } else {
                    addToast(response.data.message, {appearance: "error"});
                }
            })
            .catch(error => {
                addToast(error.response.data.message, {appearance: "error"});
            });
    }

    function renderDialogComponent() {
        return (
            <div>
                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Do you want to reset?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            This action will reset the prescription. Do you want to proceed?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            No
                        </Button>
                        <Button onClick={handleProceed} color="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    function renderSaveAsTemplateDialogComponent() {
        return (
            <div>
                <Dialog
                    className="modal-save-template"
                    open={openSaveTemplateDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleSaveTemplateDialogClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent>
                        <div className="close-button">
                            <IoCloseSharp style={{cursor: 'pointer'}} color={'#000'} size={34}
                                          onClick={() => setOpenSaveTemplateDialog(false)}/>
                        </div>
                        <div className={'title'}>Save Template</div>
                        <TextArea
                            id={'save-template-text'}
                            placeholder="Enter name of the template"
                            rows={3}
                            cols={35}
                            value={templateTitle}
                            onChange={(value) => setTemplateTitle(value)}
                            maxLength="100"
                        ></TextArea>
                        <Row className="sendPrescriptionAction">
                            <CustomButton
                                disabled={!templateTitle}
                                onClick={() => {
                                savePrescriptionAsTemplate();
                                handleSaveTemplateDialogClose();
                            }}
                                          text={'Save'}
                            >
                            </CustomButton>
                        </Row>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
console.log("amit prescription list", prescription_list)
    return (
        <Row className="doctor-prescription-container">
            <Col lg="1" sm="1" xs='1'/>
            <Col lg="10" sm="10" xs='10'>
                <Row className='back-navigation'>
                    <div className="back-nav-container-dr">
                        <img src={back_icon} alt='back_icon-img' onClick={() => props.history.goBack()}></img>
                        <span>Add Prescription</span>
                    </div>
                </Row>
                {renderDialogComponent()}
                {renderSaveAsTemplateDialogComponent()}
                <div className="container">
                    <div className="addPrescription">
                        <Row className="topsctionName">
                            <Col xs={12} md={4}>
                                <Input
                                    type="text"
                                    id="firstName"
                                    label="Patient Name"
                                    readonly="true"
                                    value={patientName}
                                />
                            </Col>
                            <Col xs={12} md={4}>
                                <Input
                                    type="number"
                                    id="age"
                                    label="Age"
                                    readonly="true"
                                    value={patientAge}
                                />
                            </Col>

                            <Col md>
                                <Row className="g-2">
                                    <Col xs={12} md={6}>
                                        <SelectorForMedicine
                                            label="Height"
                                            defaultValue="Select"
                                            value={props.location?.state?.patientHeight}
                                            id="Height"
                                            options={patientHeight}
                                            handleSelect={() => null}
                                        />
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <SelectorForMedicine
                                            label="Weight"
                                            defaultValue="Select"
                                            value={props.location?.state?.patientWeight}
                                            id="Weight"
                                            options={patientWeight}
                                            handleSelect={() => null}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Row className={'prescription-header'}>
                                <Col md>
                                    <h5>Prescriptions</h5>
                                </Col>
                                <Col md className="Choosetemplate">
                                    <p className="chooseTemplateButton"
                                       onClick={() => console.log('clicked on Choose template')}>Choose template</p>
                                </Col>

                            </Row>
                        </Row>
                        {
                            prescription_list.map((prescription, index) => {
                                return <PrescriptionComponent key={index}
                                                              index={index} prescription={prescription}
                                                              dispatch={dispatch} addToast={addToast}
                                                              medicineTypesList={medicineWithType}
                                                              handleClickOpen={handleClickOpen}
                                                              resetValue={selectedSectionIndex === index}
                                                              shouldResetValue={shouldResetValue}
                                                              setShouldResetValue={setShouldResetValue}
                                                              setSelectedSectionIndex={setSelectedSectionIndex}
                                />
                            })
                        }
                        <div className="actionSave">
                            <Button variant="outline-primary"
                                    disabled={!prescription_list.length || !userShouldProceed}
                                    onClick={() => {
                                        setOpenSaveTemplateDialog(true);
                                        setTemplateTitle('');
                                    }}>Save as
                                Template</Button>{' '}
                            <Button variant="secondary" onClick={() => {
                                dispatch({
                                    type: ACTIONS.ADD_NEW_MEDICINE, payload: prescriptionObj
                                })
                                dispatch({
                                    type: ACTIONS.VALIDATE_ALL_MEDICINE_INFO
                                })
                                setUserShouldProceed(false)
                                setMedicineCount(medicineCount + 1);
                            }}
                            >Add New Medicine</Button>{' '}
                        </div>

                        <Row className="g-2">
                            <Col sm={6}>
                                <Row className="investigationscheck">

                                    <div key={`inline-checkbox`} className="">
                                        <Form.Check
                                            label="Required Investigations"
                                            name={"Required Investigations"}
                                            type={'checkbox'}
                                            id={`inline-checkbox-1`}
                                            onChange={() => {
                                                setInvestigationRequiredCheck(!investigationRequiredCheck);
                                                setInvestigations([""]);
                                            }}
                                            checked={investigationRequiredCheck}
                                        />
                                    </div>


                                </Row>
                                <Row>
                                    {
                                        investigationRequiredCheck && investigations.map((text, index) => {
                                            return <TextArea
                                                key={index}
                                                id={`Investigations ${index}`}
                                                placeholder="Enter text here"
                                                rows={3}
                                                cols={35}
                                                value={text}
                                                onChange={(value) => updateInvestigationState(index, value)}
                                                maxLength="100"
                                            ></TextArea>
                                        })
                                    }
                                </Row>
                            </Col>

                            {investigationRequiredCheck && <div className="AddAnotherTest">
                                <p onClick={() => {
                                    setInvestigations([...investigations, ""]);
                                }}>+ Add Another Test</p>
                            </div>}

                        </Row>


                        <Row className="sendPrescriptionAction">
                            <CustomButton text={'Send Prescription'}
                                          className="primary SendPrescription"
                                          disabled={!prescription_list.length || !userShouldProceed}

                                          onClick={()=> submitPrescription()}
                            ></CustomButton>
                            {!prescription_list.length &&
                            <span className="error-text">Please add a medicine to proceed</span>}
                            {!userShouldProceed && prescription_list.length >1 &&
                            <span className="error-text">Please fill/correct required fields </span>}
                        </Row>
                    </div>
                </div>
            </Col>
            <Col lg="1" sm="1" xs='1'/>
        </Row>
    );
};
export default AddPrescription;
