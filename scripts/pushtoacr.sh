source .env
echo "tagging existing images..."
az acr login --name $ACR_NAME
docker tag project-pinned-backend:latest $ACR_LOGIN_SERVER/project-pinned-backend:latest
docker tag project-pinned-frontend:latest $ACR_LOGIN_SERVER/project-pinned-frontend:latest
docker tag project-pinned-nginx:latest $ACR_LOGIN_SERVER/project-pinned-nginx:latest

echo "pushing images to ACR..."
docker push $ACR_LOGIN_SERVER/project-pinned-backend:latest
docker push $ACR_LOGIN_SERVER/project-pinned-frontend:latest
docker push $ACR_LOGIN_SERVER/project-pinned-nginx:latest
