from django.db import models
from apps.base.models import BaseModel
from apps.user.models import User
from apps.landmark.models import Landmark
from django.conf import settings


class Post(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    landmark = models.ForeignKey(Landmark, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

class Image(BaseModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    image = models.ImageField(null=True, blank=True, upload_to='post_images/')


class Comment(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)


class Like(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)