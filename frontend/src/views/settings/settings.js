import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Api from '../../Api';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 10,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 10,
    marginRight: theme.spacing.unit * 10,
  },
});

class Settings extends React.Component {
  state = {
    dailyCalories: this.props.dailyCalories,
  };

  handleChange = name => event => {
    if (event.key === 'Enter') {
      this.saveSettings();
    }
    this.setState({ [name]: event.target.value });
  };

  handleEnter = () => event => {
    if (event.key === 'Enter') {
      this.saveSettings();
    }
  };

  saveSettings = async () => {
    const data = {
      daily_calories: this.state.dailyCalories,
    };
    this.props.updateDailyCalories(this.state.dailyCalories);
    await Api.updateSettings(data);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h6">User Settings</Typography>
          <TextField
            id="standard-name"
            label="Set number of calories per day"
            value={this.state.dailyCalories}
            onChange={this.handleChange('dailyCalories')}
            onKeyUp={this.handleEnter()}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <Button
            onClick={this.saveSettings}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </Paper>
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
  dailyCalories: PropTypes.string.isRequired,
  updateDailyCalories: PropTypes.func.isRequired,
};

export default withStyles(styles)(Settings);
