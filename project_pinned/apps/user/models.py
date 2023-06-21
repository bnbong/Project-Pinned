from django.db import models
from apps.base.models import BaseModel


class User(BaseModel):
    user_name = models.CharField(max_length=100)
    password = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    profile_image = models.ImageField()

    def __str__(self):
        return f"{self.user_name} {self.email}"


class Follow(BaseModel):
    pass
