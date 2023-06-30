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


class PostCreate(APIView):
    """
    Post를 작성할 때 사용되는 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostCreateSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid(raise_exception=True):
            # post = serializer.save()
            post = serializer.save(request)
            return Response(
                {"is_success": True, "detail": "post success"},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"is_success": False, "detail": "post fail"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class PostView(APIView):
    """
    특정 게시물을 불러오거나, 수정, 삭제할 때 사용되는 API.
    """

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

    def put(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        if post.user.user_id != request.user.user_id:
            return Response(
                {"is_success": False, "detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.update(post, request.data)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        if post.user.user_id != request.user.user_id:
            return Response(
                {"is_success": False, "detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN,
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
    """
    특정 유저가 작성한 게시물들을 불러올 때 사용되는 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        posts = Post.objects.filter(user=user)
        serializer = PostSerializer(posts, many=True)
        return Response({"user_posts": serializer.data}, status=status.HTTP_200_OK)


class PostFeed(APIView):
    """
    메인 페이지에 표시되는 유저 피드 게시물들을 불러올 때 사용되는 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pass
