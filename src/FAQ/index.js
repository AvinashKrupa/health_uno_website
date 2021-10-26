import "./style_FAQ.scss";
import { Row, Col, Accordion, Card } from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const data = [
  {
    title: "What is HealthUno?",
    description:
      "HealthUno is a Teleconsultation Platform which provides a High Quality Video consultation interface to consult your patients virtually at your convenience. It also includes an integrated Medical Records management interface which can be used to give instant digital prescriptions to your patients. You can view your patient’s medical records and keep track of their visits and follow up appointments through the app. You can also view and store the patient’s medical records, lab reports and investigations through our app.",
  },
  {
    title: "How do I access Healthuno app?",
    description:
      "For Android users, download the Healthuno App from the Google Playstore. After downloading the app, you can register by submitting your details in the app. Our Onboarding team will them get in touch with you once your details are verified and then you can start using our app for consulting your patients. For IoS users, you can download the Healthuno app from the Apple Playstore. After downloading and registration, our onboarding team will verify your details. Once the process is complete, you can start consulting your patients. Doctors can also login to the Healthuno Website from the URL Https://www.healthuno.com and can click on the “Are You a Doctor” section from the landing page. You can enter your details here after which our Onboarding team will verify your details. After processing your application, you can join our team of ever growing consultants.",
  },
  {
    title: "When can the patients use this app?",
    description:
      "Healthuno app can be used by patients for new consultations or follow up consultations. They can consult you from their locations of choice without waiting in queues and maintaining appropriate social distancing norms.",
  },
  {
    title: "How do I charge for the consultation?",
    description:
      "At Healthuno, the consultants have the freedom of deciding their own consultation fees. The consultants can decide their own fees and update the Healthuno team which will be displayed on the app and website. Consultants also have the option of revising their consultation charges from time to time after informing the Healthuno Customer care team.",
  },
  {
    title: "What if I cannot dedicate a particular time on this platform?",
    description:
      "At Healthuno we understand the busy schedules of the physicians and we have tried to implement the best time management solutions in our app and website to make it hassle free for the physicians and patients to use our app and website. There are no minimum or maximum working hours needed for physicians to be able to get listed in our app. Physicians can spend as less as an hour to twelve hours and more on our app as per their availability. They also have the option of having flexible schedules on the app and website. For example, a physician can consult for five hours on the weekends and two hours on the weekdays as per their schedule. Physicians using Healthuno have complete freedom to decide their own schedules and appointment calendars based on their availability and other commitments, both personal and professional. You can get in touch with our Customer Care team to customize your preferred schedule for the whole week and list your availability on our platform.",
  },
  {
    title: "What if my internet speed is slow?",
    description:
      "Our Software team has designed the Healthuno app to handle different kinds of traffic and scale as per the connection speeds accordingly. Just Like few OTT platforms adjust the video streaming quality according to the available bandwidth, our app scales the video quality according to the current bandwidth and adjusts the video streaming quality to match the current speeds. This ensures you have uninterrupted video calls with your patients.",
  },
  {
    title: "How do patients pay for the online consultation through this app?",
    description:
      "Patients have the option of paying through Netbanking, Debit Cards, Credit Cards, UPI interface and all available E wallet services like PhonePe and Paytm.",
  },
  {
    title:
      "What do I do if I am not available during the appointment with the patients?",
    description:
      "We understand the busy schedules of our partner physicians and have designed our whole interface to be as convenient as possible with excellent scheduling and time management options. There can be unforeseen and unavoidable circumstances where a physician will not be able to attend their booked appointments due to the aforementioned reasons. In this eventuality, we have a specific cancellation and rescheduling policy for the Healthuno Physicians which can be read here –",
  },
  {
    title: "I am already with another platform why should I choose yours?",
    description:
      "We at Healthuno have worked hard to make the experience for our users, physicians and patients a unique and pleasant one which is completely different from other available services. Few features which are unique to our platform are A: We do not charge any annual subscription fees or one-time payment charges from our physicians. The platform is completely free of charge to use. B: Physicians can decide their own consultation fees and are free to modify it later after updating the Customer care team regarding the same. C: We do not have a policy of actively promoting physicians on our website with paid promotions and targeted advertisements. We at Healthuno will only advertise our website and app and all physicians using the app will have an equal opportunity to be chosen by the patients using the app instead of a select few who will be highlighted after paying a premium to the platform providers. Physicians will be receiving referrals and patients from an unfiltered ad campaign targeted to the general public and they will receive more patients based on their usage and service provided similar to the brick and mortar clinical settings. D: Our Video consultation software has undergone rigorous testing and multiple trials before we have launched to ensure an uninterrupted hassle free experience for the end users, so we can assure a glitch free and smooth consultation on our platform. E: We are constantly updating the app and website and will be adding new and unique features exclusive to our app in the near future. Join our team of ever growing physicians and stay ahead of your peers and updated in the circle of tech savvy physicians. F: Privacy is a very important factor which we have added to our app. The patient will never be able to view the Physician’s contact details and any communication with the consultant will be through the app be it a video consultation or chat. The physician can access the patient’s details but the patient will not have access to the physician’s contact details ensuring that your work stays put within your designated work hours and does not get carried over to your personal time. You can get the best work life balance as our app ensures that your work remains siloed within the defined schedules and does not spill over to your other commitments.",
  },
  {
    title:
      "Can I give a manual prescription to the patient if the medicine I want to prescribe to the patient’s not on the platform?",
    description:
      "At Healthuno we strive to make things easier and swift for the users. The prescription interface in our platform has an exhaustive database of all the commonly prescribed medications both as generic and branded varieties which can be used by the consultants. In the rare instance where a particular medicine is not available on our database, the physician can add the new medicine to our database and can use it for their prescriptions now and in the future. This is designed in such a manner that the physicians spend a minimum amount of time in their documentation and can allocate more time to interact with their patients. There is also an option of manually uploading a written prescription to the current consultation but due to the aforementioned reasons, we discourage physicians from doing it. You can however use the functionality as per your preference at the cost of increased time spent post consultation with paperwork.",
  },
  {
    title:
      "Can we have an option to extend the consultation time in slots of 5/10/15min which can be made visible to the patient?",
    description:
      "The platform has set a default time of 10-15 minutes per consultation to optimize the number of consultations done per hour which is similar to the physical consultations done at the clinic. There is an option to increase the consultation timings to more than the predefined timings which can be configured after speaking with our customer care team. You can increase or decrease your default consultation timings based on your preferences after speaking with the customer support team. Please be aware that if your current consultation timings go beyond the next patient on the queue, you will receive an email and SMS reminder about your next appointment and you will have to close the current session with the patient to enable the next patient to consult you.",
  },
  {
    title: "How many doctors are there in your platform?",
    description:
      "We are a rapidly growing platform. We currently have 300 physicians from diverse specialties on our platform and even more physicians are joining our team daily.",
  },
  {
    title: "How do I know that a patient is waiting for me for appointment?",
    description:
      "When a patient books an appointment with you, an Email and SMS notification with the complete details will be shared with you and the patient. You can then view the patient’s details and any additional documents the patient has uploaded to be viewed prior to the consultation on your Patient queue on the app and website. Ten minutes prior to the consultation, a reminder SMS and email will be sent to the patient and the consultant. If the consultant does not begin the consultation on time, after a five minute delay an automated IVR call will be initiated from the backend where the patient can call the physician and ask them to begin the video consultation. Note that this call will be a system generated call and the patient will not be getting your contact details nor will your contact details be shared with the patients at any point of time. Interaction with the patient and physician will always happen through the app and website. We also encourage our partner physicians to not share their contact details with the patient to ensure this stays balanced.",
  },

  {
    title: "Why is HealthUno giving the doctors a free platform?",
    description:
      "We are a passionate team of personnel who want to create a swift, hassle free and easily accessible experience for patients to get video consultations and instant access to quality physicians. We also strive to give our physicians a unique one of a kind experience on our platform which is found nowhere else and will also enable them to utilize their skills more effectively. Our revenue model is based on the number of patients using the app for consultations. We want to give our physicians the best technology to help them see more patients in a more easy and comfortable manner. Our model does not charge the physicians because A: We want to create an equal platform for all our physicians and it would be against our principles to create separate paid premium channels for physicians to advertise and stand out from the rest as available on other platforms. B: More the number of physicians we have on our platform, the more we grow as a company. Our platform has many unique features which are not available elsewhere and we will be constantly adding new features which will be innovative and revolutionize the way in which physicians will consult their patients. Hence we have decided to offer our platform absolutely free for our consultants.",
  },
  {
    title: "Can I get patients from only a particular locations?",
    description:
      "Healthuno is a Pan India app and website where we have 300+ physicians from various parts of India onboard in multiple specialties. The very purpose of digital healthcare is to break the boundaries of accessibility and universal outreach to those who need healthcare services. Our app and website can be used by anyone and the only possible barriers to using the app would be linguistic in nature, hence you can get your next patient from the Lovely valleys of Ladakh or the serene shores of Dhanushkodi. We are not bound by geographical constraints so you can expect patients from all over India to consult you through the app.",
  },
];

const FAQ = ({ isProfile }) => {
  const location = useLocation();
  const [selectedAccordian, setSelectedAccordian] = useState([]);

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
      className={`${
        location.pathname.includes("patient") && isProfile
          ? "edit-patient-container"
          : "edit-doctor-container"
      } FAQ_container `}
    >
      <Row />
      <Row className="FAQ_heading">
        <h2>Frequently Asked Questions</h2>
      </Row>
      <Row className="FAQ_accordion_container">
        <Grid container spacing={2}>
          {data.map((value, i) => (
            <Grid item lg={6} md={6} sm={12} xs={12}>
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
                      {value.description}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Row>
    </div>
  );
};

export default FAQ;
