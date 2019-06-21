import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme/MaterialTheme';
import Menu from './views/menu/menu';
import Login from './views/login/login';
import Signup from './views/signup/signup';
import Meal from './views/meal/meal';
import Meals from './views/meals/meals';
import User from './views/user/user';
import Users from './views/users/users';
import Settings from './views/settings/settings';
import { Router, Route } from 'react-router-dom';
import history from './history';
import Api from './Api';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyCalories: '',
      username: '',
      isAdmin: false,
      isManager: false,
    };
  }

  componentDidMount() {
    this.checkLogin();
  }

  checkLogin = async () => {
    const loggedin = await Api.checkLogin();
    if (loggedin === null || loggedin.status !== 200) {
      const { pathname } = history.location;
      if (pathname !== '/login' && pathname !== '/register') {
        history.push('/login');
      }
    } else {
      const json = await loggedin.json();
      this.setState({
        dailyCalories: json.daily_calories.toString(),
        username: json.username,
        isAdmin: json.is_staff,
        isManager: json.is_manager,
      });
    }
  };

  handleLogout = () => {
    this.setState({
      dailyCalories: '',
      username: '',
    });
    localStorage.removeItem('auth_token');
    history.push('/login');
  };

  handleLogin = () => {
    this.checkLogin();
    history.push('/meals');
  };

  updateDailyCalories = dailyCalories => {
    this.setState({ dailyCalories });
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          {this.state.username !== '' ? (
            <Menu
              isAdmin={this.state.isAdmin}
              isManager={this.state.isManager}
              username={this.state.username}
              logout={this.handleLogout}
            />
          ) : null}
          <Route
            path="/login"
            exact
            component={() => <Login login={this.handleLogin} />}
          />
          <Route
            path="/register"
            exact
            component={() => <Signup login={this.handleLogin} />}
          />
          <Route path="/meals" component={Meals} />
          <Route path="/meal" component={Meal} />
          <Route path="/users" component={Users} />
          <Route path="/user" component={User} />
          <Route
            path="/settings"
            component={() => (
              <Settings
                dailyCalories={this.state.dailyCalories}
                updateDailyCalories={this.updateDailyCalories}
              />
            )}
          />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
