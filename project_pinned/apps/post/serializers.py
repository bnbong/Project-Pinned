from rest_framework import serializers

from .models import Post, Image, Landmark


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ("id", "image")


class PostCreateSerializer(serializers.ModelSerializer):
    post_title = serializers.CharField(source="title")
    post_content = serializers.CharField(source="content")
    post_image = ImageSerializer(source="images", many=True, required=False)
    landmark_name = serializers.CharField()

    class Meta:
        model = Post
        fields = (
            "post_title",
            "post_content",
            "post_image",
            "landmark_name",
        )

    def save(self, request):
        user = request.user

        landmark_name = request.data.get("landmark_name")

        landmark = Landmark.objects.get(
            name=landmark_name,
        )

        post = Post.objects.create(
            user=user,
            landmark=landmark,
            title=request.data.get("post_title"),
            content=request.data.get("post_content"),
        )
        post.save()
        return post


class PostSerializer(serializers.ModelSerializer):
    post_id = serializers.IntegerField(source="id", required=False)
    user_id = serializers.CharField(source="user.user_id", required=False)
    post_title = serializers.CharField(source="title")
    post_content = serializers.CharField(source="content")
    post_image = ImageSerializer(source="images", many=True)
    landmark_name = serializers.CharField(source="landmark.name", required=False)
    landmark_lat = serializers.DecimalField(
        source="landmark.location_lat", max_digits=20, decimal_places=10, required=False
    )
    landmark_lon = serializers.DecimalField(
        source="landmark.location_lon", max_digits=20, decimal_places=10, required=False
    )

    def update(self, instance, data):
        instance.title = data.get('post_title', instance.title)
        instance.content = data.get('post_content', instance.content)

        post_images = data.get('post_image')
        if post_images:
            Image.objects.filter(post=instance).delete()

            for image_data in post_images:
                Image.objects.create(post=instance, image=image_data)

        # Save the updated instance
        instance.save()
        return instance



    class Meta:
        model = Post
        fields = (
            "post_id",
            "user_id",
            "post_title",
            "post_content",
            "post_image",
            "landmark_name",
            "landmark_lat",
            "landmark_lon",
            "created_at"
        )
