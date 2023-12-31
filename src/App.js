// eslint-disable-next-line react-hooks/exhaustive-deps
import "firebase/messaging";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import firebase, { FIREBASE_VAPID_KEY } from "./notification/firebase";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import OTP from "./patient/view/loginAndRegistration/PatientOTP";
import PrivateRoute from "./hoc/PrivateRoute";
import Registration from "./patient/view/loginAndRegistration/Registration";
import PatientHomePage from "./patient/view/Home/PatientHomePage";
import DoctorLogin from "./doctor/view/DoctorLogin";
import PatientLogin from "./patient/view/loginAndRegistration/PatientLogin";
import DoctorOTP from "./doctor/view/DoctorOTP";
import MultiStepFormRegistration from "./doctor/view/multiStepForm/MultiStepFormRegistration";
import DoctorHomePage from "./doctor/view/Home/DoctorHomePage";
import UpcomingAppointments from "./doctor/view/Home/UpcomingAppointments";
import AppointmentDetail from "./doctor/view/Home/AppointmentDetail";
import Reports from "./doctor/view/Home/Reports";
import VideoMeetingDoctorSide from "./doctor/view/Meeting/VideoMeeting";
import AddDoctor from "./doctor/view/AddDoctor";
import DoctorProfile from "./doctor/view/Profile/DoctorProfile";
import TopConsultants from "./patient/view/Home/TopConsultants";
import Specialities from "./patient/view/Home/Specialities";
import DoctorDetails from "./patient/view/doctorDetail/DoctorDetail";
import PatientSlotBooking from "./patient/view/slotBooking/PatientSlotBooking";
import PatientBookingSummary from "./patient/view/slotBooking/PatientBookingSummary";
import Appointments from "./patient/view/appointment/Appointments";
import VideoMeeting from "./patient/view/Meeting/VideoMeeting";
import AddPrescription from "./doctor/view/Prescription/AddPrescription";
import Report from "./patient/view/Profile/Report";
import PatientProfile from "./patient/view/Profile/PatientProfile";
import PDFViewer from "./commonComponent/PDFViewerScreen";
import NotFoundPage from "./commonComponent/NotFoundPage";
import MainView from "./MainView";
import PrePage from "./patient/view/PrePage";
import { storeData } from "./storage/LocalStorage/LocalAsyncStorage";
import { useToasts } from "react-toast-notifications";
import FAQ from "./FAQ";
import PatientFAQ from "./FAQ/PatientFAQ";
import ReferInvite from "./commonComponent/ReferInvite";
import PhysicianReferralPage from "./commonComponent/PhysicianReferralPage";
import { useEffect } from "react";
import ThankYou from "./patient/view/thankYou";
import PatientDetailView from "./doctor/view/Home/PatientDetailView";

function App() {
  useEffect(() => {
    try {
      if (isSupported()) {
        const messaging = getMessaging(firebase);
        getToken(messaging, { vapidKey: FIREBASE_VAPID_KEY })
          .then((currentToken) => {
            if (currentToken) {
              storeData("PUSH_TOKEN", currentToken);
            } else {
              addToast(
                "No registration token available. Request permission to generate one.",
                { appearance: "error" }
              );
            }
          })
          .catch((err) => {});

        onMessage(messaging, (payload) => {
          addToast(
            <p>
              <b>{payload.notification.title}</b>
              <br />
              {payload.notification.body}
            </p>,
            { appearance: "info" }
          );
        });
      }
    } catch (error) {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { addToast } = useToasts();

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={PrePage} />
          <Route exact path="/refer_invite" component={ReferInvite} />
          <Route
            exact
            path="/physicianReferralProgram"
            component={PhysicianReferralPage}
          />
          <Route exact path="/patient" component={PatientLogin} />
          <Route exact path="/doctor" component={DoctorLogin} />
          <PrivateRoute exact path="/doctor/otp" component={DoctorOTP} />
          <PrivateRoute exact path="/patient/otp" component={OTP} />
          <PrivateRoute
            exact
            path="/doctor/registration"
            component={MultiStepFormRegistration}
          />
          <PrivateRoute
            exact
            path="/patient/registration"
            component={Registration}
          />
          <MainView>
            <Switch>
              <PrivateRoute
                exact
                path="/doctor/home"
                component={DoctorHomePage}
              />
              <PrivateRoute exact path="/doctor/faq" component={FAQ} />
              <PrivateRoute
                exact
                path="/doctor/appointments"
                component={UpcomingAppointments}
              />
              <PrivateRoute
                exact
                path="/doctor/search"
                component={UpcomingAppointments}
              />
              <PrivateRoute
                exact
                path="/doctor/appointmentDetail/:appointment_id"
                component={AppointmentDetail}
              />
              <PrivateRoute
                exact
                path="/doctor/addPrescription/:appointment_id"
                component={AddPrescription}
              />
              <PrivateRoute
                exact
                path="/doctor/reports/:patient_id"
                component={Reports}
              />
              <PrivateRoute exact path="/doctor/reports" component={Reports} />
              <PrivateRoute
                exact
                path="/doctor/view_report"
                component={PDFViewer}
              />
              <PrivateRoute
                exact
                path="/doctor/videoMeeting/:appointment_id"
                component={VideoMeetingDoctorSide}
              />
              <PrivateRoute
                exact
                path="/doctor/select/:appointment_id"
                component={AddDoctor}
              />
              <PrivateRoute
                exact
                path="/doctor/profile/:type"
                component={DoctorProfile}
              />
              <PrivateRoute
                exact
                path="/patient/home"
                component={PatientHomePage}
              />
              <PrivateRoute exact path="/patient/faq" component={PatientFAQ} />
              <PrivateRoute
                exact
                path="/patient/topConsultants"
                component={TopConsultants}
              />
              <PrivateRoute
                exact
                path="/patient/specialities"
                component={Specialities}
              />
              <PrivateRoute
                exact
                path="/patient/doctorDetails/:doctor_id"
                component={DoctorDetails}
              />
              <PrivateRoute
                exact
                path="/patient/slotBooking/:doctor_id"
                component={PatientSlotBooking}
              />
              <PrivateRoute
                exact
                path="/patient/bookingSummary/:doctor_id"
                component={PatientBookingSummary}
              />
              <PrivateRoute
                exact
                path="/patient/appointments/"
                component={Appointments}
              />
              <PrivateRoute
                exact
                path="/patient/videoMeeting/:doctor_id"
                component={VideoMeeting}
              />
              <PrivateRoute
                exact
                path="/doctor/appointmentDetail/:appointment_id/:patient_id"
                component={PatientDetailView}
              />
              {/* <PrivateRoute exact path='/Chat' component={Chat} /> */}
              {/* <PrivateRoute exact path='/patient/profile/invite' component={Invite} /> */}
              <PrivateRoute exact path="/patient/reports" component={Report} />
              <PrivateRoute
                exact
                path="/patient/profile/:type"
                component={PatientProfile}
              />
              <PrivateRoute
                exact
                path="/patient/AddPrescription"
                component={AddPrescription}
              />
              <PrivateRoute
                exact
                path="/patient/reports/view"
                component={PDFViewer}
              />
              <PrivateRoute
                exact
                path="/patient/thankyou/"
                component={ThankYou}
              />
              {/* <PrivateRoute exact path='/patient/profile/upload' component={UploadReport} /> */}
              <Route component={NotFoundPage} isNotFound={true} />
            </Switch>
          </MainView>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
