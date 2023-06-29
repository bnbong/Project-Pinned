from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from apps.user.models import User
from apps.landmark.models import Landmark
from .models import Post
from django.views import View
from .serializers import PostSerializer, PostCreateSerializer

from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import HttpResponse


class PostViewTest(View):
    """
    API 테스트용
    """

    def get(self, request):
        return HttpResponse("Hello This is post app.")
    

class MakePost(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PostCreateSerializer(data=request.data, context={'user':request.user})
        if serializer.is_valid():
            # post = serializer.save()
            post = serializer.save(request)
            return Response(
                {"is_success": True, "detail": "post success"},
                status=status.HTTP_201_CREATED
            )
        return Response({"is_success": False, "detail":"post fail"}, status=status.HTTP_400_BAD_REQUEST)


class PostCRUD(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"detail": "Post not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PostSerializer(post)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PostCreateSerializer(data=request.data, context={'user':request.user})
        if serializer.is_valid():
            post = serializer.save()
            return Response(
                {"is_success": True, "detail": "post success"},
                status=status.HTTP_201_CREATED
            )
        return Response({"is_success": False, "detail":"post fail"}, status=status.HTTP_400_BAD_REQUEST)
            

    def put(self, request, post_id):
        pass
        # return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        post.delete()
        return Response(
            {"is_success": True, "detail": "post delete success"},
            status=status.HTTP_204_NO_CONTENT,
        )

    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = [AllowAny]
        return super().get_permissions()
    
class PostsByUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    
    def get(self, request, user_id):
        pass

class PostFeed(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pass