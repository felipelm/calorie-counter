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

function formatTime(time) {
  return String(time).padStart(2, '0');
}

class Meal extends React.Component {
  state = {
    id: undefined,
    name: '',
    time:
      formatTime(new Date().getHours()) +
      ':' +
      formatTime(new Date().getMinutes()),
    date: new Date().toISOString().split('T')[0],
    calories: 0,
  };

  componentDidMount() {
    this.getMeal();
  }

  getMeal = async () => {
    if (history.location.state !== undefined) {
      const meal = await Api.getMeal(history.location.state);
      this.setState({
        id: meal.id,
        name: meal.meal_text,
        time: meal.meal_time,
        date: meal.meal_date,
        calories: meal.calories,
      });
    }
  };

  handleEnter = () => event => {
    if (event.key === 'Enter') {
      this.handleSave();
    }
  };

  handleSave = async () => {
    const data = {
      meal_text: this.state.name,
      meal_time: this.state.time,
      meal_date: this.state.date,
      calories: this.state.calories,
    };
    if (this.state.id !== undefined) {
      Api.updateMeal(data, this.state.id);
    } else {
      Api.saveMeal(data);
    }
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  formatCalories = calories => {
    if (calories === '') return '';
    return parseInt(calories);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h6">Add Meal</Typography>
          <TextField
            id="name"
            label="Name"
            value={this.state.name}
            onKeyUp={this.handleEnter()}
            onChange={this.handleChange('name')}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <TextField
            id="date"
            label="Date"
            type="date"
            onKeyUp={this.handleEnter()}
            onChange={this.handleChange('date')}
            value={this.state.date}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <TextField
            id="time"
            label="Time"
            type="time"
            onKeyUp={this.handleEnter()}
            onChange={this.handleChange('time')}
            value={this.state.time}
            margin="normal"
            fullWidth
            variant="outlined"
          />
          <TextField
            id="calories"
            label="Calories"
            type="number"
            value={this.formatCalories(this.state.calories)}
            onKeyUp={this.handleEnter()}
            onChange={this.handleChange('calories')}
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

Meal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Meal);
