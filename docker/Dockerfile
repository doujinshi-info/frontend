# Build Process
FROM node:8-jessie AS builder

WORKDIR /app

COPY . ./

RUN npm install
RUN npm run build

# Static Nginx
FROM nginx:stable

WORKDIR /var/www

COPY --from=builder /app/dist/ /var/www
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
