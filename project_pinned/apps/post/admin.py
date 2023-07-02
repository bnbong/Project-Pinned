from django.contrib import admin

from .models import Post, Image, Comment, Like


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'landmark', 'title', 'content', 'created_at', 'updated_at']
    list_display_links = ['id', 'user', 'landmark', 'title', 'content', 'created_at', 'updated_at']


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'post', 'image', 'created_at']
    list_display_links = ['id', 'post', 'image', 'created_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'post', 'content', 'created_at', 'updated_at']
    list_display_links = ['id', 'user', 'post', 'content', 'created_at', 'updated_at']


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'post', 'created_at']
    list_display_links = ['id', 'user', 'post', 'created_at']
