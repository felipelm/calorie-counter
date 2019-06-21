import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  root: {
    display: 'flex',
  },
  right: {
    justifyContent: 'space-between',
  },
  icon: {
    paddingRight: 5,
    paddingLeft: 5,
    cursor: 'pointer',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
  },
  hello: {
    color: 'white',
  },
});

const apiUrl =
  process.env.NODE_ENV !== 'development'
    ? window.origin + '/api/'
    : process.env.REACT_APP_API_URL;

function App(props) {
  return (
    <div>
      <AppBar className={props.classes.root} position="static">
        <Toolbar className={props.classes.right}>
          {props.username !== '' ? (
            <Typography className={props.classes.hello} variant="h6">
              Hello, {props.username}
            </Typography>
          ) : (
            <div />
          )}
          <div>
            <Link className={props.classes.link} to="/meal">
              <Icon className={props.classes.icon}>add</Icon>
            </Link>
            <Link className={props.classes.link} to="/meals">
              <Icon className={props.classes.icon}>list</Icon>
            </Link>
            <Link className={props.classes.link} to="/settings">
              <Icon className={props.classes.icon}>settings</Icon>
            </Link>
            {props.isManager ? (
              <Link className={props.classes.link} to="/users">
                <Icon className={props.classes.icon}>person</Icon>
              </Link>
            ) : null}
            {props.isAdmin ? (
              <a
                className={props.classes.link}
                href={apiUrl + 'admin/'}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon className={props.classes.icon}>star</Icon>
              </a>
            ) : null}

            <Icon onClick={props.logout} className={props.classes.icon}>
              logout
            </Icon>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isManager: PropTypes.bool.isRequired,
};

export default withStyles(styles)(App);
