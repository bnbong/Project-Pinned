from . import views

from django.urls import path

urlpatterns = [
    path("", views.PostCreate.as_view(), name="make-post"),
    path("<int:post_id>/", views.PostView.as_view(), name="post-crud"),
    path("<str:user_id>/", views.PostsByUser.as_view(), name="posts-by-user"),
    path("feed/", views.PostFeed.as_view(), name="post-feed"),
]
