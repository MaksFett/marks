FROM nginx
COPY ./build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8008
CMD ["nginx", "-g", "daemon off;"]
