from django.contrib import admin

from .models import User, Follow


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'is_staff', 'is_active', 'date_joined']
    list_display_links = ['id', 'username', 'email', 'is_staff', 'is_active', 'date_joined']


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ['id', 'follower', 'following']
    list_display_links = ['id', 'follower', 'following']
