FROM nginx:alpine

RUN mkdir -p /var/log/nginx

ARG NGINX_CONF_FILE=nginx.conf

COPY $NGINX_CONF_FILE /etc/nginx/nginx.conf
