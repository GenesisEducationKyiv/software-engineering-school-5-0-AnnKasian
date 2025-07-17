# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY shared ./shared
COPY apps/email-service ./apps/email-service

RUN npm run build:email-service

# Production stage
FROM node:20-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev 

COPY --from=builder /app/dist ./dist

EXPOSE ${GRPC_EMAIL_SERVICE_PORT}

CMD [ "npm", "run", "start:prod:email-service"]
