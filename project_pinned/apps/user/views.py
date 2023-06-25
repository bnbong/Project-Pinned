# from django.shortcuts import render
from django.http import HttpResponse
from django.views import View

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


class UserViewTest(View):
    def get(self, request):
        return HttpResponse("Hello This is user app.")


class TokenVerify(APIView):
    def post(self, request):
        try:
            pass

        except (AssertionError, TypeError):
            return Response({"detail": "Cannot find user. Token Verify Failed."})


class TokenRefresh(APIView):
    def post(self, request):
        try:
            pass

        except (AssertionError, TypeError):
            return Response({"detail": "Cannot find user. Token Refresh Failed."})


class UserLogin(APIView):
    def post(self, request):
        pass


class UserRegister(APIView):
    def post(self, request):
        pass


class UserDelete(APIView):
    def delete(self, request):
        pass


class UserProfile(APIView):
    def get(self, request):
        pass

    def put(self, request):
        pass


class UserFollow(APIView):
    def post(self, request):
        pass


class UserUnFollow(APIView):
    def post(self, request):
        pass


class UserFollowers(APIView):
    def get(self, request):
        pass


class UserFollowings(APIView):
    def get(self, request):
        pass
