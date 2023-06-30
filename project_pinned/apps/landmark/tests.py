from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status


class LandmarkAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_landmark_info(self):
        url = reverse("landmark-info", kwargs={"landmark_id": 1})
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_landmark_posts(self):
        url = reverse("landmark-posts", kwargs={"landmark_id": 1})
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_recommended_landmarks(self):
        url = reverse("get-3-landmarks")
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_landmark(self):
        url = reverse("landmark-search")
        data = {"landmark_name": "가평"}
        response = self.client.get(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
