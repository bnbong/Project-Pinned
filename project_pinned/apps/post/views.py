# TODO: notification 기능 구현하기
from django.views import View
from django.http import HttpResponse
from django.db.models import Count
from django.core.cache import cache

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.user.models import User

from .models import Post, Comment, Like
from .serializers import PostSerializer, PostCreateSerializer, CommentSerializer

from apps.notification import send_notifiaction


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
            serializer.save(request)

            cache_key = f"user_{request.user.id}_feed"
            cache.delete(cache_key)

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

    피드 생성 로직 ->
    1. 팔로우한 유저들의 게시물들을 불러온다.
    2. 좋아요 수가 많은 게시물들을 불러온다.
    3. 추천 게시물들을 불러온다.
    4. 1, 2, 3번의 게시물들을 합친다.
    5. 4번의 게시물들을 좋아요 수가 많은 순서대로 정렬한다.
    6. 5번의 게시물들을 offset, limit에 맞게 잘라서 반환한다.

    피드 갱신 로직 ->
    1. 특정 유저가 게시물을 만들면, 현재 로그인 되어 있는 유저의 피드를 삭제한다.
    2. 피드를 불러오는 api를 호출할 때 피드를 다시 생성한다.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer

    def get(self, request, offset=0, limit=10):
        cache_key = f"user_{request.user.id}_feed"
        data = cache.get(cache_key)

        if not data:
            following_posts, most_liked_posts, recommended_posts = self.get_posts(
                request, offset, limit
            )

            data = {
                "followed_posts": self.serializer_class(
                    following_posts, many=True
                ).data,
                "trending_posts": self.serializer_class(
                    most_liked_posts, many=True
                ).data,
                "recommended_posts": self.serializer_class(
                    recommended_posts, many=True
                ).data,
            }

            cache.set(cache_key, data, 60 * 60 * 24)

        return Response(
            data,
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
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"detail": "Post not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        if Like.objects.filter(user=request.user, post=post).exists():
            return Response(
                {"is_success": False, "detail": "You already like this post."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        like = Like.objects.create(user=request.user, post=post)

        target_user = post.user

        title = "좋아요 알림"
        body = f"{request.user} 님이 당신의 게시물에 좋아요를 눌렀습니다."

        send_notifiaction(target_user=target_user, title=title, content=body)
        return Response(
            {"is_success": True, "detail": "post like success"},
            status=status.HTTP_201_CREATED,
        )


class PostUnLike(APIView):
    """
    특정 게시물에 눌렀던 좋아요를 취소할 때 사용하는 API.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"detail": "Post not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            like = Like.objects.get(user=request.user, post=post)
        except Like.DoesNotExist:
            return Response(
                {"is_success": False, "detail": "You haven't liked this post."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        like.delete()
        return Response(
            {"is_success": True, "detail": "cancel post like success"},
            status=status.HTTP_204_NO_CONTENT,
        )
