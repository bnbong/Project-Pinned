from django.urls import path
from .views import UserViewTest


urlpatterns = [
    path("test/", UserViewTest.as_view(), name="user_view_test")
]