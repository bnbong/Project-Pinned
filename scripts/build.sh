echo "deleting exist docker volumes..."
docker compose down --volumes

echo "building container..."
docker compose up --build -d

echo "Applying Schemas to Database..."
docker exec -it "project-pinned-backend-1" python manage.py migrate

echo "Applying Landmark Bigdatas to Database..."
docker exec -it "project-pinned-backend-1" python manage.py landmarkloader media/RB_LANDMARK_INFO_20211231.csv

echo "Making Mock datas at Database..."
docker exec -it "project-pinned-backend-1" bash -c "echo 'from django.contrib.auth import get_user_model; User = get_user_model(); user1 = User(username=\"user1\", email=\"user1@test.com\"); user1.set_password(\"password123\"); user1.save(); user2 = User(username=\"user2\", email=\"user2@test.com\"); user2.set_password(\"password123\"); user2.save(); user3 = User(username=\"user3\", email=\"user3@test.com\"); user3.set_password(\"password123\"); user3.save()' | python manage.py shell"