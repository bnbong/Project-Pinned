from django.db.models import Q
from django.core.cache import cache

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .serializers import LandmarkDetailSerializer, LandmarkSerializer
from .models import Landmark
from apps.post.models import Post
from apps.post.serializers import PostSerializer

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


class Get3RandomLandmarks(APIView):
    """
    랜덤한 3개의 랜드마크의 이름, 썸네일, 위치를 띄울 때 사용되는 API.
    """

    permission_classes = [AllowAny]
    serializer_class = LandmarkSerializer

    @swagger_auto_schema(
        responses={200: "성공 (응답 참고)"},
    )
    def get(self, request):
        landmarks = Landmark.objects.order_by("?")[:3]
        serializer = self.serializer_class(landmarks, many=True)

        return Response({"recommends": serializer.data}, status=status.HTTP_200_OK)


class GetLandmark(APIView):
    """
    특정 랜드마크의 정보(게시물 수, 좋아요 수 포함)를 불러오는 API.
    """

    permission_classes = [AllowAny]
    serializer_class = LandmarkDetailSerializer

    @swagger_auto_schema(
        responses={200: LandmarkDetailSerializer, 404: "존재하지 않는 랜드마크"},
    )
    def get(self, request, landmark_id):
        try:
            landmark = Landmark.objects.get(id=landmark_id)
        except Landmark.DoesNotExist:
            return Response(
                {"is_success": False, "detail": "landmark not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.serializer_class(landmark)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchLandmark(APIView):
    """
    특정 랜드마크를 검색할 때 사용되는 API.
    """

    permission_classes = [AllowAny]
    serializer_class = LandmarkDetailSerializer

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "landmark_name",
                openapi.IN_QUERY,
                description="랜드마크 이름",
                type=openapi.TYPE_STRING,
            )
        ],
        responses={200: "성공 (응답 참고)", 400: "landmark_name이 전달되지 않음"},
    )
    def get(self, request):
        search_word = request.query_params.get("landmark_name", None)

        if search_word is None:
            return Response(
                {"is_success": False, "detail": "landmark_name is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        landmarks = Landmark.objects.filter(Q(name__icontains=search_word)).order_by(
            "name"
        )

        serializer = self.serializer_class(landmarks, many=True)

        return Response({"landmarks": serializer.data}, status=status.HTTP_200_OK)


class GetLandmarkPosts(APIView):
    """
    특정 랜드마크에 pin 되어 있는 게시물들을 불러올 때 사용되는 API.
    """

    permission_classes = [AllowAny]
    serializer_class = PostSerializer

    @swagger_auto_schema(
        responses={200: "성공 (응답 참고)", 404: "존재하지 않는 랜드마크 ID"},
    )
    def get(self, request, landmark_id):
        try:
            landmark = Landmark.objects.get(id=landmark_id)
        except Landmark.DoesNotExist:
            return Response(
                {"is_success": False, "detail": "landmark not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        posts = Post.objects.filter(landmark=landmark)
        serializer = self.serializer_class(posts, many=True)

        return Response({"landmark_posts": serializer.data}, status=status.HTTP_200_OK)


class GetAllLandmarks(APIView):
    """
    DB 에 있는 모든 랜드마크를 가져오는 API.
    """
    permission_classes = [AllowAny]
    serializer_class = LandmarkSerializer

    def get(self, request):
        cache_key = "all_landmark_list"
        data = cache.get(cache_key)

        if not data:
            landmarks = Landmark.objects.all()
            serializer = self.serializer_class(landmarks, many=True)
            data = serializer.data
            cache.set(cache_key, data)

        return Response(data, status=status.HTTP_200_OK)
