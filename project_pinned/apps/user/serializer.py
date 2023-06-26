"""
Serializer.py는 request로 들어온 JSON 데이터를 파이썬 장고가 읽을 수 있는
모델 규격에 맞춰서 변환, 전달하는 과정을 하는 모듈이다.
"""
from uuid import uuid4

from rest_framework import serializers

# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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


# class UserSerializerWithToken(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)

#         token["user_id"] = user.user_id

#         return token
