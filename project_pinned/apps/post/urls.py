from . import views

from django.urls import path

urlpatterns = [
    # for API endpoint test
    path("test/", views.PostViewTest.as_view(), name="post-view-test"),
    # Post CRUD & User's Posts and User's Feed
    path("", views.PostCreate.as_view(), name="post-create"),
    path("feed/", views.PostFeed.as_view(), name="post-feed"),
    path("posts/<user_id>/", views.PostsByUser.as_view(), name="posts-by-user"),
    path("<post_id>/", views.PostView.as_view(), name="post-view"),
    # Comment CRUD
    path("<post_id>/comments/", views.CommentCreate.as_view(), name="comment-create"),
    path(
        "<post_id>/comments/<comment_id>/",
        views.CommentView.as_view(),
        name="comment-view",
    ),
    # Like & Unlike
    path("<post_id>/like/", views.PostLike.as_view(), name="post-like"),
    path("<post_id>/unlike/", views.PostUnLike.as_view(), name="post-unlike"),
]
