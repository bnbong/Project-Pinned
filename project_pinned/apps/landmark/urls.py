from django.urls import path

from . import views


urlpatterns = [
    path("recommends/", views.Get3RandomLandmarks.as_view(), name="get-3-landmarks"),
    path("search/", views.SearchLandmark.as_view(), name="landmark-search"),

    path("<landmark_id>/", views.GetLandmark.as_view(), name="landmark-info"),
    path(
        "<landmark_id>/posts/", views.GetLandmarkPosts.as_view(), name="landmark-posts"
    ),
]
