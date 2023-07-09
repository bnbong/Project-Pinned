from rest_framework import serializers

from .models import Landmark
from apps.post.models import Like


class LandmarkSerializer(serializers.ModelSerializer):
    landmark_name = serializers.CharField(source="name")
    landmark_latitute = serializers.DecimalField(
        source="location_lat", max_digits=20, decimal_places=10
    )
    landmark_longitude = serializers.DecimalField(
        source="location_lon", max_digits=20, decimal_places=10
    )
    landmark_thumbnails = serializers.ImageField(source="image")

    class Meta:
        model = Landmark
        fields = (
            "landmark_name",
            "landmark_latitute",
            "landmark_longitude",
            "landmark_thumbnails",
        )


class LandmarkDetailSerializer(LandmarkSerializer):
    landmark_posts = serializers.SerializerMethodField()
    landmark_likes = serializers.SerializerMethodField()

    def get_landmark_posts(self, landmark):
        return landmark.posts.count()

    def get_landmark_likes(self, landmark):
        return Like.objects.filter(post__landmark=landmark).count()

    class Meta:
        model = Landmark
        fields = (
            "landmark_name",
            "landmark_latitute",
            "landmark_longitude",
            "landmark_thumbnails",
            "landmark_posts",
            "landmark_likes",
        )
