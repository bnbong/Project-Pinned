docker compose start
docker exec -it project-pinned-backend-1 coverage run manage.py test
docker exec -it project-pinned-backend-1 coverage html
docker exec -it project-pinned-backend-1 coverage report
docker compose stop