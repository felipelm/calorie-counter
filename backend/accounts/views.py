from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework import permissions
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from rest_framework import permissions

def my_jwt_response_handler(token, user=None, request=None):
    return {
        'user': UserSerializer(user, context={'request': request}).data
    }


class UserCreate(APIView):
    """ 
    Creates the user. 
    """
    permission_classes = (permissions.AllowAny,)
    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ManagerAccessPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        groups=User.objects.get(username=request.user.username).groups.all().values_list('name', flat=True)
        return 'manager' in groups or request.user.is_staff

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (ManagerAccessPermission,)


@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """

    serializer_context = {
        'request': request,
    }
    serializer = UserSerializer(request.user, context=serializer_context)
    return Response(serializer.data)
