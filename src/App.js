import { BrowserRouter, Route } from "react-router-dom";
import OTP from "./patient/view/OTP";
import PrivateRoute  from './hoc/PrivateRoute';
import Registration from './patient/view/Registration'
import MainPage from "./patient/view/MainPage";
import DoctorLogin from "./doctor/view/DoctorLogin";
import Homepage from './patient/view/HomePage';
import DoctorOTP from "./doctor/view/DoctorOTP";
import MultiStepFormRegistration from "./doctor/view/multiStepForm/MultiStepFormRegistration";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          {/* <Route exact path="/" component={Homepage} /> */}
          <Route exact path="/" component={MainPage} />
          <Route exact path="/doctor" component={DoctorLogin} />
          <PrivateRoute exact path='/doctor-otp' component={DoctorOTP} />
          <PrivateRoute exact path='/doctor/registration' component={MultiStepFormRegistration} />
          <PrivateRoute exact path='/otp' component={OTP} />
          <PrivateRoute exact path='/registration' component={Registration} />
          <PrivateRoute exact path='/home' component={MainPage} />
        </BrowserRouter>
    </div>
  );
}

export default App;
