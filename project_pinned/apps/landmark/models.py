from django.db import models
from django.conf import settings


class Landmark(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    location_lat = models.DecimalField(max_digits=20, decimal_places=10)
    location_lon = models.DecimalField(max_digits=20, decimal_places=10)
    image = models.ImageField(null=True, blank=True, upload_to='landmark_thumbnails/')
