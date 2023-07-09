# docker login requires..
source .env
echo "building images..."
cd front
docker buildx build -t project-pinned-frontend --platform linux/amd64 .
cd ../project_pinned
docker buildx build -t project-pinned-backend --platform linux/amd64 .
cd ../nginx
docker buildx build -t project-pinned-nginx --platform linux/amd64 .

echo "tagging existing images..."
docker tag project-pinned-nginx:latest bnbong/project-pinned:nginx
docker tag project-pinned-backend:latest bnbong/project-pinned:backend
docker tag project-pinned-frontend:latest bnbong/project-pinned:frontend

echo "pushing images to ACR..."
docker push bnbong/project-pinned:nginx
docker push bnbong/project-pinned:backend
docker push bnbong/project-pinned:frontend
