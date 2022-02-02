/* eslint-disable jsx-a11y/anchor-is-valid */
import "./style_FAQ.scss";
import { Row, Col, Accordion, Card } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useState } from "react";
import ModalDialog from '../commonComponent/ModalDialog'
import IframeModal from "../patient/view/IframeModal";

const data = [
  {
    title: "What is Healthuno healthcare?",
    description:
      "HealthUno is a unified digital healthcare platform available everywhere. Our healthcare centres are powered with cloud integrated testing equipment which provides instant test results at our advanced clinics and to the users through our app.",
  },
  {
    title: "What types of services do we offer?",
    description:
      "At Healthuno, we provide three different models of healthcare. We have virtual video consultation services for our patients provided by our diverse panel of experienced physicians . We also have a walk in clinic for our patients here the patients can get their vitals checked along with a specific set of investigations followed by an examination by our qualified experienced staff nurses. After the examination, the patient connects with the physicians over video consultation who then advises appropriate treatment. We also provide doorstep consultations where a trained nurse reaches your residence with a portable device which checks your vitals and can do a selected number of investigations. After the nurse examines the patient, the patient is connected with the consultant of their choice via an Ipad for a high quality video consultation post which the patient is prescribed appropriate treatment and management.",
  },
  {
    title: "Where we are available?",
    description:
      "We are available on the Google Playstore and Apple App store as Healthuno app. Youcan download the app to consult our diverse panel of consultants from a comfortablelocation of your choice anytime you desire. We are also available on the websitewww.healthuno.com where you can create a profile, login and choose your physicianfrom our exhaustive list of specialists for your next video consultation. For a morepersonalized experience, you can visit our physical clinics located at select cities wherepatients can avail video consultations with a physical examination done by our panel oftrained certified staff nurses followed by select investigations with instant results and anattached pharmacy to purchase medicines.",
  },
  {
    title: "How do I register with Healthuno?",
    description:
      "You can first download our mobile application from the Google Playstore and Apple Appstore. After downloading you can register with your mobile number by entering a uniqueOTP sent after registration. You are all set now and can use our app to consult thephysician of your choice. You can also register via the same process on our websitewww.healthuno.com and book a consultation with a panel physician of your choice.",
  },
  {
    title: "How do I book an appointment for virtual/tele- consultation?",
    description:
      "After registration, you can search for the available list of physicians by theirname (if you have already consulted a physician or have been referred by aphysician) or can search for a physician from the list of departments available inthe dropdown section. After filling the required basic information (Age, sex, chiefcomplaints, additional information) you will be able to view the availabletimeslots for the selected physician. Once you choose an available timeslot, youwill be redirected to the payment interface where you can pay the consultationfees via Netbanking/Credit Card/Debit Card/UPI interface. After the payment isdone, you will get a confirmation message via SMS and email with the details ofyour booked appointment. You can also contact our Customer care Helplinewhere our support team will help you select the appropriate physician andtimeslot and book an appointment on your behalf at your convenient timeslots.",
  },
  {
    title: "How do I book an appointment for In-clinic consultation?",
    description:
      "You can walk into our Clinics and the staff will help you with booking an appointmentwith our panel of physicians at the Kiosk. We want the clinic appointment bookingexperience to be as seamless as possible hence we have created a different experiencefor walk in patients at our clinic.",
  },
  {
    title: "How do I make the payment? And what are the options available?",
    description:
      "We have multiple payment platform options to confirm your appointment. You canmake the payment using your Credit/Debit cards, Net banking and UPI such as Phone Pe,G-pay and Paytm.",
  },
  {
    title: "How can I cancel an appointment?",
    description: "Kindly refer the cancelation policy mentioned below.",
  },
  {
    title: "What is our cancellation policy?",
    type: "URL",
    description: "Checkout our cancellation policy",
  },
  {
    title: "How can I cancel & reschedule my appointment?",
    description:
      "You can cancel or reschedule your appointment as per the cancelation policy mentioned below through the app/website or the customer care as applicable.",
  },
  {
    title: "How will I get my refund back, In-case of cancellation?",
    description:
      "Kindly refer our cancelation and refund policy for more details on the same.",
  },
  {
    title: "How soon I can get the refund back?",
    description:
      "After a successful cancelation, your money will be returned back to the original payment source within 7-10 business days as mentioned in the cancelation policy.",
  },
  {
    title: "How do referral scheme works? & the benefits of it?",
    description: "Enjoying the Healthuno app? Now you can share the goodness and benefits of being a Healthuno customer with your friends and family. Share the Healthuno app to receive exciting discounts and an exclusive Invite only preview to the Healthuno Premium Circle Membership plan.",
  },
  {
    title: "What is loyalty program? & how it works?",
    description: "Enjoying the Healthuno app? Now you can share the goodness and benefits of being a Healthuno customer with your friends and family. Share the Healthuno app to receive exciting discounts and an exclusive Invite only preview to the Healthuno Premium Circle Membership plan.",
  },
  {
    title: "Why do I choose Healthuno?",
    description:
      "Healthuno is the only unified Digital Healthcare Service Provider in the country. We provide high quality and reliable video consultations through or proprietary software with utmost privacy. Our Data handling and privacy policies ensure that your medical information stays secure and is only shared with the concerned parties for specific purposes on a need to share basis with the consent of the patient. Our Kiosks are designed based on appropriate government regulations with equipment certified by USFDA. Patients can get examined by state of the art devices and equipment with immediate test results which will be shared via electronic media safely and stored in secure cloud backed database with access control. Patients can also avail the Clinic At Home services where a certified trained staff nurse or paramedic will visit them at home to perform specific tests and investigations followed by an examination and consultation with one of our panel physicians on an Ipad from the comfort of their home. They can then order medicines from our website or from a partner pharmacy located nearby with free home delivery. This is a unique blended concept of healthcare which is not offered anywhere else in India at present. We aim to revolutionize the way in which healthcare services will be delivered across the nation with cutting edge technology and high quality equipment and a wide selection of qualified and certified panel physicians.",
  },
  {
    title: "What are the timings for consultations?",
    description:
      "Our diverse panel of doctors across various specialties will be available for consultation 24 hours a day, seven days a week. Choose any available physician from the list of practitioners according to your suitable and convenient time.",
  },
  {
    title: " How can I get in touch with the customer support?",
    description:
      "Our diverse panel of doctors across various specialties will be available for consultation 24 hours a day, seven days a week. Choose any available physician from the list of practitioners according to your suitable and convenient time.",
  },
  {
    title: "Is my credit card information safe on your site?",
    description:
      "All our online payment transactions are carried out through the secure payment gateway and are Payment Card Industry Certified (PCI DSS Certified). This encrypted set up ensures utmost security and privacy for every transaction. So Go ahead and avail our services with the assurance of a secure and private transaction.",
  },
  {
    title:
      "Will I be charged any additional fee for using online payment option?",
    description:
      "There are no additional charges for using our payment gateways through all available options.",
  },
  {
    title: "My bank is not listed in the online payment option, how do I pay?",
    description:
      "If your bank is not listed in the list of available partners on our website, kindly use an alternative payment option like Debit Card, Credit Card or UPI payment gateways to complete your transaction.",
  },
  {
    title:
      "Is there any doorstep check up available? How much the charges will be?",
    description:
      "We have our Clinic At Home Services where an experienced paramedic or Nurse will reach your residence with a portable device. The Nurse/Paramedic will examine the patient and perform selective tests and examine the patient followed by a Video consultation with the physician on an Ipad. We are launching this service in select cities in the initial phase. This service will be available Pan India shortly. Since this is a doorstep service the pricing will be different from the services available at the Kiosk and the App and website.",
  },
  {
    title:
      "The medicines will be provided/delivered by you after the consultation? Or do we have to buy it from outside?",
    description:
      "Patients who visit the Kiosk can purchase the prescribed medicines instantly at the attached pharmacy. Those who avail video consultation through the Healthuno app can purchase their medicines from our affiliated pharmacy vendors through the app and website from a location nearby which will be home delivered through our partners. Those who have availed the Clinic At Home will get their medicines home delivered through our affiliate partners.",
  },
  {
    title:
      "Are your doctors are qualified enough to treat us? If so how we will know?",
    description:
      "At Healthuno we strive to provide premium consultations to our patients through our network of qualified and certified physicians. Our team have selected a diverse panel of consultants who are registered with their respective state and national medical councils. We perform our due diligence before we onboard our physicians and empanel them with our team. The patients can be assured of authentic, verified and qualified physician consultations through our website, app, Kiosk and Clinic at Home services. We also have a rigorous scrutiny before we onboard our panel of certified staff nurses, paramedical personnel and pharmacy staff to ensure that the patients get the best personnel to serve their healthcare needs.",
  },
  {
    title:
      "Is your company recognized by the government? If so certifications?",
    description:
      "We have obtained the appropriate licenses from the respective State and Central Governments as below: License to operate a Pharmacy from the Drugs Control Department as per the Drugs and Cosmetics Act 1940 and a Sales License, License to operate a clinic from the Health Department as per the Clinical Establishment Act 1997 and Tamil Nadu Clinical Establishment Act 2018 We are a member of the esteemed Telemedicine Society of India which is an elite organization of Telemedicine Healthcare providers in the country.",
  },
];

const FAQ = ({ isProfile }) => {
  const [selectedAccordian, setSelectedAccordian] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  const handleSelectAccordion = (key) => {
    if (selectedAccordian.includes(key)) {
      const accordionStastus = [...selectedAccordian];
      const selectedIndex = accordionStastus.findIndex(
        (element) => element === key
      );
      if (selectedIndex > -1) {
        accordionStastus.splice(selectedIndex, 1);
        setSelectedAccordian(accordionStastus);
      }
    } else {
      setSelectedAccordian([...selectedAccordian, key]);
    }
  };
  return (
    <div
      style={{ width: isProfile && "100%" }}
      // className={`${
      //   location.pathname.includes("patient") && isProfile
      //     ? "edit-patient-container"
      //     : "edit-doctor-container"
      // } FAQ_container `}
      className="edit-patient-container FAQ_container"
    >
      <Row />
      <Row className="FAQ_heading">
        <h2>Frequently Asked Questions</h2>
      </Row>
      <Row className="FAQ_accordion_container">
        <Grid container spacing={2}>
          {data.map((value, i) => (
            <Grid key={i} item lg={6} md={6} sm={12} xs={12}>
              <Accordion className="FAQ_accordion_width">
                <Card className="FAQ_accordion_space">
                  <Accordion.Toggle
                    as={Card.Header}
                    eventKey={i + 1}
                    onClick={() => handleSelectAccordion(i + 1)}
                    className="FAQ_accordion_heading"
                  >
                    <Row className="FAQ_accordion_margin">
                      <Col
                        lg={11}
                        md={11}
                        sm={11}
                        xs={11}
                        style={{ textAlign: "left" }}
                      >
                        <span>{value.title}</span>
                      </Col>
                      <Col
                        lg={1}
                        md={1}
                        sm={1}
                        xs={1}
                        style={{ textAlign: "right" }}
                      >
                        {selectedAccordian.includes(i + 1) ? (
                          <AiOutlineUp />
                        ) : (
                          <AiOutlineDown />
                        )}
                      </Col>
                    </Row>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={i + 1}>
                    <Card.Body className="FAQ_accordion_content">
                      {value.type ? (
                        <a
                          style={{ color: "blue", lineHeight: "65px" }}
                          onClick={() => setModalShow(true)}
                        >
                          <span style={{ textDecoration: "underline" }}>
                            {value.description}
                          </span>
                        </a>
                      ) : (
                        value.description
                      )}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Row>
      <ModalDialog
            modalClassName={"terms-content"}
            isConfirm={true}
            show={modalShow}
            title={"Cancellation Policy"}
            closeDialog={() => {
                setModalShow(false);
            }}
        >
            <IframeModal url={'https://dev.healthuno.com:6002/v1/cancellation_policy'}/>
        </ModalDialog>
    </div>
  );
};

export default FAQ;
