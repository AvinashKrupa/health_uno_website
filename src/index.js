import React from 'react';
import ReactDOM from 'react-dom';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import index from './patient/styles/index';
import App from './App';
import {AuthContextProvider} from './context/AuthContextProvider';
import { ToastProvider } from 'react-toast-notifications';
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.render(
  <>
     <AuthContextProvider>
        <ToastProvider autoDismiss={true}>
         <App />
        </ToastProvider>
     </AuthContextProvider>
  </>,
  document.getElementById('root')
);
