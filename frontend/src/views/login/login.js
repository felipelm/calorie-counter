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

class Login extends React.Component {
  state = {
    username: '',
    password: '',
  };

  handleLogin = async () => {
    const data = {
      username: this.state.username,
      password: this.state.password,
    };
    const json = await Api.login(data);
    if (json === null) {
      this.setState({ error: "Can't connect to server" });
      return;
    }
    if (!json.user) {
      const { non_field_errors, username, password } = json;
      const errors =
        (non_field_errors ? non_field_errors : '') +
        (username ? 'Username: ' + username : '') +
        (password ? 'Password: ' + password : '');
      this.setState({ error: errors });
    } else {
      localStorage.setItem('auth_token', json.user.token);
      this.props.login();
    }
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleEnter = () => event => {
    if (event.key === 'Enter') {
      this.handleLogin();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h6">Login</Typography>
          <TextField
            id="standard-name"
            label="Username"
            value={this.state.username}
            onChange={this.handleChange('username')}
            onKeyUp={this.handleEnter()}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <TextField
            id="standard-password-input"
            label="Password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange('password')}
            onKeyUp={this.handleEnter()}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <Button
            onClick={this.handleLogin}
            variant="contained"
            color="primary"
          >
            Login
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.left}
            onClick={() => history.push('/register')}
          >
            Signup
          </Button>
          <Typography variant="caption">{this.state.error}</Typography>
        </Paper>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
};

export default withStyles(styles)(Login);
