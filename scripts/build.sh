docker compose up --build
docker exec -it "project-pinned-backend-1" python manage.py migrate
docker exec -it "project-pinned-backend-1" python manage.py landmarkloader media/RB_LANDMARK_INFO_20211231.csv