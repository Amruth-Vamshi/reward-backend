FROM node:12-alpine AS build
RUN mkdir -p /app
ADD . /app
WORKDIR /app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN yarn install
RUN yarn --production --pure-lockfile
RUN yarn build



FROM node:12-alpine
RUN apk update && apk upgrade && apk add tzdata && cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && echo "Asia/Kolkata" >  /etc/timezone && apk del tzdata
COPY --from=build /app /app
ARG SERVER_RELEASE_VERSION
ENV SERVER_RELEASE_VERSION=${SERVER_RELEASE_VERSION}
RUN echo $SERVER_RELEASE_VERSION
WORKDIR /app
EXPOSE 4000 4567 
