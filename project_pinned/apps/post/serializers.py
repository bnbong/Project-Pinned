from rest_framework import serializers

from .models import Post, Image, Landmark

class ImageSerializer(serializers.ModelSerializer):
    post_picture = serializers.ListField(child=serializers.ImageField(), source='image')

    class Meta:
        model = Image
        fields = ('post_picture')

class LandmarkSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source = 'name')
    landmark_lat = serializers.DecimalField(source='location_lat', max_digits=9, decimal_places=6)
    landmark_lon = serializers.DecimalField(source='location_lon', max_digits=9, decimal_places=6)

    def get_instance(self, validated_data):
        name = validated_data.get('name')
        location_lat = validated_data.get('landmark_lat')
        location_lon = validated_data.get('landmark_lon')
        landmark= Landmark.objects.get(
            name=name,
            location_lat=location_lat,
            location_lon=location_lon
        )
        return landmark

    class Meta:
        model = Landmark
        fields = ('name', 'landmark_lat', 'landmark_lon')


class PostCreateSerializer(serializers.ModelSerializer):
    post_title = serializers.CharField(source='title')
    post_content = serializers.CharField(source='content')
    post_picture = serializers.ListField(child=serializers.ImageField())
    landmark = serializers.SerializerMethodField(method_name='get_landmark')

    class Meta:
        model = Post
        fields = (
            'post_title',
            'post_content',
            'post_picture',
            'landmark',
        )

    def get_landmark(self, obj):
        landmark_data = LandmarkSerializer(obj["landmark"], context=self.context).data
        

        return landmark_data

    # def create(self, validated_data):
    #     user = self.context['user']

    #     post = Post.objects.create(user=user, landmark=landmark, title=validated_data['post_title'], content=validated_data['post_content'])
        
    #     # post_pictures = validated_data.pop('post_picture', [])
    #     # for picture in post_pictures:
    #     #     Image.objects.create(post=post, image=picture)
    #     return post

    def save(self, request):
        user = request.user

        landmark_data = request.data.get('landmark')
        # landmark_data = LandmarkSerializer.get_landmark(landmark_data)
        # landmark_data = Landmark.objects.get(id=4)

        post = Post.objects.create(user=user, landmark=landmark_data, title=request.data.get('post_title'), content=request.data.get('post_content'))
        post.save()
        return post

class PostSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = Post
        fields = ("post_id", "user_id")