import history from './history';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? window.origin + '/api/'
    : process.env.REACT_APP_API_URL;

export default class Api {
  static getHeaders() {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `JWT ${localStorage.getItem('auth_token')}`,
    };
  }

  static async checkLogin() {
    try {
      return await fetch(`${apiUrl}current_user/`, {
        headers: {
          Authorization: `JWT ${localStorage.getItem('auth_token')}`,
        },
      });
    } catch (e) {
      return null;
    }
  }

  static async signup(data) {
    try {
      const signup = await fetch(`${apiUrl}register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const json = await signup.json();
      return json;
    } catch (e) {
      return null;
    }
  }

  static async login(data) {
    try {
      const login = await fetch(`${apiUrl}token-auth/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const json = await login.json();
      return json;
    } catch (e) {
      return null;
    }
  }

  static async updateSettings(data) {
    try {
      const settings = await fetch(`${apiUrl}update_settings/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (settings.status === 401) {
        history.push('login');
        return null;
      }
      if (settings.status === 200) {
        history.push('meals');
        return true;
      }
    } catch (e) {
      return null;
    }
  }

  static async saveMeal(data) {
    try {
      const meal = await fetch(`${apiUrl}meals/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      const json = await meal.json();
      if (meal.status === 401) {
        history.push('login');
        return null;
      }
      if (meal.status === 201) {
        history.push('meals');
        return true;
      }
      return json;
    } catch (e) {
      return null;
    }
  }

  static async updateMeal(data, id) {
    try {
      const meal = await fetch(`${apiUrl}meals/${id}/`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      const json = await meal.json();
      if (meal.status === 401) {
        history.push('login');
        return null;
      }
      if (meal.status === 200) {
        history.push('meals');
        return true;
      }
      return json;
    } catch (e) {
      return null;
    }
  }

  static async deleteMeal(id) {
    try {
      const meal = await fetch(`${apiUrl}meals/${id}/`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      if (meal.status === 401) {
        history.push('login');
        return null;
      }
      const json = await meal.json();
      return json;
    } catch (e) {
      return null;
    }
  }

  static async getMeals(filters) {
    try {
      const meals = await fetch(
        `${apiUrl}meals/?meal_time_after=${filters.timeFrom}&meal_time_before=${
          filters.timeTo
        }&meal_date_after=${filters.dateFrom}&meal_date_before=${
          filters.dateTo
        }&format=json`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );
      if (meals.status === 401) {
        history.push('login');
        return null;
      }
      const json = await meals.json();
      return json;
    } catch (e) {
      return null;
    }
  }

  static async getMeal(id) {
    try {
      const meals = await fetch(`${apiUrl}meals/${id}/?format=json`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const json = await meals.json();
      if (meals.status === 401) {
        history.push('login');
        return null;
      }
      return json;
    } catch (e) {
      return null;
    }
  }

  static async getUsers() {
    try {
      const users = await fetch(`${apiUrl}users/?format=json`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const json = await users.json();
      if (users.status === 401) {
        history.push('login');
        return null;
      }
      if (users.status === 403) {
        history.push('meals');
        return null;
      }
      return json;
    } catch (e) {
      return null;
    }
  }

  static async deleteUser(id) {
    try {
      const user = await fetch(`${apiUrl}users/${id}/`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      const json = await user.json();
      if (user.status === 401) {
        history.push('login');
        return null;
      }
      return json;
    } catch (e) {
      return null;
    }
  }

  static async getUser(id) {
    try {
      const users = await fetch(`${apiUrl}users/${id}/?format=json`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const json = await users.json();
      if (users.status === 401) {
        history.push('login');
        return null;
      }
      return json;
    } catch (e) {
      return null;
    }
  }

  static async updateUser(data, id) {
    try {
      const user = await fetch(`${apiUrl}users/${id}/`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (user.status === 200) {
        history.push('users');
        return true;
      } else {
        history.push('login');
        return null;
      }
    } catch (e) {
      return null;
    }
  }
}
