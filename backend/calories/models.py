from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class Meal(models.Model):
    meal_text = models.CharField(max_length=200)
    status = models.IntegerField(default=0)
    meal_date = models.DateField()
    meal_time = models.TimeField()
    calories = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True,)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.meal_text

class Settings(models.Model):
    daily_calories = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
