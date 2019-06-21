import React from 'react';
import Login from '../../views/login/login';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import theme from '../../theme/MaterialTheme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Router } from 'react-router-dom';
import history from '../../history';
import Api from '../../Api';

configure({ adapter: new Adapter() });

jest.mock('../../Api', () => {
  return {
    login: jest.fn(data => {
      if (data.username === '')
        return {
          username: "This field can't be blank",
        };
      return {
        user: {
          id: 6,
          url: 'http://0.0.0.0:8000/api/users/6/',
          username: 'admin',
          email: 'felipe@g.com',
          password: 'askdgsakjd',
          token: '126879382',
          daily_calories: 123,
          groups: [],
        },
      };
    }),
  };
});

describe('Login', () => {
  let wrapper;

  beforeEach(() => {
    const app = (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <Login login={jest.fn()} />
        </Router>
      </MuiThemeProvider>
    );
    wrapper = mount(app);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Logs in', () => {
    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 'test' } });
    wrapper
      .find('input')
      .at(1)
      .simulate('change', { target: { value: 'password123' } });
    wrapper
      .find('Button')
      .at(0)
      .simulate('click');
    expect(Api.login).toBeCalledWith({
      username: 'test',
      password: 'password123',
    });
  });

  test('Logs in blank username', async () => {
    await wrapper
      .find('input')
      .at(1)
      .simulate('keyUp', { key: 'Enter' });
    expect(Api.login).toBeCalledWith({
      username: '',
      password: '',
    });
    wrapper.update();
    expect(
      wrapper
        .find('Typography')
        .at(1)
        .text()
    ).toBe("Username: This field can't be blank");
  });

  test('Navigates to register', async () => {
    wrapper
      .find('Button')
      .at(1)
      .simulate('click');
    expect(history.location.pathname).toBe('/register');
  });
});
