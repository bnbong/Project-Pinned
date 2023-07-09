import uuid
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.user.models import User, Follow
from apps.landmark.models import Landmark
from .models import Post, Comment, Like


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

    def test_api(self):
        url = reverse("post-view-test")
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content.decode(), "Hello This is post app.")

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

    def test_get_post_failure(self):
        url = reverse("post-view", kwargs={"post_id": -1})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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

    def test_update_post_failure(self):
        url = reverse("post-view", kwargs={"post_id": -1})
        data = {
            "post_title": "Updated Post",
            "post_content": "This is an updated post.",
            "post_image": [],
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_other_post(self):
        self.user2 = User.objects.create_user(
            username="testuser2", email="test2@example.com", password="testpassword2"
        )
        self.post3 = Post.objects.create(
            user=self.user2,
            landmark=self.landmark,
            title="Test Post3",
            content="This is a third test post.",
        )
        url = reverse("post-view", kwargs={"post_id": self.post3.id})
        data = {
            "post_title": "Updated Post",
            "post_content": "This is an updated post.",
            "post_image": [],
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_post(self):
        url = reverse("post-view", kwargs={"post_id": self.post.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Post.objects.filter(id=self.post.id).exists())

    def test_delete_post_failure(self):
        url = reverse("post-view", kwargs={"post_id": -1})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_others_post(self):
        self.user2 = User.objects.create_user(
            username="testuser2", email="test2@example.com", password="testpassword2"
        )
        self.post3 = Post.objects.create(
            user=self.user2,
            landmark=self.landmark,
            title="Test Post3",
            content="This is a third test post.",
        )
        url = reverse("post-view", kwargs={"post_id": self.post3.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_users_post(self):
        url = reverse("posts-by-user", kwargs={"user_id": self.user.user_id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["user_posts"]), 2)

    def test_get_users_post_failure(self):
        url = reverse("posts-by-user", kwargs={"user_id": uuid.uuid4()})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_feed(self):
        self.user2 = User.objects.create_user(
            username="testuser2", email="test2@example.com", password="testpassword2"
        )
        self.post3 = Post.objects.create(
            user=self.user2,
            landmark=self.landmark,
            title="Test Post3",
            content="This is a third test post.",
        )
        Follow.objects.create(follower=self.user2, following=self.user)

        url = reverse("post-feed")
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["followed_posts"]), 2)
        self.assertGreaterEqual(
            response.data["followed_posts"][0]["created_at"],
            response.data["followed_posts"][1]["created_at"],
        )
        self.assertEqual(len(response.data["trending_posts"]), 3)
        self.assertEqual(response.data["trending_posts"][0]["post_id"], self.post.id)
        self.assertEqual(len(response.data["recommended_posts"]), 3)

    def test_get_feed_with_offset(self):
        url = reverse("post-feed")
        self.client.force_authenticate(user=self.user)

        for i in range(15):
            self.post = Post.objects.create(
                user=self.user,
                landmark=self.landmark,
                title=f"Test Post {i}",
                content=f"This is a test content {i}",
            )

        response_firstpage = self.client.get(url + "?offset=0&limit=10")
        self.assertEqual(response_firstpage.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_firstpage.data.get("trending_posts")), 10)

        response_secondpage = self.client.get(url + "?offset=10&limit=10")
        self.assertEqual(response_secondpage.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_secondpage.data.get("trending_posts")), 7)

    def test_create_comment(self):
        url = reverse("comment-create", kwargs={"post_id": self.post.id})
        data = {
            "comment_content": "Test Comment",
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_comment_failure(self):
        url = reverse("comment-create", kwargs={"post_id": -1})
        data = {
            "comment_content": "Test Comment",
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_comment(self):
        url = reverse(
            "comment-view",
            kwargs={"post_id": self.post.id, "comment_id": self.comment.id},
        )
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["comment_content"], self.comment.content)

    def test_get_comment_failure(self):
        url = reverse(
            "comment-view",
            kwargs={"post_id": self.post.id, "comment_id": -1},
        )
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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

    def test_update_comment_failure(self):
        url = reverse(
            "comment-view",
            kwargs={"post_id": self.post.id, "comment_id": -1},
        )
        data = {
            "comment_content": "Edit Comment",
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_others_comment(self):
        self.user2 = User.objects.create_user(
            username="testuser2", email="test2@example.com", password="testpassword2"
        )
        self.comment2 = Comment.objects.create(
            user=self.user2, post=self.post, content="Test Content2"
        )
        url = reverse(
            "comment-view",
            kwargs={"post_id": self.post.id, "comment_id": self.comment2.id},
        )
        data = {
            "comment_content": "Edit Comment",
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_comment(self):
        url = reverse(
            "comment-view",
            kwargs={"post_id": self.post.id, "comment_id": self.comment.id},
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comment.objects.filter(id=self.comment.id).exists())

    def test_delete_comment_failure(self):
        url = reverse(
            "comment-view",
            kwargs={"post_id": self.post.id, "comment_id": -1},
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_others_comment(self):
        self.user2 = User.objects.create_user(
            username="testuser2", email="test2@example.com", password="testpassword2"
        )
        self.comment2 = Comment.objects.create(
            user=self.user2, post=self.post, content="Test Content2"
        )
        url = reverse(
            "comment-view",
            kwargs={"post_id": self.post.id, "comment_id": self.comment2.id},
        )
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_comments(self):
        url = reverse("comment-create", kwargs={"post_id": self.post.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["comments"]), 1)

    def test_get_comments_failure(self):
        url = reverse("comment-create", kwargs={"post_id": -1})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_like(self):
        url = reverse("post-like", kwargs={"post_id": self.post2.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.post2.likes.count(), 1)

    def test_post_like_failure(self):
        url = reverse("post-like", kwargs={"post_id": -1})
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_already_like(self):
        url = reverse("post-like", kwargs={"post_id": self.post.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_unlike(self):
        url = reverse("post-unlike", kwargs={"post_id": self.post.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.post.likes.count(), 0)

    def test_post_unlike_failure(self):
        url = reverse("post-unlike", kwargs={"post_id": -1})
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_already_unlike(self):
        url = reverse("post-unlike", kwargs={"post_id": self.post2.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
