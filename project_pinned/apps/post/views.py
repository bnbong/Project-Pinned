from django.http import HttpResponse
from django.views import View

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class PostViewTest(View):
    """
    API 테스트용
    """
    def get(self, request):
        return HttpResponse("Hello This is post app.")


class PostCRUD(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pass

    def get(self, request):
        pass

    def put(self, request):
        pass

    def delete(self, request):
        pass