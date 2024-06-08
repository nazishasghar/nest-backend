
FROM node:18.9.1-bullseye-slim
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production && \
    rm -rf /root/.npm/_cacache

COPY nest-cli.json ./
COPY config ./config/

COPY package.json package-lock.json ./
RUN npm ci --production=false && \
    rm -rf /root/.npm/_cacache

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm","run","start:prod" ]