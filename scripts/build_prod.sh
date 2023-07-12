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

  echo "Making Mock datas at Database..."
  docker exec -it "project-pinned-backend-1" python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); user1 = User.objects.filter(username='user1').first(); user2 = User.objects.filter(username='이준혁').first(); user1.following.add(user2);"
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
Image.objects.create(post=post8, image=image8_url)

user4 = User(username=\"박종윤\", email=\"user4@test.com\"); user4.set_password(\"password123\"); user4.save(); user5 = User(username=\"허재원\", email=\"user5@test.com\"); user5.set_password(\"password123\"); user5.save();
post9 = Post.objects.create(user=User.objects.filter(username='박종윤').first(), landmark=Landmark.objects.filter(name='에버랜드').first(), title='모험과 즐거움의 나라, 에버랜드에서의 특별한 하루', content='안녕하세요! 오늘은 에버랜드에 대한 후기를 남겨볼게요. 에버랜드는 정말 모험과 즐거움이 넘치는 곳이에요. 나는 이곳을 방문하면서 마치 어린 시절의 꿈이 이뤄진 것 같은 기분을 느꼈어요. 롤러코스터에 올라서는 순간, 내 안에 있는 용기와 스릴이 폭발하면서 놀라운 경험을 했어요. 놀이기구 외에도 다양한 쇼와 엔터테인먼트 프로그램들을 즐길 수 있었는데, 정말 특별하고 재미있는 시간이었어요. 친구들과 함께 즐거운 하루를 보내면서 에버랜드에서의 추억을 만들었어요. 이곳은 모든 나이대에게 즐길 수 있는 곳이지만, 특히 10대와 20대 여성에게는 더욱 특별한 매력이 있는 것 같아요. 에버랜드에서의 특별한 하루는 언제나 나의 기억 속에 특별한 자리를 지니고 있을 거예요. 다음에 또 방문하고 싶어요!')
post10 = Post.objects.create(user=User.objects.filter(username='허재원').first(), landmark=Landmark.objects.filter(name='캐리비안베이').first(), title='물의 낙원, 캐리비안베이에서의 여름 이야기', content='안녕하세요! 이번에는 에버랜드 옆에 위치한 캐리비안베이에 대한 후기를 남겨볼게요. 이곳은 정말 물의 낙원이었어요. 햇살이 화사하게 비추는 여름날, 캐리비안베이에서 시원한 워터파크를 즐기며 즐거운 여름을 보낼 수 있었어요. 높고 긴 워터슬라이드를 내려오면서 설레임과 스릴을 함께 느낄 수 있었어요. 수영장에서는 친구들과 함께 물놀이를 하며 시원함을 만끽했고, 여러 물놀이 시설을 통해 재미있는 시간을 보냈어요. 특히 10대와 20대 여성들에게는 특별한 추억을 만들 수 있는 곳이에요. 캐리비안베이에서의 여름 이야기는 나에게 특별한 기억으로 남을 거예요. 다음 여름에도 반드시 찾아가고 싶어요!')
post11 = Post.objects.create(user=User.objects.filter(username='박종윤').first(), landmark=Landmark.objects.filter(name='수지외식타운').first(), title='맛의 향연, 수지외식타운에서의 미식 여행', content='안녕하세요! 이번에는 수지외식타운에 대한 후기를 남겨볼게요. 이곳은 정말 다양한 음식과 맛의 향연이 펼쳐지는 곳이에요. 나는 대학생으로서 맛있는 음식을 찾아 떠나는 미식 여행을 즐기는데, 수지외식타운은 내 기대를 충족시켜주었어요. 다양한 음식점들이 모여있어서 내가 원하는 다양한 요리를 즐길 수 있었어요. 특히 20대 대학생들과 30대 직장인들에게는 매력적인 장소일 거예요. 각 음식점에서 제공되는 특색 있는 맛과 분위기를 즐기며, 새로운 맛과 경험을 만날 수 있었어요. 수지외식타운에서의 미식 여행은 나에게 특별한 기억으로 남을 거예요. 다음에도 또 찾아가고 싶은 곳이에요!')
post12 = Post.objects.create(user=User.objects.filter(username='최수용').first(), landmark=Landmark.objects.filter(name='죽전아울렛거리').first(), title='패션과 쇼핑의 낙원, 죽전아울렛거리에서의 특별한 시간', content='안녕하세요! 오늘은 죽전아울렛거리에 대한 후기를 남겨볼게요. 이곳은 정말 패션과 쇼핑의 낙원이었어요. 나는 대학생으로서 패션에 관심이 많아서 쇼핑을 즐기는데, 죽전아울렛거리는 내 기대를 충족시켜주었어요. 다양한 브랜드들이 모여있어서 내가 원하는 다양한 스타일을 즐길 수 있었어요. 또한, 할인된 가격으로 아이템을 구매할 수 있어서 특별한 기분이었어요. 특히 20대 대학생들에게는 매력적인 장소일 거예요. 다양한 상점을 돌아다니며 패션 아이템을 찾고, 유니크한 아이템들을 발견하며 특별한 시간을 보낼 수 있었어요. 죽전아울렛거리에서의 쇼핑은 나에게 특별한 기억으로 남을 거예요. 다음에도 또 찾아가고 싶은 곳이에요!')
post13 = Post.objects.create(user=User.objects.filter(username='박종윤').first(), landmark=Landmark.objects.filter(name='한국민속촌').first(), title='전통과 함께하는 놀이와 배움, 한국민속촌에서의 특별한 체험', content='안녕하세요! 오늘은 한국민속촌에 대한 후기를 남겨볼게요. 이곳은 전통과 함께하는 놀이와 배움의 장소였어요. 나는 초등학생 자녀를 둔 부모로서 한국의 전통문화를 체험해보고 싶어서 한국민속촌을 찾았어요. 이곳에서는 다양한 전통놀이와 공예, 민속음식 등을 체험할 수 있었어요. 특히 초등학생들에게는 교육적인 요소와 재미가 함께 있는 장소일 거예요. 자녀들과 함께 전통문화를 배우고 체험하며 소중한 시간을 보낼 수 있었어요. 한국민속촌에서의 특별한 체험은 우리 가족에게 소중한 추억으로 남을 거예요. 다음에도 또 찾아가고 싶은 곳이에요!')
post13 = Post.objects.create(user=User.objects.filter(username='이준혁').first(), landmark=Landmark.objects.filter(name='보정동까페거리').first(), title='아늑하고 로맨틱한 보정동 카페거리에서의 특별한 시간', content='안녕하세요! 오늘은 보정동 카페거리에 대한 후기를 남기려고 해요. 이곳은 정말 아늑하고 로맨틱한 분위기를 자랑하는 곳이에요. 내가 방문한 카페 중에서도 가장 특별한 경험을 할 수 있었어요. 거리를 따라 걸으면서 많은 가게들을 만나볼 수 있었는데, 매장마다 독특한 컨셉과 분위기가 있어서 선택하는 재미가 있었어요. 나는 한 곳에서는 부드러운 음악을 들으며 커피 한 잔을 즐겼고, 다른 곳에서는 아로마 향기에 휩싸여 특별한 차를 마셨어요. 그리고 걷는 동안에는 주변 가게들이 만들어내는 아름다운 풍경에 마음이 힐링되었어요. 이런 특별한 경험을 나와 함께한 친구들과 함께할 수 있어서 더욱 즐거웠어요. 보정동 카페거리는 로맨틱한 데이트나 소중한 친구들과의 시간을 보내기에 정말 좋은 장소인 것 같아요. 추천해요!')
post14 = Post.objects.create(user=User.objects.filter(username='박종윤').first(), landmark=Landmark.objects.filter(name='서울대공원').first(), title='자연과 함께하는 로맨틱한 시간, 서울대공원에서의 데이트', content='안녕하세요! 이번에는 서울대공원에 대한 후기를 남겨볼게요. 이곳은 자연과 함께하는 로맨틱한 데이트 장소였어요. 나는 대학생 커플로서 특별한 시간을 보낼만한 장소를 찾고 있었는데, 서울대공원은 내 기대를 충족시켜주었어요. 넓은 공원에서 산책하며 사랑스러운 동물들과 만나고, 아름다운 자연 풍경을 감상할 수 있었어요. 특히 20대 대학생 커플들에게는 로맨틱한 분위기를 선사하는 장소일 거예요. 함께하는 데이트에서 자연과 함께한 시간은 정말 특별하고 아름다웠어요. 서울대공원에서의 데이트는 우리 커플에게 소중한 추억으로 남을 거예요. 다음에도 또 찾아가고 싶은 곳이에요!')
post15 = Post.objects.create(user=User.objects.filter(username='이준혁').first(), landmark=Landmark.objects.filter(name='춘향테마파크').first(), title='춘향테마파크, 로맨틱한 이야기가 펼쳐지는 곳', content='안녕하세요! 오늘은 춘향테마파크에 대한 후기를 남겨볼게요. 이곳은 로맨틱한 이야기와 함께하는 장소였어요. 나는 20대 대학생 커플로서 특별한 데이트 장소를 찾고 있었는데, 춘향테마파크는 내 기대를 충족시켜주었어요. 테마파크 내부에는 춘향이와 몽룡의 사랑 이야기를 재현한 다양한 디오라마와 전시물들이 있었어요. 함께 이야기를 따라가며 사랑에 몰두하고, 로맨틱한 분위기를 즐길 수 있었어요. 특히 20대 여성들에게는 특별한 추억을 만들 수 있는 장소일 거예요. 춘향테마파크에서의 데이트는 나에게 소중한 경험이었고, 로맨틱한 이야기가 펼쳐진 곳이었어요. 다음에도 또 찾아가고 싶은 곳이에요!')
post16 = Post.objects.create(user=User.objects.filter(username='허재원').first(), landmark=Landmark.objects.filter(name='어린이나라').first(), title='어린이나라 재밌었다', content='우와 재밌다! 다음에도 가야지!!!')
post16 = Post.objects.create(user=User.objects.filter(username='최수용').first(), landmark=Landmark.objects.filter(name='남한산성유원지').first(), title='남한산성 유원지, 역사와 자연이 어우러진 특별한 곳', content='안녕하세요! 오늘은 남한산성 유원지에 대한 후기를 남겨볼게요. 이곳은 역사와 자연이 아름답게 어우러진 특별한 장소였어요. 나는 30대 남성으로서 역사에 관심이 많아서 남한산성 유원지를 찾았어요. 이곳은 고려시대에 건설된 성곽과 함께 자연환경이 조화롭게 조성되어 있어서 매력적이었어요. 성곽을 따라 걷는 동안에는 역사적인 이야기와 함께 고즈넉한 경치를 감상할 수 있었어요. 특히 역사에 관심있는 사람들에게는 훌륭한 학습과 관광의 장소일 거예요. 남한산성 유원지에서의 특별한 경험은 나에게 소중한 시간이었고, 역사와 자연이 어우러진 아름다운 곳이었어요. 다음에도 또 찾아가고 싶은 곳이에요!')"
fi