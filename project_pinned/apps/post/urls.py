from . import views

from django.urls import path

urlpatterns = [
    # for API endpoint test
    path("test/", views.PostViewTest.as_view(), name="post-view-test"),
    
    # Post CRUD & User's Posts and User's Feed
    path("", views.PostCreate.as_view(), name="post-create"),
    path("<int:post_id>/", views.PostView.as_view(), name="post-view"),
    path("<str:user_id>/", views.PostsByUser.as_view(), name="posts-by-user"),
    path("feed/", views.PostFeed.as_view(), name="post-feed"),
]
