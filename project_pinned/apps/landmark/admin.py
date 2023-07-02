from django.contrib import admin

from .models import Landmark


@admin.register(Landmark)
class LandmarkAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'location_lat', 'location_lon']
    list_display_links = ['id', 'name', 'location_lat', 'location_lon']
