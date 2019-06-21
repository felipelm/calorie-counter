import React from 'react';
import Users from '../../views/users/users';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import theme from '../../theme/MaterialTheme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Router } from 'react-router-dom';
import history from '../../history';
import Api from '../../Api';

configure({ adapter: new Adapter() });

jest.mock('../../history', () => {
  return {
    push: jest.fn(),
    listen: jest.fn(),
    location: { pathname: jest.fn() },
  };
});

jest.mock('../../Api', () => {
  return {
    deleteUser: jest.fn(),
    getUsers: jest.fn(() => {
      return [
        {
          id: 3,
          url: 'http://0.0.0.0:8000/api/users/3/?format=json',
          username: 'admin4',
          email: 'felipe@g.scom',
          password: 'pwd21',
          token: 'token123',
          daily_calories: 2000,
          groups: [1],
        },
        {
          id: 4,
          url: 'http://0.0.0.0:8000/api/users/4/?format=json',
          username: 'root',
          email: 'asd@sx.com',
          password: 'pwd',
          token: 'token12322',
          daily_calories: 0,
          groups: [],
        },
        {
          id: 5,
          url: 'http://0.0.0.0:8000/api/users/5/?format=json',
          username: 'admin2',
          email: 'felipe@g.comas',
          password: 'aaa',
          token: 'token123',
          daily_calories: 1000,
          groups: [1],
        },
      ];
    }),
  };
});

describe('Users', () => {
  let wrapper;

  beforeEach(() => {
    const app = (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <Users />
        </Router>
      </MuiThemeProvider>
    );
    wrapper = mount(app);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Update User', () => {
    wrapper.update();
    wrapper
      .find('Icon')
      .at(0)
      .simulate('click');
    expect(history.push).toBeCalledWith('user', 3);
  });

  test('Delete User', () => {
    wrapper.update();
    wrapper
      .find('Icon')
      .at(1)
      .simulate('click');
    expect(Api.deleteUser).toBeCalledWith(3);
  });
});
