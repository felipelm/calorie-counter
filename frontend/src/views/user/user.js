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

class User extends React.Component {
  state = {
    username: '',
    email: '',
    id: undefined,
  };

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    if (history.location.state !== undefined) {
      const user = await Api.getUser(history.location.state);
      this.setState({
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
      });
    }
  };

  handleSave = async () => {
    const data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };
    if (this.state.id !== undefined) {
      Api.updateUser(data, this.state.id);
    }
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleEnter = () => event => {
    if (event.key === 'Enter') {
      this.handleSave();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h6">Edit User</Typography>
          <TextField
            label="Username"
            value={this.state.username}
            onChange={this.handleChange('username')}
            onKeyUp={this.handleEnter()}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Email"
            value={this.state.email}
            onKeyUp={this.handleEnter()}
            onChange={this.handleChange('email')}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <Button onClick={this.handleSave} variant="contained" color="primary">
            Save
          </Button>
          <Typography variant="caption">{this.state.error}</Typography>
        </Paper>
      </div>
    );
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(User);
