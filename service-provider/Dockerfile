# service-provider/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta 
EXPOSE 3002

# Comando para iniciar a aplicação
CMD ["npm", "start"]