from rest_framework import serializers
from .models import Meal, Settings

class MealSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Meal
        fields = ('id', 'meal_text', 'meal_date', 'meal_time', 'calories', 'user', 'status')

class SettingsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Settings
        fields = ('daily_calories', 'user')
