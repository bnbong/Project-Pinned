echo "Delete dangling images..."
docker rmi $(docker images -f "dangling=true" -q)

echo "Checking if Docker volumes exist..."
VOLUME=$(docker volume ls -q | grep "postgres_data")

if [[ -z "$VOLUME" ]]; then
  echo "No Docker volumes exist..."
  echo "Deleting exist docker volumes..."
  docker compose -f docker-compose.test.yml down --volumes

  docker rmi $(docker images -f "dangling=true" -q)

  echo "building container..."
  docker compose -f docker-compose.test.yml up -d --build

  echo "Applying Schemas to Database..."
  docker exec -it "project-pinned-backend-1" python manage.py migrate

  echo "Applying Landmark Bigdatas to Database..."
  docker exec -it "project-pinned-backend-1" python manage.py landmarkloader media/RB_LANDMARK_INFO_20211231.csv

  echo "Making Mock datas at Database..."
  docker exec -it "project-pinned-backend-1" bash -c "echo 'from django.contrib.auth import get_user_model; User = get_user_model(); user1 = User(username=\"user1\", email=\"user1@test.com\"); user1.set_password(\"password123\"); user1.save(); user2 = User(username=\"user2\", email=\"user2@test.com\"); user2.set_password(\"password123\"); user2.save(); user3 = User(username=\"user3\", email=\"user3@test.com\"); user3.set_password(\"password123\"); user3.save()' | python manage.py shell"
  docker exec -it "project-pinned-backend-1" python manage.py shell -c "
  from apps.user.models import User
  from apps.landmark.models import Landmark
  from apps.post.models import Post

  user = User.objects.first()

  Post.objects.create(user=user, landmark=Landmark.objects.first(), title='Test Post', content='This is a test post.')
  Post.objects.create(user=user, landmark=Landmark.objects.filter(name='숭례문').first(), title='숭례문 데이트코스', content='연애하고싶다')
  Post.objects.create(user=User.objects.filter(username='user2').first(), landmark=Landmark.objects.filter(name='해운대').first(), title='부산의 명소, 해운대', content='너무 더운데 바다 가고 싶다')
  Post.objects.create(user=User.objects.filter(username='user3').first(), landmark=Landmark.objects.filter(name='대학로거리').first(), title='대학로거리는 최강의 대학로다.', content='한대앞 자취방 월세 하락 기원 134일차')
  Post.objects.create(user=User.objects.filter(username='user3').first(), landmark=Landmark.objects.filter(name='경주월드').first(), title='진짜 겁나 무서운 놀이공원', content='힝 놀이기구 무서워')
  "
else
  echo "Docker volumes exist. Skip deleting and creating volumes..."

  echo "building container..."
  docker compose -f docker-compose.test.yml up -d --build
fi