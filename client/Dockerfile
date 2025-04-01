FROM node:16-alpine AS client

WORKDIR /src
COPY package*.json ./
ARG CLIENT_PORT
ENV PORT=${CLIENT_PORT}
EXPOSE ${CLIENT_PORT}

RUN npm i
COPY ./ ./
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
CMD ["npm", "run", "start"]
