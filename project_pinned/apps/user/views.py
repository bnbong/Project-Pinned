# TODO: 캐시 기능 적용 방안 설계 및 구현
from django.db import IntegrityError
from django.db.models import Q
from django.http import HttpResponse
from django.views import View
from django.contrib.auth import get_user_model

from dj_rest_auth.views import LoginView

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import FollowUserSerializer, RegisterSerializer, UserProfileSerializer

User = get_user_model()


class UserViewTest(View):
    """
    API 테스트용
    """

    def get(self, request):
        return HttpResponse("Hello This is user app.")


class UserRegister(APIView):
    """
    회원 가입 API.

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


class UserLogin(LoginView):
    """
    유저의 로그인 API.
    """

    def get_response(self):
        serializer_class = self.get_response_serializer()

        data = {
            "user": self.user,
            "access_token": self.access_token,
            "refresh_token": self.refresh_token,
        }

        serializer = serializer_class(
            instance=data,
            context=self.get_serializer_context(),
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class UserDelete(APIView):
    """
    회원 탈퇴 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        user = request.user

        if str(user.user_id) != str(user_id):
            return Response(
                {"is_success": False, "detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user.delete()

        return Response(
            {"is_success": True, "detail": "user deleted"},
            status=status.HTTP_204_NO_CONTENT,
        )


class UserProfile(APIView):
    """
    유저의 프로필 정보를 확인하는 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, user_id):
        user = User.objects.get(user_id=user_id)
        serializer_class = UserProfileSerializer

        serializer = serializer_class(
            instance=user,
        )

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, user_id):
        if str(request.user.user_id) != str(user_id):
            return Response(
                {"is_success": False, "detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = UserProfileSerializer(
            request.user, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {"is_success": True, "detail": "profile edit success"},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserFollow(APIView):
    """
    URL 중 <user_id>에 해당하는 유저를 팔로우.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        cur_user = request.user
        target_user_id = user_id

        if str(cur_user.user_id) != str(target_user_id):
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
    URL 중 <user_id>에 해당하는 유저를 언팔로우.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        cur_user = request.user
        target_user_id = user_id

        if str(cur_user.user_id) != str(target_user_id):
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
    """
    유저의 팔로워를 확인하는 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        target_user = User.objects.get(user_id=user_id)
        followers_list = target_user.followers.all()

        serializer = FollowUserSerializer(followers_list, many=True)
        return Response({"followers_list": serializer.data}, status=status.HTTP_200_OK)


class UserFollowings(APIView):
    """
    유저가 팔로우하는 사람을 확인하는 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        target_user = User.objects.get(user_id=user_id)
        followings_list = target_user.following.all()

        serializer = FollowUserSerializer(followings_list, many=True)
        return Response({"followings_list": serializer.data}, status=status.HTTP_200_OK)


class UserSearch(APIView):
    """
    유저를 검색하는데 사용되는 API.
    """

    def get(self, request):
        search_word = request.data.get("username", None)

        if search_word is None:
            return Response(
                {"is_success": False, "detail": "username is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(Q(username__icontains=search_word))

        serializer = UserProfileSerializer(users, many=True)
        return Response({"searched_users": serializer.data}, status=status.HTTP_200_OK)
