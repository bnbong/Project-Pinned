from django.db.models import Q

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .serializers import LandmarkDetailSerializer, LandmarkSerializer
from .models import Landmark
from apps.post.models import Post
from apps.post.serializers import PostSerializer


class Get3RandomLandmarks(APIView):
    """
    랜덤한 3개의 랜드마크의 이름, 썸네일, 위치를 띄울 때 사용되는 API.
    """

    permission_classes = [AllowAny]
    serializer_class = LandmarkSerializer

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
