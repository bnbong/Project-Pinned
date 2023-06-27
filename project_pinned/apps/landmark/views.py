from rest_framework.views import APIView


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
        pass


class GetLandmarkPosts(APIView):
    """
    특정 랜드마크에 pin 되어 있는 게시물들을 불러올 때 사용되는 API.
    """

    def get(self, request):
        pass
