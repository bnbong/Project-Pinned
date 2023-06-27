from django.db import IntegrityError
from django.http import HttpResponse
from django.views import View
from django.contrib.auth import get_user_model

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializer import FollowUserSerializer, RegisterSerializer

User = get_user_model()


class UserViewTest(View):
    def get(self, request):
        return HttpResponse("Hello This is user app.")


class UserRegister(APIView):
    """
    request:
        "username": string,
        "email": string,
        "password": string,
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            try:
                self.perform_user_create(serializer)

                return Response(
                    data={"is_success": True, "detail": "register success"},
                    status=status.HTTP_201_CREATED,
                )

            except IntegrityError:
                user = User.objects.get(email=request.data.get("email"))

                if user:
                    return Response(
                        data={"detail": "User exist."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

    def perform_user_create(self, serializer):
        if serializer.is_valid(raise_exception=True):
            user = serializer.save(self.request)

            return user


class UserDelete(APIView):
    authentication_classes = [JWTAuthentication]

    def delete(self, request):
        pass


class UserProfile(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        pass

    def put(self, request):
        pass


class UserFollow(APIView):
    """
    request:
        "user_id": string,
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        target_user_id = request.data.get("user_id")
        if user_id != target_user_id:
            cur_user = User.objects.get(user_id=user_id)
            target_user = User.objects.get(user_id=target_user_id)
            if not cur_user.following.filter(user_id=target_user_id).exists():
                cur_user.following.add(target_user)
                target_user.followers.add(cur_user)
                return Response(
                    {"is_success": True, "detail": "user follow success"},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"is_success": False, "detail": "already followed user"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"is_success": False, "detail": "You cannot follow yourself"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class UserUnFollow(APIView):
    """
    request:
        "user_id": string,
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        target_user_id = request.data.get("user_id")
        if user_id != target_user_id:
            cur_user = User.objects.get(user_id=user_id)
            target_user = User.objects.get(user_id=target_user_id)
            if cur_user.following.filter(user_id=target_user_id).exists():
                cur_user.following.remove(target_user)
                target_user.followers.remove(cur_user)
                return Response(
                    {"is_success": True, "detail": "user unfollow success"},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"is_success": False, "detail": "already unfollowed user"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"is_success": False, "detail": "You cannot unfollow yourself"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class UserFollowers(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        cur_user = User.objects.get(user_id=user_id)
        followers_list = cur_user.followers.all()
        serializer = FollowUserSerializer(followers_list, many=True)
        return Response({"followers_list": serializer.data}, status=status.HTTP_200_OK)


class UserFollowings(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        cur_user = User.objects.get(user_id=user_id)
        followings_list = cur_user.following.all()
        serializer = FollowUserSerializer(followings_list, many=True)
        return Response({"followings_list": serializer.data}, status=status.HTTP_200_OK)
