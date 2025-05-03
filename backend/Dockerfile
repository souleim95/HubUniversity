FROM node:18

# Créer répertoire principal
WORKDIR /app

# ---------- BUILD FRONTEND ----------
# Copier et builder le frontend
COPY ./frontend ./frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# ---------- SETUP BACKEND ----------
WORKDIR /app
COPY ./backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copier les fichiers backend
COPY ./backend .

# Copier le build React dans le dossier attendu par server.js
RUN cp -r /app/frontend/build ./build

# Port exposé
EXPOSE 5001

# Lancement du serveur
CMD ["node", "server.js"]
