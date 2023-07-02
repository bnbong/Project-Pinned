from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.user.models import User
from apps.landmark.models import Landmark
from .models import Post, Comment, Like, Image


class PostTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpassword"
        )

        self.landmark = Landmark.objects.create(
            name="Test Landmark",
            location_lat=127.4901402404,
            location_lon=37.7149957543,
        )

        self.post = Post.objects.create(
            user=self.user,
            landmark=self.landmark,
            title="Test Post",
            content="This is a test post.",
        )
        self.post2 = Post.objects.create(
            user=self.user,
            landmark=self.landmark,
            title="Test Post2",
            content="This is a second test post.",
        )

        self.comment = Comment.objects.create(
            user=self.user, post=self.post, content="Test Content"
        )

        self.like = Like.objects.create(user=self.user, post=self.post)

    def test_create_post(self):
        url = reverse("post-create")
        data = {
            "post_title": "Test Post",
            "post_content": "This is a test post.",
            "post_picture": [],
            "landmark_name": "Test Landmark",
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_post(self):
        url = reverse("post-view", kwargs={"post_id": self.post.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["post_title"], self.post.title)

    def test_update_post(self):
        url = reverse("post-view", kwargs={"post_id": self.post.id})
        data = {
            "post_title": "Updated Post",
            "post_content": "This is an updated post.",
            "post_image": [],
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["post_title"], data["post_title"])

    def test_delete_post(self):
        url = reverse("post-view", kwargs={"post_id": self.post.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Post.objects.filter(id=self.post.id).exists())

    def test_get_users_post(self):
        url = reverse("posts-by-user", kwargs={"user_id": self.user.user_id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["user_posts"]), 2)

    def test_get_feed(self):
        pass

    def test_create_comment(self):
        url = reverse("comment-create", kwargs={"post_id": self.post.id})
        data = {
            "comment_content": "Test Comment",
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_comment(self):
        url = reverse(
            "comment-view",
            kwargs={"post_id": self.post.id, "comment_id": self.comment.id},
        )
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["comment_content"], self.comment.content)

    def test_update_comment(self):
        url = reverse(
            "comment-view",
            kwargs={"post_id": self.post.id, "comment_id": self.comment.id},
        )
        data = {
            "comment_content": "Edit Comment",
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_comment(self):
        url = reverse(
            "comment-view",
            kwargs={"post_id": self.post.id, "comment_id": self.comment.id},
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comment.objects.filter(id=self.comment.id).exists())

    def test_get_comments(self):
        url = reverse("comment-create", kwargs={"post_id": self.post.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["comments"]), 1)

    def test_post_like(self):
        url = reverse("post-like", kwargs={"post_id", self.post.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.post.likes, 1)

    def test_post_unlike(self):
        url = reverse("post-unlike", kwargs={"post_id", self.post.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.post.likes, 0)
