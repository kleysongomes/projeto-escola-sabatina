# Estágio 1: Usar uma imagem base leve do Node.js
FROM node:18-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de definição de pacotes
COPY package*.json ./

# Instalar apenas as dependências de produção para manter a imagem pequena
RUN npm install --production

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta em que o servidor roda
EXPOSE 3000

# Definir o comando para iniciar a aplicação
CMD [ "node", "index.js" ]