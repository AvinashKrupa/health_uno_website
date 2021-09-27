import 'firebase/messaging';
import {getMessaging, getToken, onMessage} from "firebase/messaging";
import firebase, {FIREBASE_VAPID_KEY} from "./notification/firebase";
import {BrowserRouter, Route} from "react-router-dom";
import OTP from "./patient/view/loginAndRegistration/PatientOTP";
import PrivateRoute from './hoc/PrivateRoute';
import Registration from './patient/view/loginAndRegistration/Registration'
import PatientHomePage from "./patient/view/Home/PatientHomePage";
import DoctorLogin from "./doctor/view/DoctorLogin";
import PatientLogin from './patient/view/loginAndRegistration/PatientLogin';
import DoctorOTP from "./doctor/view/DoctorOTP";
import MultiStepFormRegistration from "./doctor/view/multiStepForm/MultiStepFormRegistration";
import DoctorHomePage from "./doctor/view/Home/DoctorHomePage";
import UpcomingAppointments from "./doctor/view/Home/UpcomingAppointments";
import AppointmentDetail from "./doctor/view/Home/AppointmentDetail";
import Reports from "./doctor/view/Home/Reports";
import VideoMeetingDoctorSide from "./doctor/view/Meeting/VideoMeeting";
import AddDoctor from "./doctor/view/AddDoctor";
import DoctorProfile from "./doctor/view/Profile/DoctorProfile";
import TopConsultants from './patient/view/Home/TopConsultants';
import Specialities from './patient/view/Home/Specialities'
import DoctorDetails from "./patient/view/doctorDetail/DoctorDetail";
import PatientSlotBooking from "./patient/view/slotBooking/PatientSlotBooking";
import PatientBookingSummary from "./patient/view/slotBooking/PatientBookingSummary";
import Appointments from "./patient/view/appointment/Appointments";
import VideoMeeting from "./patient/view/Meeting/VideoMeeting";
import AddPrescription from "./doctor/view/Prescription/AddPrescription";
import Report from "./patient/view/Profile/Report";
import PatientProfile from "./patient/view/Profile/PatientProfile";
import PDFViewer from "./commonComponent/PDFViewerScreen";
import MainView from "./MainView";
import PrePage from "./patient/view/PrePage";
import {storeData} from "./storage/LocalStorage/LocalAsyncStorage";
import {useToasts} from "react-toast-notifications";


function App() {
  const {addToast} = useToasts();
  const messaging = getMessaging(firebase);
  getToken(messaging, {vapidKey: FIREBASE_VAPID_KEY}).then((currentToken) => {
    if (currentToken) {
      storeData('PUSH_TOKEN', currentToken);
    } else {
      addToast('No registration token available. Request permission to generate one.', {appearance: "error"});
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
  });

  onMessage(messaging, (payload) => {
    addToast(`${payload.notification.title}\n\n${payload.notification.body}`, {appearance: "info"});
  });
  return (
      <div className="App">
        <BrowserRouter>
          <Route exact path="/" component={PrePage}/>
          <Route exact path="/patient" component={PatientLogin}/>
          <Route exact path="/doctor" component={DoctorLogin}/>
          <PrivateRoute exact path='/doctor/otp' component={DoctorOTP}/>
          <PrivateRoute exact path='/patient/otp' component={OTP}/>
          <PrivateRoute exact path='/doctor/registration' component={MultiStepFormRegistration}/>
          <PrivateRoute exact path='/patient/registration' component={Registration}/>
          <MainView>
            <PrivateRoute exact path="/doctor/home" component={DoctorHomePage}/>
            <PrivateRoute exact path='/doctor/appointments' component={UpcomingAppointments}/>
            <PrivateRoute exact path='/doctor/search' component={UpcomingAppointments}/>
            <PrivateRoute exact path='/doctor/appointmentDetail/:appointment_id' component={AppointmentDetail}/>
            <PrivateRoute exact path='/doctor/addPrescription/:appointment_id' component={AddPrescription}/>
            <PrivateRoute exact path='/doctor/reports/:patient_id' component={Reports}/>
            <PrivateRoute exact path='/doctor/reports' component={Reports}/>
            <PrivateRoute exact path='/doctor/view_report' component={PDFViewer}/>
            <PrivateRoute exact path='/doctor/videoMeeting/:appointment_id' component={VideoMeetingDoctorSide}/>
            <PrivateRoute exact path='/doctor/select/:appointment_id' component={AddDoctor}/>
            <PrivateRoute exact path='/doctor/profile/:type' component={DoctorProfile}/>
            <PrivateRoute exact path='/patient/home' component={PatientHomePage}/>
            <PrivateRoute exact path='/patient/topConsultants' component={TopConsultants}/>
            <PrivateRoute exact path='/patient/specialities' component={Specialities}/>
            <PrivateRoute exact path='/patient/doctorDetails/:doctor_id' component={DoctorDetails}/>
            <PrivateRoute exact path='/patient/slotBooking/:doctor_id' component={PatientSlotBooking}/>
            <PrivateRoute exact path='/patient/bookingSummary/:doctor_id' component={PatientBookingSummary}/>
            <PrivateRoute exact path='/patient/appointments/' component={Appointments}/>
            <PrivateRoute exact path='/patient/videoMeeting/:doctor_id' component={VideoMeeting}/>
            {/* <PrivateRoute exact path='/Chat' component={Chat} /> */}
            {/* <PrivateRoute exact path='/patient/profile/invite' component={Invite} /> */}
            <PrivateRoute exact path='/patient/reports' component={Report}/>
            <PrivateRoute exact path='/patient/profile/:type' component={PatientProfile}/>
            <PrivateRoute exact path='/patient/AddPrescription' component={AddPrescription}/>
            <PrivateRoute exact path='/patient/PDF' component={PDFViewer}/>
            {/* <PrivateRoute exact path='/patient/profile/upload' component={UploadReport} /> */}

          </MainView>
          {/* <Route component={NotFoundPage} /> */}
        </BrowserRouter>
      </div>
  );
}

export default App;
