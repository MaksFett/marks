FROM node:16-alpine AS client

WORKDIR /src
COPY package*.json ./
ARG CLIENT_PORT
ARG CLIENT_PORT1
ARG CLIENT_PORT2
ENV PORT=${CLIENT_PORT}
EXPOSE ${CLIENT_PORT}
EXPOSE ${CLIENT_PORT1}
EXPOSE ${CLIENT_PORT2}


COPY ./ ./
RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
CMD ["npm", "run", "start"]
