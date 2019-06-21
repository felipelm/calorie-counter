import React from 'react';
import User from '../../views/user/user';
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
    location: { pathname: jest.fn(), state: 3 },
  };
});

jest.mock('../../Api', () => {
  return {
    getUser: jest.fn(() => {
      return {
        id: 3,
        username: 'testuser',
        password: 'password',
        email: 'test@email.com',
      };
    }),
    updateUser: jest.fn(),
  };
});

describe('User', () => {
  let wrapper;

  beforeEach(() => {
    const app = (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <User />
        </Router>
      </MuiThemeProvider>
    );
    wrapper = mount(app);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Load User', () => {
    expect(Api.getUser).toBeCalledWith(3);
  });

  test('Change User', () => {
    wrapper.update();
    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 'newusername' } });
    wrapper
      .find('input')
      .at(0)
      .simulate('keyUp', { key: 'Enter' });
    expect(Api.updateUser).toBeCalledWith(
      {
        email: 'test@email.com',
        password: 'password',
        username: 'newusername',
      },
      3
    );
  });
});
