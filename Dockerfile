# Use uma imagem base do Node.js (versão 20 ou superior)
FROM node:20

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie os arquivos do backend para o diretório de trabalho
COPY ./backend/package*.json ./
COPY ./backend/ ./

# Instale as dependências
RUN npm install

# Exponha a porta que sua aplicação irá usar
EXPOSE 2345

# Comando para iniciar sua aplicação
CMD ["npm", "start"]
