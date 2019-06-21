import React from 'react';
import Meals from '../../views/meals/meals';
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
    deleteMeal: jest.fn(),
    updateMeal: jest.fn(),
    getMeals: jest.fn(() => {
      return [
        {
          id: 29,
          meal_text: '13213',
          meal_date: '2019-05-04',
          meal_time: '10:49:00',
          calories: 123,
          user: 'http://0.0.0.0:8000/api/users/6/?format=json',
          status: 0,
        },
        {
          id: 30,
          meal_text: '13213',
          meal_date: '2019-05-03',
          meal_time: '10:49:00',
          calories: 1230,
          user: 'http://0.0.0.0:8000/api/users/7/?format=json',
          status: 1,
        },
      ];
    }),
  };
});

describe('Meals', () => {
  let wrapper;

  beforeEach(() => {
    const app = (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <Meals />
        </Router>
      </MuiThemeProvider>
    );
    wrapper = mount(app);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Load Meals', () => {
    wrapper.update();
    expect(Api.getMeals).toHaveBeenCalled();
  });

  test('Update Meal', () => {
    wrapper.update();
    wrapper
      .find('Icon')
      .at(0)
      .simulate('click');
    expect(history.push).toBeCalledWith('meal', 29);
  });

  test('Delete Meal', () => {
    wrapper.update();
    wrapper
      .find('Icon')
      .at(3)
      .simulate('click');
    expect(Api.deleteMeal).toBeCalledWith(30);
  });
});
