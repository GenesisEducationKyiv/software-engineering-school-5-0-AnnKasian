# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY shared ./shared
COPY apps/weather-service ./apps/weather-service

RUN npm run build:weather-service

# Production stage
FROM node:20-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev 

COPY --from=builder /app/dist ./dist

EXPOSE ${HTTP_WEATHER_SERVICE_PORT}
EXPOSE ${GRPC_WEATHER_SERVICE_PORT}

CMD [ "npm", "run", "start:prod:weather-service"]

