FROM node:8
WORKDIR /app
COPY package*.json ./
RUN yarn install
ENV NODE_ENV=production
COPY . .
CMD yarn start:production
EXPOSE 4000