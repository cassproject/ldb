FROM nginx:1.21-alpine

COPY ./static/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./v1.3/.vuepress/dist /usr/share/nginx/html/v1.3/
COPY ./v1.4/.vuepress/dist /usr/share/nginx/html/v1.4/
COPY ./v1.5/.vuepress/dist /usr/share/nginx/html/v1.5/
COPY ./static/index.html /usr/share/nginx/html/index.html
