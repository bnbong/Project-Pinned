from django.db import IntegrityError
from django.http import HttpResponse
from django.views import View
from django.contrib.auth import get_user_model

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from . import authentication
from .serializer import RegisterSerializer

User = get_user_model()


class UserViewTest(View):
    def get(self, request):
        return HttpResponse("Hello This is user app.")


class TokenVerify(APIView):
    authentication_classes = (authentication.JWTAuthentication,)

    def post(self, request):
        try:
            pass

        except (AssertionError, TypeError):
            return Response({"detail": "Cannot find user. Token Verify Failed."})


class TokenRefresh(APIView):
    authentication_classes = (authentication.JWTAuthentication,)

    def post(self, request):
        try:
            pass

        except (AssertionError, TypeError):
            return Response({"detail": "Cannot find user. Token Refresh Failed."})


class UserRegister(APIView):
    """
    request:
        "user_name": string,
        "email": string,
        "password": string,
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            try:
                self.perform_user_create(serializer)

                return Response(data={"is_success": True, "detail": "register success"}, status=status.HTTP_201_CREATED)

            except IntegrityError:
                user = User.objects.get(email=request.data.get('email'))

                if user:
                    return Response(data={"detail": "User exist."}, status=status.HTTP_400_BAD_REQUEST)

    def perform_user_create(self, serializer):
        if serializer.is_valid(raise_exception=True):
            user = serializer.save(self.request)

            return user


class UserDelete(APIView):
    authentication_classes = (authentication.JWTAuthentication,)

    def delete(self, request):
        pass


class UserProfile(APIView):
    authentication_classes = (authentication.JWTAuthentication,)

    def get(self, request):
        pass

    def put(self, request):
        pass


class UserFollow(APIView):
    authentication_classes = (authentication.JWTAuthentication,)

    def post(self, request):
        pass


class UserUnFollow(APIView):
    authentication_classes = (authentication.JWTAuthentication,)

    def post(self, request):
        pass


class UserFollowers(APIView):
    authentication_classes = (authentication.JWTAuthentication,)

    def get(self, request):
        pass


class UserFollowings(APIView):
    authentication_classes = (authentication.JWTAuthentication,)

    def get(self, request):
        pass
