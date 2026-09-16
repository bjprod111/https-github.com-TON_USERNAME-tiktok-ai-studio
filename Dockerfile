FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# This project is a static browser app; no Node build step is required.
COPY . .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
