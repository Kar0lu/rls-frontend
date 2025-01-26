# syntax=docker/dockerfile:1


ARG NODE_VERSION=22.11

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY --chown=node:node ./frontend .

RUN npm i

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
