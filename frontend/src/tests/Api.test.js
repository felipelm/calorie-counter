import Api from '../Api';
import history from '../history';

describe('Api', () => {
  beforeEach(() => {
    fetch.mockReset();
    fetch.mockImplementation(() => ({ status: 401, json: jest.fn() }));
  });

  test('calls checkLogin', () => {
    Api.checkLogin();
    expect(fetch).toBeCalledWith('http://0.0.0.0:8000/api/current_user/', {
      headers: { Authorization: 'JWT null' },
    });
  });

  test('calls login', () => {
    Api.login({
      username: 'test',
      password: 'password123',
    });
    expect(fetch).toBeCalledWith('http://0.0.0.0:8000/api/token-auth/', {
      body: '{"username":"test","password":"password123"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });

  test('calls signup', () => {
    Api.signup({
      username: 'test',
      email: 'test@email.com',
      password: 'password123',
    });
    expect(fetch).toBeCalledWith('http://0.0.0.0:8000/api/register', {
      body:
        '{"username":"test","email":"test@email.com","password":"password123"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });

  test('calls updateSettings', () => {
    Api.updateSettings({
      daily_calories: 3000,
    });
    expect(fetch).toBeCalledWith('http://0.0.0.0:8000/api/update_settings/', {
      body: '{"daily_calories":3000}',
      headers: {
        Accept: 'application/json',
        Authorization: 'JWT null',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  });

  test('calls saveMeal', () => {
    Api.saveMeal({
      meal_text: 'lunch',
      meal_time: '12:00',
      meal_date: '2019-10-10',
      calories: 300,
    });
    expect(fetch).toBeCalledWith('http://0.0.0.0:8000/api/meals/', {
      body:
        '{"meal_text":"lunch","meal_time":"12:00","meal_date":"2019-10-10","calories":300}',
      headers: {
        Accept: 'application/json',
        Authorization: 'JWT null',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  });

  test('calls updateMeal', async () => {
    Api.updateMeal(
      {
        meal_text: 'lunch',
        meal_time: '12:00',
        meal_date: '2019-10-10',
        calories: 300,
      },
      10
    );
    expect(fetch).toBeCalledWith('http://0.0.0.0:8000/api/meals/10/', {
      body:
        '{"meal_text":"lunch","meal_time":"12:00","meal_date":"2019-10-10","calories":300}',
      headers: {
        Accept: 'application/json',
        Authorization: 'JWT null',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
    fetch.mockImplementation(() => ({
      status: 200,
      json: jest.fn(() => 'updatemeal'),
    }));
    expect(
      await Api.updateMeal(
        {
          meal_text: 'lunch',
          meal_time: '12:00',
          meal_date: '2019-10-10',
          calories: 300,
        },
        10
      )
    ).toBe(true);
  });

  test('calls deleteMeal', async () => {
    Api.deleteMeal(10);
    expect(fetch).toBeCalledWith('http://0.0.0.0:8000/api/meals/10/', {
      headers: {
        Accept: 'application/json',
        Authorization: 'JWT null',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
    fetch.mockImplementation(() => ({
      status: 200,
      json: jest.fn(() => 'deletemeal'),
    }));
    expect(await Api.deleteMeal(10)).toBe('deletemeal');
  });

  test('calls getMeals', async () => {
    Api.getMeals({
      timeFrom: '12:00',
      timeTo: '13:00',
      dateFrom: '2019-10-10',
      dateTo: '2019-10-10',
    });
    expect(fetch).toBeCalledWith(
      'http://0.0.0.0:8000/api/meals/?meal_time_after=12:00&meal_time_before=13:00&meal_date_after=2019-10-10&meal_date_before=2019-10-10&format=json',
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'JWT null',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );
    fetch.mockImplementation(() => ({
      status: 200,
      json: jest.fn(() => 'mealsget'),
    }));
    expect(
      await Api.getMeals({
        timeFrom: '12:00',
        timeTo: '13:00',
        dateFrom: '2019-10-10',
        dateTo: '2019-10-10',
      })
    ).toBe('mealsget');
  });

  test('calls getMeal', async () => {
    await Api.getMeal(5);
    expect(fetch).toBeCalledWith(
      'http://0.0.0.0:8000/api/meals/5/?format=json',
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'JWT null',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );
    fetch.mockImplementation(() => ({
      status: 200,
      json: jest.fn(() => 'mealget'),
    }));
    expect(await Api.getMeal(5)).toBe('mealget');
  });

  test('calls getUsers', async () => {
    Api.getUsers();
    expect(fetch).toBeCalledWith('http://0.0.0.0:8000/api/users/?format=json', {
      headers: {
        Accept: 'application/json',
        Authorization: 'JWT null',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    fetch.mockImplementation(() => ({
      status: 403,
      json: jest.fn(() => 'test1'),
    }));
    await Api.getUsers();
    expect(history.location.pathname).toBe('/meals');
    fetch.mockImplementation(() => ({
      status: 401,
      json: jest.fn(() => 'notauth'),
    }));
    await Api.getUsers();
    expect(history.location.pathname).toBe('/login');
    fetch.mockImplementation(() => ({
      status: 200,
      json: jest.fn(() => 'notauth'),
    }));
    await Api.getUsers();
    expect(history.location.pathname).toBe('/login');
  });

  test('calls deleteUser', async () => {
    Api.deleteUser(3);
    expect(fetch).toBeCalledWith('http://0.0.0.0:8000/api/users/3/', {
      headers: {
        Accept: 'application/json',
        Authorization: 'JWT null',
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
    fetch.mockImplementation(() => ({
      status: 200,
      json: jest.fn(() => 'test'),
    }));
    expect(await Api.deleteUser(3)).toBe('test');
  });

  test('calls getUser', async () => {
    await Api.getUser(3);
    expect(fetch).toBeCalledWith(
      'http://0.0.0.0:8000/api/users/3/?format=json',
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'JWT null',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );
    fetch.mockImplementation(() => ({
      status: 200,
      json: jest.fn(() => 'test'),
    }));
    expect(await Api.getUser(3)).toBe('test');
  });

  test('calls updateUser', async () => {
    Api.updateUser(
      {
        username: 'test3',
      },
      3
    );
    expect(fetch).toBeCalledWith('http://0.0.0.0:8000/api/users/3/', {
      body: '{"username":"test3"}',
      headers: {
        Accept: 'application/json',
        Authorization: 'JWT null',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
    expect(history.location.pathname).toBe('/login');
    fetch.mockImplementation(() => ({ status: 200, json: jest.fn() }));
    await Api.updateUser(
      {
        username: 'test3',
      },
      3
    );
    expect(history.location.pathname).toBe('/users');
  });
});

describe('Api Exceptions', () => {
  beforeEach(() => {
    fetch.mockReset();
    fetch.mockImplementation(() => {
      throw 'Exception';
    });
  });

  test('calls checkLogin', async () => {
    expect(await Api.checkLogin()).toBe(null);
  });

  test('calls login', async () => {
    expect(
      await Api.login({
        username: 'test',
        password: 'password123',
      })
    ).toBe(null);
  });

  test('calls signup', async () => {
    expect(
      await Api.signup({
        username: 'test',
        email: 'test@email.com',
        password: 'password123',
      })
    ).toBe(null);
  });

  test('calls updateSettings', async () => {
    expect(
      await Api.updateSettings({
        daily_calories: 3000,
      })
    ).toBe(null);
  });

  test('calls saveMeal', async () => {
    expect(
      await Api.saveMeal({
        meal_text: 'lunch',
        meal_time: '12:00',
        meal_date: '2019-10-10',
        calories: 300,
      })
    ).toBe(null);
  });

  test('calls updateMeal', async () => {
    expect(
      await Api.updateMeal(
        {
          meal_text: 'lunch',
          meal_time: '12:00',
          meal_date: '2019-10-10',
          calories: 300,
        },
        10
      )
    ).toBe(null);
  });

  test('calls deleteMeal', async () => {
    expect(await Api.deleteMeal(10)).toBe(null);
  });

  test('calls getMeals', async () => {
    expect(
      await Api.getMeals({
        timeFrom: '12:00',
        timeTo: '13:00',
        dateFrom: '2019-10-10',
        dateTo: '2019-10-10',
      })
    ).toBe(null);
  });

  test('calls getMeal', async () => {
    expect(await Api.getMeal(5)).toBe(null);
  });

  test('calls getUsers', async () => {
    expect(await Api.getUsers()).toBe(null);
  });

  test('calls deleteUser', async () => {
    expect(await Api.deleteUser(3)).toBe(null);
  });

  test('calls getUser', async () => {
    expect(await Api.getUser(3)).toBe(null);
  });

  test('calls updateUser', async () => {
    expect(
      await Api.updateUser(
        {
          username: 'test3',
        },
        3
      )
    ).toBe(null);
  });
});
