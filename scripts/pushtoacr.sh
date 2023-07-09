# # at context default
# source .env
# echo "building images..."
# cd front
# docker buildx build -t project-pinned-frontend --platform linux/amd64 .
# cd ../project_pinned
# docker buildx build -t project-pinned-backend --platform linux/amd64 .
# cd ../nginx
# docker buildx build -t project-pinned-nginx --platform linux/amd64 .


# echo "tagging existing images..."
# az acr login --name $ACR_NAME
# docker tag project-pinned-backend:latest $ACR_LOGIN_SERVER/project-pinned-backend:latest
# docker tag project-pinned-frontend:latest $ACR_LOGIN_SERVER/project-pinned-frontend:latest
# docker tag project-pinned-nginx:latest $ACR_LOGIN_SERVER/project-pinned-nginx:latest

# echo "pushing images to ACR..."
# docker push $ACR_LOGIN_SERVER/project-pinned-backend:latest
# docker push $ACR_LOGIN_SERVER/project-pinned-frontend:latest
# docker push $ACR_LOGIN_SERVER/project-pinned-nginx:latest
