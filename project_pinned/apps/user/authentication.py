import jwt

from django.contrib.auth import get_user_model

from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication

from .serializer import jwt_get_user_id_from_payload
from project_pinned import settings


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        User = get_user_model()
        authorization_header = request.header.get("Authorization")

        if not authorization_header:
            return None
        try:
            access_token = authorization_header.split(" ")[1]
            payload = jwt.decode(
                access_token, settings.SECRET_KEY, algorithms=["HS256"]
            )

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("access_token expired")
        except IndexError:
            raise exceptions.AuthenticationFailed("Invalid token given")

        user = User.objects.get_by_natural_key(
            user_id=jwt_get_user_id_from_payload(payload)
        )

        if user is None:
            raise exceptions.AuthenticationFailed("User not found")

        if not user.is_active:
            raise exceptions.AuthenticationFailed("User is inactive")

        return (user, None)
