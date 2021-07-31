import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from '../context/AuthContextProvider';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  
  /**
   * If the user not authenticated then redirect to login page
   */
  return (
    <Route {...rest} render={props =>
      authContext && !authContext.isAuthenticated  ? (
        authContext.phone ? <Component {...props} /> :  <Redirect to='/'/>
      ) : (
        <Component {...props} />
      )
    }
    />
  );
};

export default PrivateRoute;