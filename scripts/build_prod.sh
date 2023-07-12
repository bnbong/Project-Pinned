echo "Delete dangling images and stop outdated running containers..."
docker compose stop
docker rmi $(docker images -f "dangling=true" -q)

echo "Checking if Docker volumes exist..."
VOLUME=$(docker volume ls -q | grep "postgres_data")

if [[ -z "$VOLUME" ]]; then
  echo "No Docker volumes exist..."
  echo "Deleting exist docker volumes..."
  docker compose -f docker-compose.prod.yml down --volumes

  docker rmi $(docker images -f "dangling=true" -q)

  echo "building container..."
  docker compose -f docker-compose.prod.yml up --build -d

  echo "Applying Schemas to Database..."
  docker exec -it "project-pinned-backend-1" python manage.py migrate

  echo "Applying Landmark Bigdatas to Database..."
  docker exec -it "project-pinned-backend-1" python manage.py landmarkloader media/RB_LANDMARK_INFO_20211231.csv

  echo "Making Mock datas at Database..."
  # source .env
  docker exec -it "project-pinned-backend-1" bash -c "echo 'from django.contrib.auth import get_user_model; User = get_user_model(); user1 = User(username=\"user1\", email=\"user1@test.com\"); user1.set_password(\"password123\"); user1.save(); user2 = User(username=\"이준혁\", email=\"user2@test.com\"); user2.set_password(\"password123\"); user2.save(); user3 = User(username=\"최수용\", email=\"user3@test.com\"); user3.set_password(\"password123\"); user3.save();' | python manage.py shell"
  docker exec -it "project-pinned-backend-1" python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); user1 = User.objects.get(id=1); user2 = User.objects.get(id=2); user1.following.add(user2);"
  docker exec -it "project-pinned-backend-1" python manage.py shell -c "from apps.user.models import User; from apps.landmark.models import Landmark; from apps.post.models import Post, Image; import os; user = User.objects.first(); post1 = Post.objects.create(user=user, landmark=Landmark.objects.first(), title='Test Post', content='This is a test post.'); post2 = Post.objects.create(user=user, landmark=Landmark.objects.filter(name='숭례문').first(), title='숭례문 데이트코스', content='숭례문에는 과거에 가슴 아픈 사연이 있었다. 국보 1호인 숭례문은 1398년 조선 제4대 임금 태종이 세운 것으로, 조선시대 왕궁인 경복궁과 창덕궁을 연결하는 길목에 세워진 문이다. 엄청 긴 역사를 자랑하고 일제 강점기때도 자랑스러운 위태를 자랑하던 숭례문은 방화 사건에 휘말려 긴 시간동안 보수에 들어갔었고 다시 옛날에 그 멋진 자태로 우리에게 돌아왔다.');
image2_url = 'post_images/honorguardinspection.png'
Image.objects.create(post=post2, image=image2_url)

post3 = Post.objects.create(user=User.objects.filter(username='이준혁').first(), landmark=Landmark.objects.filter(name='해운대').first(), title='부산의 명소, 해운대', content='부산의 명소, 해운대. 요즘 날씨가 정말 많이 더운데요. 안그래도 푹푹 찌는 날씨인데 심지어 이번주에는 엄청난 장마 소식까지 있습니다. 실제로 저희 집 동네에서는 비가 많이 오면 집 근처 탄천은 물에 잠겨서 지나다니지 못하는경우도 생겨요..')
image3_url = 'post_images/sea.png'
Image.objects.create(post=post3, image=image3_url)

post4 = Post.objects.create(user=User.objects.filter(username='최수용').first(), landmark=Landmark.objects.filter(name='화개장터').first(), title='대학로거리는 최강의 대학로다.', content='화개장터! 기억하는 사람이 있는지는 모르겠지만 옛날에 화개장터라는 노래가 있지 않았나요? ㅋㅋㅋ 오랜만에 카페에서 공부를 하다가 화개장터 노래가 나오는 거예요. 노래가 너무 반가운것도 반가운 거지만 갑자기 화개장터가 가고 싶어져서 여자친구랑 번개로 약속을 잡아 다녀오게 되었답니다.')
image4_url = 'post_images/hwaguea.jpeg'
Image.objects.create(post=post4, image=image4_url)

post5 = Post.objects.create(user=User.objects.filter(username='최수용').first(), landmark=Landmark.objects.filter(name='춘천명동거리').first(), title='춘천에는 짭 명동이 있다?', content='명동이라는 단어를 들으면 떠오르는 단어가 무엇인가요? 보통 수도권에 사는 사람들은 명동이라는 단어를 들으면 서울에 있는 명동을 떠올리곤 할텐데요, 춘천에도 명동이라는 이름을 가진 명동거리가 있습니다. 바로 춘천 명동 거리입니다.')
image5_url = 'post_images/ccmyeongdong.jpeg'
Image.objects.create(post=post5, image=image5_url)

post6 = Post.objects.create(user=User.objects.filter(username='이준혁').first(), landmark=Landmark.objects.filter(name='제주공룡랜드').first(), title='제주공룡랜드의 모험', content='제주공룡랜드는 제주도에서 가장 유명한 테마파크 중 하나입니다. 공룡들의 복원된 모습을 볼 수 있어 아이들에게는 특히 인기가 많습니다. 직접 공룡뼈를 파낼 수 있는 체험도 가능하여, 가족 여행지로 손색이 없습니다.')
image6_url = 'post_images/bukchon.png'
Image.objects.create(post=post6, image=image6_url)

post7 = Post.objects.create(user=User.objects.filter(username='user1').first(), landmark=Landmark.objects.filter(name='용두암').first(), title='용두암에서 바라본 바다', content='용두암은 제주도에서 가장 아름다운 일몰을 볼 수 있는 장소 중 하나입니다. 바위 위에 앉아 바다를 바라보면, 모든 걱정과 스트레스가 사라집니다.')
image7_url = 'post_images/ssamziegil.png'
Image.objects.create(post=post7, image=image7_url)

post8 = Post.objects.create(user=User.objects.filter(username='이준혁').first(), landmark=Landmark.objects.filter(name='땅끝마을').first(), title='땅끝마을의 여유', content='땅끝마을은 한반도의 가장 남쪽 끝에 위치한 마을로, 마치 세상 끝에 다다른 듯한 느낌을 줍니다. 바다와 하늘, 그리고 땅이 모두 만나는 이 곳에서는 평온함과 여유를 느낄 수 있습니다.')
image8_url = 'post_images/cheonggyecheon.png'
Image.objects.create(post=post8, image=image8_url)"
else
  echo "Docker volumes exist. Skip deleting and creating volumes..."

  echo "building container..."
  docker compose -f docker-compose.prod.yml up --build -d
fi
