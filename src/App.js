import { BrowserRouter, Route } from "react-router-dom";
import Homepage from "./patient/view/HomePage";
import OTP from "./patient/view/OTP";
import PrivateRoute  from './patient/hoc/PrivateRoute';
import Registration from './patient/view/Registration'
import MainPage from "./patient/view/MainPage";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Route exact path="/" component={Homepage} />
          <PrivateRoute exact path='/otp' component={OTP} />
          <PrivateRoute exact path='/registration' component={Registration} />
          <PrivateRoute exact path='/home' component={MainPage} />
        </BrowserRouter>
    </div>
  );
}

export default App;
