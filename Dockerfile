FROM node:12 AS run

LABEL maintainer="Brett McGinnis <brett.mcginnis@apptentive.com>"

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN mkdir -p "/app/data"

ENV DB_PATH="/app/data/db.json"

EXPOSE 8080
CMD npm start
