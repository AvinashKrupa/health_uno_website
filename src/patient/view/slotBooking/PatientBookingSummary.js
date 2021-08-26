import { Row, Col, Image, Container } from "react-bootstrap";
import {Link} from "react-router-dom";
import ColorCard from "../doctorDetail/ColorCard";
import { useEffect, useState } from "react";
import {API, post} from '../../../api/config/APIController';
import { useToasts } from 'react-toast-notifications';
import CustomButton from '../../../commonComponent/Button';
import Input from '../../../commonComponent/Input';
import TextArea from '../../../commonComponent/TextArea';
import patientSlotBookingStore from "../../store/patientSlotBookingStore";
import moment from "moment";
import { getData } from "../../../storage/LocalStorage/LocalAsyncStorage";
import { isEmpty } from "../../../utils/Validators";

const PatientBookingSummary = (props) => {

    useEffect(() => {
        getDoctorDetails();
        return () => {};
    }, [props.match.params.doctor_id]);

    const { addToast } = useToasts();
    const date = patientSlotBookingStore((state) => state.date);
    const startTime = patientSlotBookingStore((state) => state.startTime);
    const [doctorDetails, setDoctorDetails] = useState('');
    const [complaints, setComplaints] = useState('');
    const [purpose, setPurpose] = useState('');
    let transactionID = '';
    const slot_id =  patientSlotBookingStore((state) => state.slot_id);

    function getDoctorDetails() {
        post(API.GETDOCTORDETAILS, {doctor_id: props.match.params.doctor_id, include_similar: true })
        .then(response => {
            if (response.status === 200) {
            setDoctorDetails(response.data.data);
            } else {
            addToast(response.data.message, { appearance: 'error' });
            }
        })
        .catch(error => {
            addToast(error.response.data.message, { appearance: 'error' });
        });
    }

    function validation() {
        if (isEmpty(purpose)) {
          addToast('Please enter the purpose', { appearance: 'error' });
          return false;
        } else if (isEmpty(slot_id)) {
          addToast('Please go back and select the time', { appearance: 'error' });
          return false;
        } else if (isEmpty(date)) {
            addToast('Please go back and select the date', { appearance: 'error' });
            return false;
        } else if (isEmpty(startTime)) {
            addToast('Please go back and select the time', { appearance: 'error' });
            return false;
        } else {
          return true;
        }
    }

    function bookSlots() {
        const isValid = validation();
        if(isValid) {
            let params = {
                reason: purpose,
                doctor_id: props.match.params.doctor_id,
                slot_id: slot_id,
                slot: startTime,
                date: moment(date).format('YYYY-MM-DD'),
              };

              post(API.BOOKAPPOINTMENT, params)
                .then(response => {
                  if (response.status === 200) {
                    transactionID = `${response.data.data._id}`;
                    processRazorPayment(response.data.data.razorpay_order_id, transactionID);
                  } else {
                      addToast(response.data.message, { appearance: 'error' });
                  }
                })
                .catch(error => {
                  addToast(error.response.data.message, { appearance: 'error' });
                });
        }
    }

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    function processRazorPayment(transaction_id, transactionID) {
        loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        ).then((res) => {
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        })

        const userInfo1 = JSON.parse(getData('userInfo'));
        const options = {
          description: 'Video Consulation',
          image:
            'https://healthuno-dev-public.s3.ap-south-1.amazonaws.com/images/logo/patient.png',
          currency: 'INR',
          key: 'rzp_test_B0gfA1BIUTnr5L', // Your api key
          amount: `${doctorDetails.fee}00`,
          name: `${doctorDetails.first_name} ${doctorDetails.last_name}`,
          prefill: {
            email: `${userInfo1.email}`,
            contact: `${userInfo1.mobile_number}`,
            name: `${userInfo1.first_name} ${doctorDetails.last_name}`,
          },
          theme: {color: '#28A3DA'},
          redirect: false,
          order_id: transaction_id,
          handler: async function (response) {
            const data = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                transaction_id: transactionID,
            };
            post(API.CONFIRMPAYENT, data)
            .then(result => {
              if (result.status === 200) {
                addToast('Slot is successfully booked', { appearance: 'success' });
                props.history.push('/patient/appointments')
              } else {
                  addToast(result.data.message, { appearance: 'error' });
              }
            })
            .catch(error => {
              addToast(error.response.data.message, { appearance: 'error' });
            });
        },
        };
    }

    return (
        <>
            <Row>
                <Col lg="1" md='1' sm='1' xs='1'/>
                <Col lg="11"  md='11' sm='11'  xs='10' className='screen-768 doctor-detail-container'>
                    {
                        doctorDetails &&
                        <>
                            <Row style={{ marginBottom: "50px" }} className='doctor-back-navigation'>
                                <Row className='back-navigation'>
                                    <Link to={`/patient/slotBooking/${props.match.params.doctor_id}`}><i class="fas fa-arrow-left"></i><span>Summary</span></Link>
                                </Row>
                            </Row>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col lg={(window.screen.availWidth  > 768 &&  window.screen.availWidth < 1300) ? '3': '2' } md='12' >
                                            <Image src={doctorDetails.dp} className='doctor-detail-image'
                                                style={{height: '150px',
                                                width: '150px',
                                                borderRadius: '78px',
                                                border: '1px solid #000000',
                                                marginLeft: '20px'
                                            }}/>
                                            <Col className='slot-summary-doc-details' style={{padding: '20px'}}>
                                                    <span
                                                        className="doctor_details_h3"
                                                        style={{ marginBottom: "6px"}}
                                                    >
                                                    {`Dr ${doctorDetails.first_name} ${doctorDetails.last_name}`}
                                                    </span>
                                                    <Row>
                                                        <span className="doctor_details_color_h5">
                                                            {
                                                                doctorDetails.specialities.map((s) => {
                                                                    return(<span key={s} style={{ padding: '5px', marginRight: '10px'}} className='doctor-card-specialization-container'>{s}</span>)
                                                                })
                                                            }
                                                        </span>
                                                    </Row>
                                                    <Row>
                                                    <span className="doctor-card-doctor-details" style={{ marginTop: "10px"}}>
                                                        {`${doctorDetails.city}, ${doctorDetails.country} | ${doctorDetails.exp} Y Exp`}
                                                    </span>
                                                    </Row>
                                                </Col>
                                        </Col>
                                        <Col lg="8" md='12'style={{ marginLeft: "20px" }}>
                                            <Row>

                                                <Col lg={(window.screen.availWidth  > 768 &&  window.screen.availWidth < 1300) ? '12': '10' }  md='10'>
                                                    <Row style={{ marginTop: "20px", marginBottom: "48px" }} className='color-card-container'>
                                                        {doctorDetails &&  <ColorCard fee={doctorDetails.fee} exp={doctorDetails.exp} total_patients={doctorDetails.total_patients}/>}
                                                    </Row>
                                                </Col>
                                            </Row>

                                        </Col>
                                    </Row>

                                    <Row className='patient-booking-detail'>
                                        <Col lg="3" style={{paddingTop: '5px'}}>
                                            <Container>
                                                <Input
                                                    type="text"
                                                    placeholder="Purpose"
                                                    id="purpose"
                                                    label="Purpose"
                                                    value={purpose}
                                                    onChange={setPurpose}
                                                />
                                            </Container>
                                        </Col>
                                        <Col  lg={(window.screen.availWidth  > 768 &&  window.screen.availWidth < 1300) ? '4': '3' }>
                                            <TextArea
                                                label="Complaints"
                                                type="textarea"
                                                row="3"
                                                value={complaints}
                                                placeholder="Describe your complaints here"
                                                onChange={setComplaints}
                                            />
                                        </Col>

                                        <Col lg={(window.screen.availWidth  > 768 &&  window.screen.availWidth < 1300) ? '4': '3' }>
                                        <Container className='slot-appointment-container'>
                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                    <span className='textarea-label'> Appointment Details</span><Link to={`/patient/slotBooking/${props.match.params.doctor_id}`}><i class="fas fa-pen"></i></Link>
                                                </div>
                                                <div className='slot-appointment-detail'>
                                                    <div>Date : {date}</div>
                                                    <div>Time : {startTime}</div>
                                                    <div>Type : Video</div>
                                                </div>
                                        </Container>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </>
                    }
                    <div style={{textAlign: 'center'}}>
                        <CustomButton
                        className={'patient-order-booking-btn'}
                        onClick={bookSlots}
                        text={`Pay ₹${doctorDetails.fee}`}
                        ></CustomButton>
                    </div>
                </Col>
                <Col lg="1" md='1' />
            </Row>
        </>
    );
};
export default PatientBookingSummary;
