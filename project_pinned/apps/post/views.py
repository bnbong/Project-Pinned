from django.views import View
from django.http import HttpResponse
from django.db.models import Count

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.user.models import User

from .models import Post, Comment
from .serializers import PostSerializer, PostCreateSerializer, CommentSerializer


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
    serializer_class = PostSerializer

    def get(self, request, offset=0, limit=10):
        following_posts, most_liked_posts, recommended_posts = self.get_posts(
            request, offset, limit
        )

        return Response(
            {
                "followed_posts": self.serializer_class(
                    following_posts, many=True
                ).data,
                "trending_posts": self.serializer_class(
                    most_liked_posts, many=True
                ).data,
                "recommended_posts": self.serializer_class(
                    recommended_posts, many=True
                ).data,
            },
            status=status.HTTP_200_OK,
        )

    def get_posts(self, request, offset=0, limit=10):
        following_posts = Post.objects.filter(
            user__in=request.user.following.all()
        ).order_by("-created_at")[offset : offset + limit]

        most_liked_posts = Post.objects.annotate(like_count=Count("likes")).order_by(
            "-like_count"
        )[offset : offset + limit]

        recommended_posts = Post.objects.order_by("?")[offset : offset + limit]

        return following_posts, most_liked_posts, recommended_posts


class CommentCreate(APIView):
    """
    댓글을 작성하거나 게시물의 모든 댓글들을 불러올 때 사용되는 API.
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

        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments, many=True)
        return Response({"comments": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, post_id):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            try:
                post = Post.objects.get(id=post_id)
            except Post.DoesNotExist:
                return Response(
                    {"detail": "Post not found"}, status=status.HTTP_400_BAD_REQUEST
                )

            comment = serializer.save(user=request.user, post=post)
            return Response(
                {"is_success": True, "detail": "comment create success"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = [AllowAny]
        return super().get_permissions()


class CommentView(APIView):
    """
    특정 댓글을 불러오고 수정하고 삭제할 때 사용되는 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id, post_id=post_id)
        except Comment.DoesNotExist:
            return Response(
                {"detail": "Comment not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, post_id, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id, post_id=post_id)
        except Comment.DoesNotExist:
            return Response(
                {"detail": "Comment not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        if comment.user.user_id != request.user.user_id:
            return Response(
                {"is_success": False, "detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"is_success": True, "detail": "comment edit success"},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id, post_id=post_id)
        except Comment.DoesNotExist:
            return Response(
                {"detail": "Comment not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        if comment.user.user_id != request.user.user_id:
            return Response(
                {"is_success": False, "detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN,
            )

        comment.delete()
        return Response(
            {"is_success": True, "detail": "comment delete success"},
            status=status.HTTP_204_NO_CONTENT,
        )

    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = [AllowAny]
        return super().get_permissions()


class PostLike(APIView):
    """
    자신이 특정 게시물에 좋아요를 누를 때 사용되는 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        pass


class PostUnLike(APIView):
    """
    특정 게시물에 눌렀던 좋아요를 취소할 때 사용하는 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        pass
