FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS client
COPY . .
RUN npm run build

FROM base AS server
COPY server ./server
RUN npm run build:server

FROM node:20-alpine
WORKDIR /app
COPY --from=server /app/server ./server
COPY --from=client /app/build ./client
COPY package*.json ./
RUN npm ci --production
EXPOSE 5000
CMD ["node", "server/server.js"]