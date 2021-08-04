import React from 'react';
import ReactDOM from 'react-dom';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import index from './patient/styles/index';
import App from './App';
import {AuthContextProvider} from './context/AuthContextProvider';
import { ToastProvider } from 'react-toast-notifications';
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.render(
  <React.StrictMode>
     <AuthContextProvider>
        <ToastProvider autoDismiss={true}>
         <App />
        </ToastProvider>
     </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
