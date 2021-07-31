import React, { Component, createContext } from 'react';

const AuthContext = createContext();

class AuthContextProvider extends Component {
  state = {
    isAuthenticated: false,
    phone: '',
  }

  setAuth = (isAuthenticated) => {
    this.setState({ isAuthenticated });
  }

  setPhone = (phone) => {
    this.setState({ phone });
  }

  render() { 
    return (
      <AuthContext.Provider value={{...this.state, setAuth: this.setAuth, setPhone: this.setPhone}}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
 
export  {AuthContextProvider, AuthContext};