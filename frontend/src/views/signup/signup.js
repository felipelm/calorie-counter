import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Api from '../../Api';
import history from '../../history';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 10,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 10,
    marginRight: theme.spacing.unit * 10,
  },
  left: {
    float: 'right',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
});

class Signup extends React.Component {
  state = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    error: '',
  };

  handleSignup = async () => {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: 'Password and confirmation does not match' });
      return null;
    }
    const data = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
    };
    const json = await Api.signup(data);
    if (!json.token) {
      const { non_field_errors, username, password, email } = json;
      const errors =
        (non_field_errors ? non_field_errors : '') +
        (username ? 'Username: ' + username : '') +
        (password ? 'Password: ' + password : '') +
        (email ? 'Email: ' + email : '');
      this.setState({ error: errors });
    } else {
      localStorage.setItem('auth_token', json.token);
      this.props.login();
    }
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleEnter = () => event => {
    if (event.key === 'Enter') {
      this.handleSignup();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h6">Register</Typography>
          <TextField
            id="standard-name"
            label="Username"
            onKeyUp={this.handleEnter()}
            onChange={this.handleChange('username')}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <TextField
            id="outlined-email-input"
            label="Email"
            type="email"
            onKeyUp={this.handleEnter()}
            onChange={this.handleChange('email')}
            name="email"
            autoComplete="email"
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <TextField
            id="standard-password-input"
            label="Password"
            type="password"
            onChange={this.handleChange('password')}
            onKeyUp={this.handleEnter()}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <TextField
            id="standard-confirm-password-input"
            label="Confirm Password"
            type="password"
            onChange={this.handleChange('confirmPassword')}
            onKeyUp={this.handleEnter()}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <Button
            onClick={this.handleSignup}
            variant="contained"
            color="primary"
          >
            Register
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.left}
            onClick={() => history.push('/login')}
          >
            Login
          </Button>
          <Typography variant="caption">{this.state.error}</Typography>
        </Paper>
      </div>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
};

export default withStyles(styles)(Signup);
