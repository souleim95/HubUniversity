# Utiliser l'image officielle Node.js
FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code
COPY . .

# Exposer le port sur lequel l'application va écouter
EXPOSE 5001

# Lancer le serveur Node.js
CMD ["node", "server.js"]
