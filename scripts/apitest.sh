docker compose start
docker exec -it project-pinned-backend-1 python manage.py test
docker compose stop