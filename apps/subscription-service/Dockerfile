# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY shared ./shared
COPY apps/subscription-service ./apps/subscription-service

RUN npm run build:subscription-service

# Production stage
FROM node:20-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev 

COPY --from=builder /app/dist ./dist

EXPOSE ${HTTP_SUBSCRIPTION_SERVICE_PORT}

CMD sh -c 'npm run migration:run && npm run start:prod:subscription-service'

