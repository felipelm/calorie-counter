from django.contrib.auth.models import User
from .models import Meal, Settings
from rest_framework import viewsets
from .serializers import MealSerializer, SettingsSerializer
from .filters import MealFilter
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum

class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    filter_class = MealFilter

    def calculate_status(self, date, user):
        daily_calories = Settings.objects.get(user=user).daily_calories
        meals = Meal.objects.filter(user=user, meal_date=date)
        total = meals.aggregate(total=Sum('calories'))['total']
        if total and total > daily_calories:
            meals.update(status=1)
        else:
            meals.update(status=0)

    def destroy(self, request, pk=None):
        meal = Meal.objects.filter(pk=pk)
        if len(meal) == 1 and request.user.pk == meal[0].user.pk:
            meal=meal[0]
            date = meal.meal_date
            user = meal.user
            meal.delete()
            self.calculate_status(date, user)
            return Response(status=status.HTTP_200_OK) 
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def perform_update(self, serializer):
        meal = serializer.save()
        self.calculate_status(meal.meal_date, meal.user)
        return meal

    def perform_create(self, serializer):
        if not self.request.user.pk:
            raise Exception(
                'It is necessary an active login to perform this operation.')
        meal=serializer.save(user=self.request.user)
        self.calculate_status(meal.meal_date, meal.user)

    def get_queryset(self):
        user = self.request.user
        return Meal.objects.filter(user=user)

class SettingsViewSet(viewsets.ModelViewSet):
    serializer_class = SettingsSerializer

    def get_queryset(self):
        user = self.request.user
        return Settings.objects.filter(user=user)

def calculate_status(user, daily_calories):
    dates = Meal.objects.filter(user=user).values('meal_date').distinct()
    for date in list(dates):
        meals = Meal.objects.filter(user=user, meal_date=date['meal_date'])
        total = meals.aggregate(total=Sum('calories'))['total']
        if total > int(daily_calories):
            meals.update(status=1)
        else:
            meals.update(status=0)

@api_view(['POST'])
def update_settings(request):
    user=request.user
    if user:
        Settings.objects.filter(user=user).update(daily_calories=request.data['daily_calories'])
        calculate_status(user, request.data['daily_calories'])
        return Response(status=status.HTTP_200_OK) 
    else:
        return Response(status=status.HTTP_401_UNAUTHORIZED) 
