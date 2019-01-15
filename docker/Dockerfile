FROM node:8-jessie

RUN apt-get update && \
    apt-get install -y nginx

RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    rm /var/log/lastlog /var/log/faillog

WORKDIR /var/www

COPY . ./
COPY ./docker/run.sh /
COPY ./docker/nginx.conf /etc/nginx/sites-enabled/default

RUN npm install

ENTRYPOINT [ "sh", "/run.sh" ]

EXPOSE 80 443
