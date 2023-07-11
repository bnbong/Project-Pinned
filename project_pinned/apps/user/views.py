from django.db import IntegrityError
from django.db.models import Q
from django.http import HttpResponse
from django.views import View
from django.contrib.auth import get_user_model

from dj_rest_auth.views import LoginView
from dj_rest_auth.jwt_auth import set_jwt_cookies

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenRefreshView

from apps.notification import send_notifiaction

from .serializers import FollowUserSerializer, RegisterSerializer, UserProfileSerializer
from .models import UserDevice

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


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

    @swagger_auto_schema(
        request_body=RegisterSerializer(),
        responses={201: "회원가입 성공", 400: "이미 존재하는 이메일"},
    )
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

    @swagger_auto_schema(
        operation_description="유저의 로그인에 사용되는 API",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "email": openapi.Schema(type=openapi.TYPE_STRING),
                "password": openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=[
                "email, password",
            ],
        ),
        responses={
            200: openapi.Response(
                description="로그인 성공",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "access_token": openapi.Schema(type=openapi.TYPE_STRING),
                        "refresh_token": openapi.Schema(type=openapi.TYPE_STRING),
                        "user": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "user_id": openapi.Schema(type=openapi.TYPE_STRING),
                                "username": openapi.Schema(type=openapi.TYPE_STRING),
                                "email": openapi.Schema(type=openapi.TYPE_STRING),
                                "profile_image": openapi.Schema(
                                    type=openapi.TYPE_STRING
                                ),
                                "followers": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "followings": openapi.Schema(type=openapi.TYPE_INTEGER),
                            },
                        ),
                    },
                ),
            ),
        },
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_response(self):
        serializer_class = self.get_response_serializer()

        data = {
            "user": self.user,
            "access_token": self.access_token,
        }

        serializer = serializer_class(
            instance=data,
            context=self.get_serializer_context(),
        )

        response = Response(serializer.data, status=status.HTTP_200_OK)

        set_jwt_cookies(
            response,
            self.access_token,
            self.refresh_token,
        )
        return response


class UserDelete(APIView):
    """
    회원 탈퇴 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="유저 탈퇴 시 사용되는 API\n\
        본인 계정만 탈퇴 가능\n\
        Header에 JWT 토큰 인증 필요",
        responses={204: "계정 삭제 성공", 401: "사용자 인증 실패", 403: "삭제 권한 없음"},
    )
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

    @swagger_auto_schema(
        operation_description="개별 유저의 프로필을 검색하는데 사용되는 API\n\
        여기서 사용되는 user_id는 1, 2, 3... 씩 늘어나는 autoincrease 속성을 가진 컬럼이 아니라 as1qQWnD4lsAA 형식같이 uuid를 가지는 컬럼이다\n\
        Header에 JWT 토큰 인증 필요",
        responses={200: UserProfileSerializer(), 401: "사용자 인증 실패"},
    )
    def get(self, request, user_id):
        user = User.objects.get(user_id=user_id)
        serializer_class = UserProfileSerializer

        serializer = serializer_class(
            instance=user,
        )

        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="유저의 프로필을 수정하는데 사용되는 API\n\
        본인의 프로필만 변경 가능함\n\
        Header에 JWT 토큰 인증 필요",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING),
                "profile_image": openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=[
                "username",
            ],
        ),
        responses={200: "성공", 400: "잘못된 입력", 401: "사용자 인증 실패", "403": "수정 권한 없음"},
    )
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


class UserMyPage(APIView):
    """
    토큰을 통해 프로필 정보를 확인하는 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="토큰을 통해 프로필 정보를 확인하는 API\n\
        Header에 JWT 토큰 인증 필요",
        responses={200: UserProfileSerializer(), 401: "사용자 인증 실패"},
    )
    def get(self, request):
        serializer = UserProfileSerializer(
            instance=request.user,
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class UserFollow(APIView):
    """
    URL 중 <user_id>에 해당하는 유저를 팔로우.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="특정 유저를 팔로우 할 때 사용되는 API.\n\
            여기서, 팔로우할 특정 유저는 {user_id}가 가리키는 유저이다.\n\
        Header에 JWT 토큰 인증 필요",
        responses={
            200: "팔로우 성공",
            400: "이미 팔로우 중인 유저 / 자기 자신을 팔로우 시도",
            401: "사용자 인증 실패",
        },
    )
    def post(self, request, user_id):
        cur_user = request.user
        target_user_id = user_id

        if str(cur_user.user_id) != str(target_user_id):
            target_user = User.objects.get(user_id=target_user_id)
            if not cur_user.following.filter(user_id=target_user_id).exists():
                cur_user.following.add(target_user)
                target_user.followers.add(cur_user)

                title = "새로운 팔로워가 생겼어요!"
                body = f"{cur_user.username} 님이 팔로우를 시작했어요!"

                send_notifiaction(target_user=target_user, title=title, content=body)

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

    @swagger_auto_schema(
        operation_description="특정 유저를 언팔로우 할 때 사용되는 API.\n\
            여기서, 언팔로우할 특정 유저는 {user_id}가 가리키는 유저이다.\n\
        Header에 JWT 토큰 인증 필요",
        responses={
            200: "언팔로우 성공",
            400: "이미 언팔로우 중인 유저 / 자기 자신을 언팔로우 시도",
            401: "사용자 인증 실패",
        },
    )
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

    @swagger_auto_schema(
        operation_description="특정 유저의 팔로워를 확인할 때 사용되는 API\n\
        Header에 JWT 토큰 인증 필요",
        responses={200: "성공 (응답 참고)", 401: "사용자 인증 실패"},
    )
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

    @swagger_auto_schema(
        operation_description="특정 유저가 팔로우한 계정들을 확인할 때 사용되는 API\n\
        Header에 JWT 토큰 인증 필요",
        responses={200: "성공 (응답 참고)", 401: "사용자 인증 실패"},
    )
    def get(self, request, user_id):
        target_user = User.objects.get(user_id=user_id)
        followings_list = target_user.following.all()

        serializer = FollowUserSerializer(followings_list, many=True)
        return Response({"followings_list": serializer.data}, status=status.HTTP_200_OK)


class UserSearch(APIView):
    """
    유저를 검색하는데 사용되는 API.
    """

    @swagger_auto_schema(
        operation_description="유저를 검색하는데 사용되는 API\n\
        Header에 JWT 토큰 인증 필요",
        manual_parameters=[
            openapi.Parameter(
                "username",
                openapi.IN_QUERY,
                description="사용자 이름",
                type=openapi.TYPE_STRING,
            )
        ],
        responses={200: "성공 (응답 참고)", 400: "username이 전달되지 않음", 401: "사용자 인증 실패"},
    )
    def get(self, request):
        search_word = request.query_params.get("username", None)

        if search_word is None:
            return Response(
                {"is_success": False, "detail": "username is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        users = User.objects.filter(Q(username__icontains=search_word))

        serializer = UserProfileSerializer(users, many=True)
        return Response({"searched_users": serializer.data}, status=status.HTTP_200_OK)


class UserFCMToken(APIView):
    """
    클라이언트에서 FCM 토큰을 받아 사용자 모델에 저장하는 API
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="클라이언트에서 FCM 토큰을 받아 사용자 모델에 저장하는 API\n\
        Header에 JWT 토큰 인증 필요",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "fcmToken": openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=["fcmToken"],
        ),
        responses={
            200: "성공",
            400: "토큰이 제공되지 않음",
            401: "사용자 인증 실패",
        },
    )
    def post(self, request):
        fcm_token = request.data.get("fcm_token", None)

        if fcm_token:
            UserDevice.objects.update_or_create(
                user=request.user, defaults={"fcmToken": fcm_token}
            )
            return Response(
                {"is_success": True, "detail": "FCM Token saved"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"is_success": False, "detail": "FCM Token is not provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
        request.data['refresh'] = refresh_token

        return super().post(request, *args, **kwargs)
