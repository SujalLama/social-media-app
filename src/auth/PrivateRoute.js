import React, { Component } from 'react'
import {Navigate} from 'react-router';
import auth from './auth-helper'

const PrivateRoute = ({ children }) => (
  auth.isAuthenticated() ? children : <Navigate to="/signin" />
)

export default PrivateRoute
