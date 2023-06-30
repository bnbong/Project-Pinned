from django.db.models import Q

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


class Get3RandomLandmarks(APIView):
    """
    랜덤한 3개의 랜드마크의 이름, 썸네일, 위치를 띄울 때 사용되는 API.
    """

    def get(self, request):
        pass


class GetLandmark(APIView):
    """
    특정 랜드마크의 정보(게시물 수, 좋아요 수 포함)를 불러오는 API.
    """

    def get(self, request):
        pass


class SearchLandmark(APIView):
    """
    특정 랜드마크를 검색할 때 사용되는 API.
    """

    def get(self, request):
        search_word = request.data.get("landmark_name", None)

        if search_word is None:
            return Response(
                {"is_success": False, "detail": "landmark_name is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        landmarks = Landmark.objects.filter(
            Q(landmark_name__icontains=search_word)
        ).order_by("landmark_name")

        serializer = LandmarkDetailSerializer(landmarks, many=True)
        return Response({"landmarks": serializer.data}, status=status.HTTP_200_OK)


class GetLandmarkPosts(APIView):
    """
    특정 랜드마크에 pin 되어 있는 게시물들을 불러올 때 사용되는 API.
    """

    def get(self, request):
        pass
