from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Follow


User = get_user_model()


class UserAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username="user1", password="testpassword1", email="user1@example.com"
        )
        self.user2 = User.objects.create_user(
            username="user2", password="testpassword2", email="user2@example.com"
        )

    def test_user_registration(self):
        url = reverse("user-register")
        data = {
            "username": "user3",
            "password": "testpassword3",
            "email": "user3@example.com",
        }
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(User.objects.latest("id").username, "user3")

    def test_user_login(self):
        url = reverse("user-login")
        data = {"email": "user1@example.com", "password": "testpassword1"}
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)

    def test_get_user_profile(self):
        url = reverse("user-profile", kwargs={"user_id": str(self.user1.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "user1")

    def test_edit_user_profile(self):
        url = reverse("user-profile", kwargs={"user_id": str(self.user1.user_id)})
        data = {"username": "updateduser1"}
        self.client.force_authenticate(user=self.user1)
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.get(id=self.user1.id).username, "updateduser1")

    def test_user_follow(self):
        url = reverse("user-follow", kwargs={"user_id": str(self.user2.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Follow.objects.filter(follower=self.user1, following=self.user2).exists()
        )

    def test_user_unfollow(self):
        Follow.objects.create(follower=self.user1, following=self.user2)
        url = reverse("user-unfollow", kwargs={"user_id": str(self.user2.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(
            Follow.objects.filter(follower=self.user1, following=self.user2).exists()
        )

    def test_check_followers(self):
        Follow.objects.create(follower=self.user1, following=self.user2)
        url = reverse("user-followers", kwargs={"user_id": str(self.user2.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, self.user1.username)

    def test_check_followings(self):
        Follow.objects.create(follower=self.user1, following=self.user2)
        url = reverse("user-followings", kwargs={"user_id": str(self.user1.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, self.user2.username)

    def test_user_delete(self):
        url = reverse("user-delete", kwargs={"user_id": str(self.user1.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(User.objects.filter(id=self.user1.id).count(), 0)

    def test_jwt_verify(self):
        url = reverse("jwt-verify")
        test_user_token = RefreshToken.for_user(self.user1)
        data = {
            "token": str(test_user_token.access_token),
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_jwt_refresh(self):
        url = reverse("jwt-refresh")
        test_user_token = RefreshToken.for_user(self.user1)
        data = {
            "refresh": str(test_user_token),
        }

        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
