"""
Serializer.py는 request로 들어온 JSON 데이터를 파이썬 장고가 읽을 수 있는
모델 규격에 맞춰서 변환, 전달하는 과정을 하는 모듈이다.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    pass


class UserSerializerWithToken(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["user_id"] = user.user_id

        return token
