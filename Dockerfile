FROM node:18.9.1-bullseye AS node-builder

WORKDIR /app

COPY package-lock.json package.json ./

RUN npm ci --production=false && \
    rm -rf /root/.npm/_cacache

COPY . .

RUN npm run build


FROM node:18.9.1-bullseye AS npm-builder

COPY package.json package-lock.json ./

RUN npm ci --only=production && \
    rm -rf /root/.npm/_cacache


FROM node:18.9.1-bullseye-slim
WORKDIR /app

COPY package.json package-lock.json ./

COPY --from=npm-builder /app/node_modules /app/node_modules/

COPY config ./config/

COPY --from=node-builder /app/dist ./dist/

EXPOSE 3002