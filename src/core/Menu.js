import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import {Link, useLocation} from 'react-router-dom'
// import { useNavigate } from 'react-router';

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const {pathname} = useLocation();
    return (
      <Component
        pathname={pathname}
        {...props}
        />
    );
  };
  
  return Wrapper;
};

const isActive = (pathname, path) => {
  if (pathname === path)
    return {color: '#ff4081'}
  else
    return {color: '#ffffff'}
}
const Menu = withRouter(({pathname}) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" color="inherit">
        MERN Skeleton
      </Typography>
      <Link to="/">
        <IconButton aria-label="Home" style={isActive(pathname, "/")}>
          <HomeIcon/>
        </IconButton>
      </Link>
      <Link to="/users">
        <Button style={isActive(pathname, "/users")}>Users</Button>
      </Link>
      {
        !auth.isAuthenticated() && (<span>
          <Link to="/signup">
            <Button style={isActive(pathname, "/signup")}>Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(pathname, "/signin")}>Sign In
            </Button>
          </Link>
        </span>)
      }
      {
        auth.isAuthenticated() && (<span>
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button style={isActive(pathname, "/user/" + auth.isAuthenticated().user._id)}>My Profile</Button>
          </Link>
          <Button color="inherit" onClick={() => {
              auth.clearJWT(() => pathname.push('/'))
            }}>Sign out</Button>
        </span>)
      }
    </Toolbar>
  </AppBar>
))

export default Menu
