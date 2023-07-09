"""
Serializer.py는 request로 들어온 JSON 데이터를 파이썬 장고가 읽을 수 있는
모델 규격에 맞춰서 변환, 전달하는 과정을 하는 모듈이다.
"""
from uuid import uuid4

from rest_framework import serializers, exceptions

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.utils.translation import gettext_lazy as _

from .models import User


def jwt_get_user_id_from_payload(payload):
    return payload.get("user_id")


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def save(self, request):
        user = User(
            email=request.data.get("email"),
            username=request.data.get("username"),
        )
        user.user_id = uuid4()
        user.set_password(request.data.get("password"))
        user.is_active = True
        user.save()

        return user

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
        )


class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(style={"input_type": "password"})

    def authenticate(self, **kwargs):
        return authenticate(self.context["request"], **kwargs)

    def _validate_email(self, email, password):
        if email and password:
            user = self.authenticate(email=email, password=password)
            if user is None or not check_password(password, user.password):
                msg = _("Invalid email or password")
                raise exceptions.ValidationError(msg)
        else:
            msg = _('Must include "email" and "password".')
            raise exceptions.ValidationError(msg)

        return user

    @staticmethod
    def validate_auth_user_status(user):
        if not user.is_active:
            msg = _("User account is disabled.")
            raise exceptions.ValidationError(msg)

    def get_user_from_email(self, email, password):
        self._validate_email(email=email, password=password)
        user = User.objects.get(email=email)

        return user

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        user = self.get_user_from_email(email, password)

        if not user:
            msg = _("Unable to log in with provided credentials.")
            raise exceptions.ValidationError(msg)

        self.validate_auth_user_status(user)

        attrs["user"] = user
        return attrs

    class Meta:
        model = User
        fields = (
            "email",
            "password",
        )


class UserLoginResponseSerializer(serializers.Serializer):
    access_token = serializers.CharField()
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        user_data = UserProfileSerializer(obj["user"], context=self.context).data

        return user_data


class UserProfileSerializer(serializers.ModelSerializer):
    followers = serializers.SerializerMethodField()
    followings = serializers.SerializerMethodField()
    profile_image = serializers.ImageField(required=False)

    def get_followers(self, obj):
        return obj.follower_count()

    def get_followings(self, obj):
        return obj.following_count()

    class Meta:
        model = User
        fields = (
            "user_id",
            "username",
            "email",
            "profile_image",
            "followers",
            "followings",
        )
        read_only_fields = ("user_id", "email")


class FollowUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "profile_image")
