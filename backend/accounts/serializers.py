from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from rest_framework_jwt.settings import api_settings
from calories.models import Settings

class UserSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    is_manager = serializers.SerializerMethodField()
    daily_calories = serializers.SerializerMethodField()
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    username = serializers.CharField(
            max_length=50,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(min_length=6)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def get_is_manager(self, obj):
        return 'manager' in obj.groups.all().values_list('name', flat=True)

    def get_daily_calories(self, obj):
        user_settings = Settings.objects.filter(user=obj)
        if len(user_settings)==1:
            return user_settings[0].daily_calories
        else:
            Settings.objects.create(user=obj)
            return 0

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'],
             validated_data['password'])
        if user:
            Settings.objects.create(user=user)
        return user

    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'email', 'password', 'token', 'daily_calories', 'is_staff', 'is_manager')