import React from 'react'
import {Navigate} from 'react-router';
import {useLocation} from 'react-router-dom';
import auth from './auth-helper'

const PrivateRoute = ({ children }) => {
  let location = useLocation();
  console.log(location);
  return auth.isAuthenticated() ? children : <Navigate to={{pathname: "/signin", state: {from: location}}}/>
}


export default PrivateRoute
