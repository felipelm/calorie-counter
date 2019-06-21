import React from 'react';
import Settings from '../../views/settings/settings';
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
    updateSettings: jest.fn(),
  };
});

describe('Settings', () => {
  let wrapper;

  beforeEach(() => {
    const app = (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <Settings dailyCalories={'200'} updateDailyCalories={jest.fn()} />
        </Router>
      </MuiThemeProvider>
    );
    wrapper = mount(app);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  test('Change Settings', () => {
    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: '100' } });
    wrapper
      .find('input')
      .at(0)
      .simulate('keyUp', { key: 'Enter' });
    expect(Api.updateSettings).toBeCalledWith({ daily_calories: '100' });
  });
});
