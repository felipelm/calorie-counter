import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import Api from '../../Api';
import history from '../../history';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 10,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    overflow: 'scroll',
  },
  table: {
    width: '100%',
  },
  icon: {
    cursor: 'pointer',
  },
  green: {
    backgroundColor: 'lightgreen',
  },
  red: {
    backgroundColor: 'red',
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

class Meals extends React.Component {
  componentDidMount() {
    this.getMeals();
  }

  state = {
    meals: [],
    dateFrom: '',
    dateTo: '',
    timeFrom: '',
    timeTo: '',
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  getMeals = async () => {
    const meals = await Api.getMeals(this.state);
    if (meals !== null) this.setState({ meals });
  };

  deleteMeal = async id => {
    await Api.deleteMeal(id);
    this.getMeals();
  };

  createGenerateClassName = status => {
    const { classes } = this.props;
    return status === 0 ? classes.green : classes.red;
  };

  editMeal = id => {
    history.push('meal', id);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h6">Meals</Typography>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="right">Meal</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Time</TableCell>
                <TableCell align="right">Edit</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.meals.map(row => (
                <TableRow
                  className={this.createGenerateClassName(row.status)}
                  key={row.id}
                >
                  <TableCell align="right">{row.meal_text}</TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.meal_date}</TableCell>
                  <TableCell align="right">{row.meal_time}</TableCell>
                  <TableCell align="right">
                    <Icon
                      className={classes.icon}
                      onClick={() => this.editMeal(row.id)}
                    >
                      edit
                    </Icon>
                  </TableCell>
                  <TableCell align="right">
                    <Icon
                      className={classes.icon}
                      onClick={() => this.deleteMeal(row.id)}
                    >
                      remove_circle
                    </Icon>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className={classes.controls}>
            <TextField
              label="From"
              type="date"
              onChange={this.handleChange('dateFrom')}
              InputLabelProps={{ shrink: true }}
              value={this.state.dateFrom}
              margin="normal"
            />
            <TextField
              label="To"
              type="date"
              onChange={this.handleChange('dateTo')}
              InputLabelProps={{ shrink: true }}
              value={this.state.dateTo}
              margin="normal"
            />
            <TextField
              label="From"
              type="time"
              onChange={this.handleChange('timeFrom')}
              InputLabelProps={{ shrink: true }}
              value={this.state.timeFrom}
              margin="normal"
            />
            <TextField
              label="To"
              type="time"
              onChange={this.handleChange('timeTo')}
              InputLabelProps={{ shrink: true }}
              value={this.state.timeTo}
              margin="normal"
            />
            <Button onClick={this.getMeals} variant="contained" size="small">
              Filter
            </Button>
          </div>
        </Paper>
      </div>
    );
  }
}

Meals.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Meals);
