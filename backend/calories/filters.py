import django_filters
from .models import Meal
from django_filters import DateRangeFilter,DateFromToRangeFilter, TimeRangeFilter

class MealFilter(django_filters.FilterSet):
    meal_time = TimeRangeFilter('meal_time')
    meal_date = DateFromToRangeFilter('meal_date')

    class Meta:
        model = Meal
        fields = ['meal_time','meal_date']
