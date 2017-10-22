FROM node:boron
MAINTAINER Andreas Sehr

ENV PORT 3002
ENV BASE_URL /
ENV STORAGE_DIR /mnt/data/
ENV CAPTCHA_SITE_KEY _
ENV CAPTCHA_SECRET _
ENV COOKIE_SECRET VeryWellVictorIsSafe

# Create app directory
RUN mkdir -p /mnt/data/
RUN mkdir -p /usr/src/web-app

WORKDIR /usr/src/webb-app/

#Install source
COPY package.json ./

# Install app dependencies
RUN npm install

COPY client ./client
COPY modules ./modules
COPY routes ./routes
COPY *.js ./

RUN npm run build

EXPOSE 3002
CMD npm run start
