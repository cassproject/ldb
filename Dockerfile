FROM node:19-bullseye-slim
WORKDIR /app
COPY package*.json ./
COPY pm2.config.js ./pm2.config.js
RUN npm install --omit=dev
COPY src src
CMD npm run run && npm run logs