from django.urls import path, include
from dj_rest_auth.views import LoginView, LogoutView

from rest_framework_simplejwt.views import (
    TokenVerifyView,
    TokenRefreshView,
    TokenBlacklistView,
)

from . import views


token_patterns = [
    path("verify/", TokenVerifyView.as_view(), name="jwt-verify"),
    path("refresh/", TokenRefreshView.as_view(), name="jwt-refresh"),
    path("blacklist/", TokenBlacklistView.as_view(), name="jwt-blacklist"),
]

urlpatterns = [
    # for API endpoint test
    path("test/", views.UserViewTest.as_view(), name="user_view_test"),

    # Basic user login & registration
    path("login/", views.UserLogin.as_view(), name="user-login"),
    path("logout/", LogoutView.as_view(), name="user-logout"),
    path("register/", views.UserRegister.as_view(), name="user-register"),
    path("search/", views.UserSearch.as_view(), name="user-search"),
    
    # For individual user's information
    path("<user_id>/withdrawal/", views.UserDelete.as_view(), name="user-delete"),
    path("<user_id>/profile/", views.UserProfile.as_view(), name="user-profile"),
    path("<user_id>/follow/", views.UserFollow.as_view(), name="user-follow"),
    path("<user_id>/unfollow/", views.UserUnFollow.as_view(), name="user-unfollow"),
    path("<user_id>/followers/", views.UserFollowers.as_view(), name="user-followers"),
    path(
        "<user_id>/followings/", views.UserFollowings.as_view(), name="user-followings"
    ),
    path("mypage/", views.UserMyPage.as_view(), name="user_mypage"),

    # For user's token validate & refresh
    path("token/", include(token_patterns)),
    
    # For user's device token
    path("device/", views.UserFCMToken.as_view(), name="user-device-token"),
]
