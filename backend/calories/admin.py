from django.contrib import admin
from .models import Meal

class MealAdmin(admin.ModelAdmin):
    list_display = ('meal_text', 'calories', 'meal_date', 'meal_time', 'user')
admin.site.register(Meal, MealAdmin)
