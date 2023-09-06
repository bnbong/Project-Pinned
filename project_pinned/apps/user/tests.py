import os
import json

from PIL import Image
from io import BytesIO
from django.db import IntegrityError
from django.db.transaction import TransactionManagementError

from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from apps.notification import FirebaseManager

from .models import User, Follow, UserDevice


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
        self.test_profile_image = self.create_profile_image()

    def test_api(self):
        url = reverse("user_view_test")
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content.decode(), "Hello This is user app.")

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

    def test_user_register_duplicate_email(self):
        url = reverse("user-register")
        data = {
            "username": "user3",
            "password": "testpassword3",
            "email": "user1@example.com",
        }

        with self.assertRaises((IntegrityError, TransactionManagementError)):
            response = self.client.post(url, data, format="json")

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

    def test_get_mypage(self):
        url = reverse("user-mypage")
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "user1")

    def create_profile_image(self):
        file = BytesIO()
        image = Image.new("RGBA", size=(100, 100), color=(155, 0, 0))
        image.save(file, "png")

        file.name = "test.png"
        file.seek(0)

        return file

    def test_edit_user_profile(self):
        url = reverse("user-profile", kwargs={"user_id": str(self.user1.user_id)})
        data = {"username": "updateduser1"}
        self.client.force_authenticate(user=self.user1)
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.get(id=self.user1.id).username, "updateduser1")

    def test_edit_user_profile_image(self):
        url = reverse("user-profile", kwargs={"user_id": str(self.user1.user_id)})

        profile_image_file = self.create_profile_image()

        data = {"profile_image": self.test_profile_image}
        self.client.force_authenticate(user=self.user1)
        response = self.client.put(url, data, format="multipart")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(User.objects.get(id=self.user1.id).profile_image)

        self.user1.profile_image.delete()

    def test_edit_other_user_profile(self):
        url = reverse("user-profile", kwargs={"user_id": str(self.user2.user_id)})
        data = {"username": "updateduser1"}
        self.client.force_authenticate(user=self.user1)
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_follow(self):
        url = reverse("user-follow", kwargs={"user_id": str(self.user2.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Follow.objects.filter(follower=self.user1, following=self.user2).exists()
        )

    def test_user_already_follow(self):
        Follow.objects.create(follower=self.user1, following=self.user2)
        url = reverse("user-follow", kwargs={"user_id": str(self.user2.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "already followed user")

    def test_user_follow_self(self):
        url = reverse("user-follow", kwargs={"user_id": str(self.user1.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "You cannot follow yourself")

    def test_user_unfollow(self):
        Follow.objects.create(follower=self.user1, following=self.user2)
        url = reverse("user-unfollow", kwargs={"user_id": str(self.user2.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(
            Follow.objects.filter(follower=self.user1, following=self.user2).exists()
        )

    def test_user_already_unfollow(self):
        url = reverse("user-unfollow", kwargs={"user_id": str(self.user2.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "already unfollowed user")

    def test_user_unfollow_self(self):
        url = reverse("user-unfollow", kwargs={"user_id": str(self.user1.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "You cannot unfollow yourself")

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

    def test_other_user_delete(self):
        url = reverse("user-delete", kwargs={"user_id": str(self.user2.user_id)})
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

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

        self.client.cookies['refresh_token'] = str(test_user_token)

        response = self.client.post(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_search(self):
        search_word = "user"
        url = reverse("user-search")
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(url, {"username": search_word})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("searched_users", response.data)

        searched_users = response.data["searched_users"]
        self.assertEqual(len(searched_users), 2)

        self.assertEqual(searched_users[0]["username"], "user1")
        self.assertEqual(searched_users[1]["username"], "user2")

    def test_user_search_failure(self):
        url = reverse("user-search")
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "username is required")


class FCMTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            email="test@testmail.com",
            password="testpassword1",
            username="testuser1",
        )

    # def test_send_notification(self):
    #     mock_token = "thisistestnotificationtoken"  # 실제 테스트를 하기 위해서는 해당 토큰을 클라이언트로부터 실제로 받아와야 함
    #     UserDevice.objects.create(user=self.user1, fcmToken=mock_token)

    #     firebase_manager = FirebaseManager.getInstance()
    #     firebase_manager.send_notification_with_fcm(
    #         mock_token, "test_title", "test_body"
    #     )
