import React from 'react';
import Signup from '../../views/signup/signup';
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
    signup: jest.fn(data => {
      if (data.username === '') return {};
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

describe('Signup', () => {
  let wrapper;

  beforeEach(() => {
    const app = (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <Signup login={jest.fn()} />
        </Router>
      </MuiThemeProvider>
    );
    wrapper = mount(app);
  });

  afterEach(() => {
    Api.signup.mockReset();
    wrapper.unmount();
  });

  test('Registers new user', () => {
    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 'test' } });
    wrapper
      .find('input')
      .at(1)
      .simulate('change', { target: { value: 'test@email.com' } });
    wrapper
      .find('input')
      .at(2)
      .simulate('change', { target: { value: 'password123' } });
    wrapper
      .find('input')
      .at(3)
      .simulate('change', { target: { value: 'password123' } });
    wrapper
      .find('Button')
      .at(0)
      .simulate('click');
    expect(Api.signup).toBeCalledWith({
      username: 'test',
      email: 'test@email.com',
      password: 'password123',
    });
  });

  test('Registers new user wrong password confirmation', () => {
    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 'test' } });
    wrapper
      .find('input')
      .at(1)
      .simulate('change', { target: { value: 'test@email.com' } });
    wrapper
      .find('input')
      .at(2)
      .simulate('change', { target: { value: 'password123' } });
    wrapper
      .find('input')
      .at(3)
      .simulate('change', { target: { value: 'password' } });
    wrapper
      .find('Button')
      .at(0)
      .simulate('click');
    expect(Api.signup).toHaveBeenCalledTimes(0);
  });

  it('Logs in blank username', () => {
    wrapper
      .find('input')
      .at(1)
      .simulate('keyUp', { key: 'Enter' });
    expect(Api.signup).toBeCalledWith({
      email: '',
      username: '',
      password: '',
    });
  });

  it('Navigates to login', async () => {
    wrapper
      .find('Button')
      .at(1)
      .simulate('click');
    expect(history.location.pathname).toBe('/login');
  });
});
