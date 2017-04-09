FROM node:boron
MAINTAINER Andreas Sehr

# Create app directory
RUN mkdir -p /mnt/data/
RUN mkdir -p /usr/src/web-app
WORKDIR /usr/src/shatabang

#Install source
# TODO: git checkout
COPY package.json /usr/src/web-app

# Install app dependencies
RUN npm install

COPY client /usr/src/web-app/client
COPY modules /usr/src/web-app/modules
COPY routes /usr/src/web-app/routes
COPY *.js /usr/src/web-app/
COPY install_scripts/docker_config_server.json /usr/src/web-app/config_server.json

RUN npm run build

EXPOSE 3001
CMD npm run start && sh
