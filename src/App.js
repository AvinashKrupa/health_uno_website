import { BrowserRouter, Route } from "react-router-dom";
import OTP from "./patient/view/loginAndRegistration/PatientOTP";
import PrivateRoute  from './hoc/PrivateRoute';
import Registration from './patient/view/loginAndRegistration/Registration'
import PatientHomePage from "./patient/view/Home/PatientHomePage";
import DoctorLogin from "./doctor/view/DoctorLogin";
import Homepage from './patient/view/loginAndRegistration/PatientLogin';
import DoctorOTP from "./doctor/view/DoctorOTP";
import MultiStepFormRegistration from "./doctor/view/multiStepForm/MultiStepFormRegistration";
import DoctorHomePage from './doctor/view/DoctorHomePage';
import TopConsultants from './patient/view/Home/TopConsultants';
import Specialities from './patient/view/Home/Specialities'
import DoctorDetails from "./patient/view/doctorDetail/DoctorDetail";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/doctor/homePage" component={DoctorHomePage} />
          <Route exact path="/doctor" component={DoctorLogin} />
          <PrivateRoute exact path='/doctor-otp' component={DoctorOTP} />
          <PrivateRoute exact path='/doctor/registration' component={MultiStepFormRegistration} />
          <PrivateRoute exact path='/otp' component={OTP} />
          <PrivateRoute exact path='/registration' component={Registration} />
          <PrivateRoute exact path='/patient/home' component={PatientHomePage} />
          <PrivateRoute exact path='/patient/topConsultants' component={TopConsultants} />
          <PrivateRoute exact path='/patient/specialities' component={Specialities} />
          <PrivateRoute exact path='/patient/doctorDetails/:doctor_id' component={DoctorDetails} />
        </BrowserRouter>
    </div>
  );
}

export default App;
