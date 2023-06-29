from rest_framework import serializers

from .models import Landmark


class LandmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Landmark
        fields = ('name', 'location_lat', 'location_lon')