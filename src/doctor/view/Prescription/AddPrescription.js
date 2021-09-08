import React, {useEffect, useReducer, useState} from "react";
import Input from "../../../commonComponent/Input";
import KeyValueSelector from "../../../commonComponent/KeyValueSelector";
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
import {API, get} from "../../../api/config/APIController";
import {useToasts} from "react-toast-notifications";
import moment from "moment";
import PrescriptionComponent from "./component/PrescriptionComponent";

const prescription_JSON = require('../../../JSON/prescription.json');
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
}
const AddPrescription = (props) => {
    const {addToast} = useToasts();
    let [medicineCount, setMedicineCount] = useState(1);
    let [prescriptionType, setPrescriptionType] = useState('brand');
    let [tempPrescriptionType, setTempPrescriptionType] = useState('');
    let [medicineWithType, setMedicineWithType] = useState([]);
    let [medicineList, setMedicineList] = useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [selectedSectionIndex, setSelectedSectionIndex] = React.useState(null);

    const prescriptionObj = {
        selectedType: 'brand',
        prescriptions: [
            {
                medicine: '',
                medicinetype: '',
                time_slots: '',
                start_date: moment().format('YYYY-MM-DD'),
                days: '1',
                periodicity: 'days',
                add_comments: '',
                dosage: {
                    dosage_text: '',
                    qty: '100mg',
                    before_food: true,
                    after_food: false,
                    with_food: false,
                    other: false,
                    other_details: '',
                    sos: false,
                    stat: false,
                },
            }
        ],
    }

    let initialState = [{
            selectedType: 'brand',
            prescriptions: [
                {
                    medicine: '',
                    medicinetype: '',
                    time_slots: 'Morning, Night',
                    start_date: moment().format('YYYY-MM-DD'),
                    days: '10',
                    periodicity: 'days',
                    add_comments: '',
                    dosage: {
                        dosage_text: '',
                        qty: '100mg',
                        before_food: true,
                        after_food: false,
                        with_food: false,
                        other: false,
                        other_details: '',
                        sos: true,
                        stat: false,
                    },
                }
            ],
        }]

    ;

    function reducer(prescription_list, action) {
        switch (action.type) {
            case ACTIONS.ADD_NEW_MEDICINE:
                return [...prescription_list, action.payload];
            case ACTIONS.CHANGE_PRESCRIPTION_TYPE:
                prescription_list[action.payload.id].selectedType = action.payload.value;
                prescription_list[action.payload.id].prescriptions[0].medicine = '';
                prescription_list[action.payload.id].prescriptions[0].dosage.dosage_text = '';
                prescription_list[action.payload.id].prescriptions[0].add_comments = '';
                prescription_list[action.payload.id].prescriptions[0].medicinetype = '';
                return [...prescription_list]
            case ACTIONS.CHANGE_MEDICINE_NAME:
                prescription_list[action.payload.id].prescriptions[0].medicine = action.payload.value._id
                return [...prescription_list];
            case ACTIONS.SET_MEDICINE_TYPE:
                prescription_list[action.payload.id].prescriptions[0].medicinetype = action.payload.value._id
                return [...prescription_list]
            case ACTIONS.CHANGE_DOSAGE_NAME:
                prescription_list[action.payload.id].prescriptions[0].dosage.dosage_text = action.payload.value
                return [...prescription_list]
            case ACTIONS.SET_DOSAGE_TYPE:
                return null;
            case ACTIONS.SET_START_DATE:

                prescription_list[action.payload.id].prescriptions[0].start_date = action.payload.value._id
                return [...prescription_list]
            case ACTIONS.SET_DAYS:
                prescription_list[action.payload.id].prescriptions[0].days = action.payload.value._id
                return [...prescription_list]
            case ACTIONS.SET_PERIODITY:
                prescription_list[action.payload.id].prescriptions[0].periodicity = action.payload.value._id
                return [...prescription_list]

            case ACTIONS.CHANGE_COMMENT:
                prescription_list[action.payload.id].prescriptions[0].add_comments = action.payload.value
                return [...prescription_list]
            case ACTIONS.CHANGE_SOS:
                prescription_list[action.payload.id].prescriptions[0].dosage.sos = action.payload.value
                return [...prescription_list]
            case ACTIONS.CHANGE_STAT:
                prescription_list[action.payload.id].prescriptions[0].dosage.stat = action.payload.value
                return [...prescription_list]
            case ACTIONS.CHANGE_DOSAGE_SLOT:
                switch (action.payload.value) {
                    case 'beforeFood':
                        prescription_list[action.payload.id].prescriptions[0].dosage.before_food = true;
                        prescription_list[action.payload.id].prescriptions[0].dosage.after_food = false;
                        prescription_list[action.payload.id].prescriptions[0].dosage.with_food = false;
                        prescription_list[action.payload.id].prescriptions[0].dosage.other = false;
                        return [...prescription_list]
                    case 'afterFood':
                        prescription_list[action.payload.id].prescriptions[0].dosage.before_food = false;
                        prescription_list[action.payload.id].prescriptions[0].dosage.after_food = true;
                        prescription_list[action.payload.id].prescriptions[0].dosage.with_food = false;
                        prescription_list[action.payload.id].prescriptions[0].dosage.other = false;
                        return [...prescription_list]
                    case 'withFood':
                        prescription_list[action.payload.id].prescriptions[0].dosage.before_food = false;
                        prescription_list[action.payload.id].prescriptions[0].dosage.after_food = false;
                        prescription_list[action.payload.id].prescriptions[0].dosage.with_food = true;
                        prescription_list[action.payload.id].prescriptions[0].dosage.other = false;
                        return [...prescription_list]
                    case 'otherFood':
                        prescription_list[action.payload.id].prescriptions[0].dosage.before_food = false;
                        prescription_list[action.payload.id].prescriptions[0].dosage.after_food = false;
                        prescription_list[action.payload.id].prescriptions[0].dosage.with_food = false;
                        prescription_list[action.payload.id].prescriptions[0].dosage.other = true;
                        return [...prescription_list]
                    default:
                        return;
                }
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

    const handleProceed = () => {
        dispatch({
            type: ACTIONS.CHANGE_PRESCRIPTION_TYPE, payload: {id: selectedSectionIndex, value: tempPrescriptionType}
        })
        setOpenDialog(false);
        setMedicineList([]);
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

    console.log('prescription_list  :', prescription_list);
    return (
        <Row className="doctor-prescription-container">
            <Col lg="1" sm="1" xs='1'/>
            <Col lg="10" sm="10" xs='10'>
                <Row className='back-navigation'>
                    <div className="back-nav-container">
                        <img src={back_icon} alt='back_icon-img' onClick={() => props.history.goBack()}></img>
                        <span>Add Prescription</span>
                    </div>
                </Row>
                {renderDialogComponent()}
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
                            <Row style={{marginTop:46}}>
                                <Col md><h5>Prescriptions</h5></Col>
                            </Row>
                        </Row>
                        {
                            prescription_list.map((prescription, index) => {
                                return <PrescriptionComponent key={index}
                                                              index={index} prescription={prescription}
                                                              dispatch={dispatch} addToast={addToast}
                                                              medicineTypesList={medicineWithType}
                                                              handleClickOpen={handleClickOpen}
                                />
                            })
                        }
                        <div className="actionSave">
                            <Button variant="outline-primary">Save as Template</Button>{' '}
                            <Button variant="secondary" onClick={() => {
                                dispatch({
                                    type: ACTIONS.ADD_NEW_MEDICINE, payload: prescriptionObj
                                })
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
                            <CustomButton text={'Send Prescription'}
                                          className="primary SendPrescription"></CustomButton>
                        </Row>
                    </div>
                </div>
            </Col>
            <Col lg="1" sm="1" xs='1'/>
        </Row>
    );
};
export default AddPrescription;
