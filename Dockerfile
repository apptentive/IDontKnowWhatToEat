FROM node:12 AS build

LABEL maintainer="Brett McGinnis <brett.mcginnis@apptentive.com>"

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 8080

CMD npm start
