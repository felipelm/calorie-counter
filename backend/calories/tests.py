from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from calories.models import Meal, Settings
from rest_framework import status

class MealTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        Settings.objects.create(user=self.user, daily_calories=1000)
        Meal.objects.create(meal_text='lunch', meal_date='2019-05-01', meal_time='12:00:00', calories=300, user=self.user)
        Meal.objects.create(meal_text='dinner', meal_date='2019-04-29', meal_time='20:00:00', calories=400, user=self.user)
        Meal.objects.create(status=1, meal_text='dinner', meal_date='2019-04-28', meal_time='20:00:00', calories=500, user=self.user)
        Meal.objects.create(status=1, meal_text='dinner', meal_date='2019-04-28', meal_time='20:00:00', calories=600, user=self.user)

    def test_save_meal_above_daily(self):
        login = self.client.login(username='testuser', password='12345')
        meal={
            "calories": 2000,
            "meal_date": "2019-05-04",
            "meal_text": "newmealname",
            "meal_time": "10:49:00",
        }
        response = self.client.post('/api/meals/', data=meal)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['meal_text'], meal['meal_text'])
        response = self.client.get('/api/meals/')
        self.assertEqual(response.data[-1]['status'], 1)

    def test_get_meals(self):
        login = self.client.login(username='testuser', password='12345')
        response = self.client.get('/api/meals/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_delete_meal(self):
        login = self.client.login(username='testuser', password='12345')
        response = self.client.get('/api/meals/3/')
        self.assertEqual(response.data['status'], 1)
        response = self.client.delete('/api/meals/4/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get('/api/meals/3/')
        self.assertEqual(response.data['status'], 0)

    def test_update_meal(self):
        login = self.client.login(username='testuser', password='12345')
        response = self.client.get('/api/meals/2/')
        self.assertEqual(response.data['status'], 0)
        data=response.data
        data['calories']=1100
        response = self.client.put('/api/meals/2/', data)
        response = self.client.get('/api/meals/2/')
        self.assertEqual(response.data['status'], 1)
        self.assertEqual(response.data['calories'], 1100)

    def test_filter_by_date(self):
        login = self.client.login(username='testuser', password='12345')
        response = self.client.get('/api/meals/?meal_date_after=2019-04-29&meal_date_before=2019-04-30')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['meal_text'], 'dinner')
        self.assertEqual(response.data[0]['calories'], 400)

    def test_filter_by_time(self):
        login = self.client.login(username='testuser', password='12345')
        response = self.client.get('/api/meals/?meal_time_after=11%3A00%3A00&meal_time_before=13%3A00%3A00')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['meal_text'], 'lunch')
        self.assertEqual(response.data[0]['calories'], 300)

    def test_update_daily_calories(self):
        login = self.client.login(username='testuser', password='12345')
        settings = {
            "daily_calories": "300",
        }
        response = self.client.post('/api/update_settings/', data=settings)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get('/api/meals/')
        self.assertEqual(response.data[0]['status'], 0)
        self.assertEqual(response.data[1]['status'], 1)