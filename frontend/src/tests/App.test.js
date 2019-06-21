import React from 'react';
import App from '../App';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import history from '../history';
import Api from '../Api';

configure({ adapter: new Adapter() });

jest.mock('../Api', () => {
  return {
    checkLogin: jest.fn(),
  };
});

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    Api.checkLogin.mockImplementation(
      jest.fn(() => {
        return {
          status: 200,
          json: async () => {
            return {
              username: 'loggeduser',
              daily_calories: 200,
              is_staff: true,
              is_manager: true,
            };
          },
        };
      })
    );
    const app = <App />;
    wrapper = mount(app);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Navigates to register', () => {
    history.push('register');
    expect(history.location.pathname).toBe('/register');
  });

  test('Navigates to login', () => {
    history.push('login');
    expect(history.location.pathname).toBe('/login');
  });

  test('Navigates to register', () => {
    history.push('register');
    expect(history.location.pathname).toBe('/register');
  });

  test('Navigates to settings', () => {
    history.push('settings');
    expect(history.location.pathname).toBe('/settings');
  });

  test('Logout', () => {
    wrapper.update();
    wrapper
      .find('Icon')
      .at(5)
      .simulate('click');
    expect(history.location.pathname).toBe('/login');
  });

  test('No auth', async () => {
    Api.checkLogin.mockImplementation(
      jest.fn(() => {
        return {
          status: 401,
          json: async () => {
            return {
              username: 'loggeduser',
              daily_calories: 200,
            };
          },
        };
      })
    );
    const app = <App />;
    wrapper = mount(app);
    history.push('settings');
    await wrapper.update();
    expect(history.location.pathname).toBe('/login');
  });
});
