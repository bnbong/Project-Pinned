from rest_framework import serializers

from .models import Landmark


class LandmarkDetailSerializer(serializers.ModelSerializer):
    # TODO: Specify more information about landmark.
    class Meta:
        model = Landmark
        fields = ('id', 'name', 'location_lat', 'location_lon')


class LandmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landmark
        fields = ('name', 'location_lat', 'location_lon')
