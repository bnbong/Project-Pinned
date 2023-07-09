from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient
from rest_framework import status

from .models import Landmark


class LandmarkAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.landmark1 = Landmark.objects.create(
            name="가평쁘띠프랑스", location_lat=127.4901402404, location_lon=37.7149957543
        )

    def test_get_landmark_info(self):
        url = reverse("landmark-info", kwargs={"landmark_id": self.landmark1.id})
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_landmark_info_failure(self):
        url = reverse("landmark-info", kwargs={"landmark_id": -1})
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_landmark_posts(self):
        url = reverse("landmark-posts", kwargs={"landmark_id": self.landmark1.id})
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_landmark_posts_failure(self):
        url = reverse("landmark-posts", kwargs={"landmark_id": -1})
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_recommended_landmarks(self):
        url = reverse("get-3-landmarks")
        response = self.client.get(url, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_landmark(self):
        search_word = "가평"
        url = reverse("landmark-search")
        response = self.client.get(url, {"landmark_name": search_word})

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        landmarks = response.data["landmarks"]
        self.assertEqual(len(landmarks), 1)
        self.assertEqual(landmarks[0]["landmark_name"], "가평쁘띠프랑스")

    def test_search_landmark_failure(self):
        url = reverse("landmark-search")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def tearDown(self):
        self.landmark1.delete()
