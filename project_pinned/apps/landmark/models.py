from django.db import models
from django.conf import settings

class Landmark(models.Model):
    name = models.CharField(max_length=100, unique=True)
    location_lat = models.DecimalField(max_digits=9, decimal_places=6)
    location_lon = models.DecimalField(max_digits=9, decimal_places=6)
    image = models.ImageField(null=True, blank=True, upload_to=settings.MEDIA_ROOT)