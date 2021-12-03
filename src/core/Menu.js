import React from 'react'
import auth from './../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'
import './menu.css';

const isActive = (history, path) => {
  if (history.location.pathname === path)
    return {color: '#6C63FF'}
  else
    return {color: '#000'}
}
const Menu = withRouter(({history}) => (
  <nav className="nav-menu">
    <ul>
     <Link to="/" className="nav-item" style={isActive(history, "/")}> <li>Home</li></Link>
      {!auth.isAuthenticated() && <>
        <Link to="/signup" className="nav-item" style={isActive(history, "/signup")}><li>Sign Up</li></Link>
        <Link to="/signin" className="nav-item" style={isActive(history, "/signin")}><li>Sign In</li></Link>
        </>}
        {
        auth.isAuthenticated() && (<>
          <Link to={"/user/" + auth.isAuthenticated().user._id} className="nav-item" style={isActive(history, "/user/" + auth.isAuthenticated().user._id)}>
            My Profile
          </Link>
          <button  className="btn-primary" onClick={() => {
              auth.clearJWT(() => history.push('/'))
            }}>Sign out</button>
        </>)
      }
    </ul>
  </nav>
))

export default Menu
