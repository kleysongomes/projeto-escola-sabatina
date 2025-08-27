# --- ESTÁGIO 1: Build da Aplicação Vue ---
# Usamos uma imagem Node para ter as ferramentas de build (npm)
FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de definição de pacotes e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o resto do código do frontend
COPY . .

# Executa o comando de build, que gera os arquivos estáticos na pasta /dist
RUN npm run build

# --- ESTÁGIO 2: Servidor de Produção ---
# Usamos uma imagem Nginx super leve para servir os arquivos estáticos
FROM nginx:stable-alpine

# Copia a configuração customizada do Nginx que criamos
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos gerados no Estágio 1 para a pasta que o Nginx serve
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80 (padrão do Nginx)
EXPOSE 80

# O Nginx inicia automaticamente quando o container é executado