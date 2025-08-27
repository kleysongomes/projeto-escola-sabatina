# --- ESTÁGIO 1: Build da Aplicação Vue ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- ESTÁGIO 2: Servidor de Produção ---
FROM nginx:stable-alpine

COPY default.conf.template /etc/nginx/templates/default.conf.template

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80