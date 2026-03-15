FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV HOST=0.0.0.0 \
    PORT=8787

EXPOSE 8787

CMD ["npm", "start"]
