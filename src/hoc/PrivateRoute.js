import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from '../context/AuthContextProvider';
import { getData } from '../storage/LocalStorage/LocalAsyncStorage';
import jwt_decode from "jwt-decode";

const PrivateRoute = ({ component: Component, ...rest }) => {

  var token = jwt_decode(getData('ACCESS_TOKEN'));
  const authContext = useContext(AuthContext);
  console.log('User Is Valid', new Date(token.exp * 1000) > new Date(new Date().getTime()));

  /**
   * If the user not authenticated then redirect to login page
   */
  return (
    <Route {...rest} render={props =>
      (token &&  new Date(token.exp * 1000) >  new Date(new Date().getTime())) ?  <Component {...props} /> :
      authContext && !authContext.isAuthenticated  ? (
        authContext.phone ? <Component {...props} /> :  <Redirect to='/'/>
      ) :  (
        <Redirect to='/'/>
      )
    }
    />
  );

  // <Route {...rest} render={props =>
  //   authContext && !authContext.isAuthenticated  ? (
  //     authContext.phone ? <Component {...props} /> :  <Redirect to='/doctor'/>
  //   ) : (
  //     <Component {...props} />
  //   )
  // }
  // />
};

export default PrivateRoute;