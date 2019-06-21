from django.conf.urls import url, include
from rest_framework import routers
from calories.views import MealViewSet, SettingsViewSet, update_settings
from accounts.views import UserViewSet, UserCreate, current_user
from django.contrib import admin
from django.urls import path, include
from rest_framework_jwt.views import obtain_jwt_token

api_router = routers.DefaultRouter()
api_router.register(r'users', UserViewSet)
api_router.register(r'meals', MealViewSet, base_name='meals',)
api_router.register(r'settings', SettingsViewSet, base_name='settings',)

urlpatterns = [
    url(r'^api/', include(api_router.urls)),
    path('api/admin/', admin.site.urls),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/register', UserCreate.as_view(), name='account-create'),
    path('api/token-auth/', obtain_jwt_token),
    path('api/current_user/', current_user),
    path('api/update_settings/', update_settings),
]
