FROM node:16-alpine as base

WORKDIR /src
COPY package*.json ./
ARG USER_API_PORT
ENV PORT=${USER_API_PORT}
EXPOSE ${USER_API_PORT}

FROM base as production
ENV NODE_ENV=production
RUN npm install
COPY ./ ./
CMD ["node", "app"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY ./ ./
CMD ["nodemon", "app"]