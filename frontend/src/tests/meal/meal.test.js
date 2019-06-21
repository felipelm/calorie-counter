import React from 'react';
import Meal from '../../views/meal/meal';
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
    location: { pathname: jest.fn(), state: 29 },
  };
});

jest.mock('../../Api', () => {
  return {
    updateMeal: jest.fn(),
    getMeal: jest.fn(() => {
      return {
        id: 29,
        meal_text: '13213',
        meal_date: '2019-05-04',
        meal_time: '10:49:00',
        calories: 123,
        user: 'http://0.0.0.0:8000/api/users/6/?format=json',
        status: 0,
      };
    }),
    updateUser: jest.fn(),
  };
});

describe('Meal', () => {
  let wrapper;

  beforeEach(() => {
    const app = (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <Meal />
        </Router>
      </MuiThemeProvider>
    );
    wrapper = mount(app);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Load Meal', () => {
    expect(Api.getMeal).toBeCalledWith(29);
  });

  test('Change Meal', () => {
    wrapper.update();
    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 'newmealname' } });
    wrapper
      .find('input')
      .at(0)
      .simulate('keyUp', { key: 'Enter' });
    expect(Api.updateMeal).toBeCalledWith(
      {
        calories: 123,
        meal_date: '2019-05-04',
        meal_text: 'newmealname',
        meal_time: '10:49:00',
      },
      29
    );
  });
});
