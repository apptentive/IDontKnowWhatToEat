FROM node:12 AS run

LABEL maintainer="Brett McGinnis <brett.mcginnis@apptentive.com>"

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 8080

CMD npm start
