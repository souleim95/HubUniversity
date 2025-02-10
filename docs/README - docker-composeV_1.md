🚀 Installation et Utilisation de PostgreSQL avec Docker (Avec Docker Desktop)

📌 Prérequis

Avant de commencer, assurez-vous d'avoir :

Un système Windows ou Mac

Une connexion internet stable

Un accès administrateur sur votre machine

🐳 1. Télécharger et Installer Docker Desktop

🔹 Windows / Mac

Télécharger Docker Desktop

Ouvrez Google Chrome et rendez-vous sur le site officiel :👉 Télécharger Docker Desktop

Cliquez sur le bouton Download Docker Desktop et sélectionnez la version adaptée à votre système.

Installer Docker Desktop

Une fois le fichier téléchargé, exécutez l’installateur.

Suivez les instructions d’installation.

Activez WSL2 (Windows Subsystem for Linux) si demandé sur Windows.

Redémarrez votre ordinateur après l'installation.

Vérifier l'installation

Ouvrez Docker Desktop et assurez-vous qu’il fonctionne.

Vérifiez que Docker est installé avec :

docker --version

🏗 2. Préparer le projet

📂 Structure des fichiers

Assurez-vous d'avoir cette structure :

HubUniversity/
│── docker-compose.yml
│── /database
│   ├── init.sql

📜 2.1 Contenu du docker-compose.yml

version: '3.8'
services:
  db:
    image: postgres:17
    container_name: projet_universite_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_HOST_AUTH_METHOD: trust
      POSTGRES_DB: projet_universite
    ports:
      - "5432:5432"
    volumes:
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql

📜 2.2 Contenu du database/init.sql

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (name, email) VALUES 
  ('Alice Dupont', 'alice.dupont@example.com'),
  ('Bob Martin', 'bob.martin@example.com');

🔥 3. Lancer PostgreSQL avec Docker

Se placer dans le dossier du projet

cd /chemin/vers/HubUniversity

Démarrer les services

docker-compose up -d

Vérifier si le conteneur tourne

docker ps

Vous devriez voir un conteneur nommé projet_universite_db en cours d'exécution.

📡 4. Se connecter à PostgreSQL

🎯 4.1 Se connecter via Docker

Utilisez la commande suivante pour accéder à la base de données :

   docker exec -it projet_universite_db psql -U postgres -d projet_universite

Puis, testez la table users :

SELECT * FROM users;

💡 4.2 Se connecter depuis un autre client PostgreSQL

Si vous avez un outil comme DBeaver ou pgAdmin, utilisez les paramètres suivants :

Host: 127.0.0.1

Port: 5432

User: postgres

Database: projet_universite

Password: (Laisser vide, car trust est activé)

📌 5. Arrêter et Supprimer PostgreSQL

🛑 5.1 Arrêter le conteneur PostgreSQL

   docker-compose down

🗑 5.2 Supprimer les volumes (Attention : efface toutes les données !)

   docker-compose down -v

🎯 6. Relancer PostgreSQL proprement

Si vous avez supprimé les volumes et souhaitez repartir à zéro :

   docker-compose up -d

🛠 7. Dépannage

Si vous rencontrez une erreur :

Vérifiez que Docker tourne

docker info

Regardez les logs de PostgreSQL

docker logs projet_universite_db

Vérifiez la connexion avec psql

docker exec -it projet_universite_db psql -U postgres -d projet_universite

🚀 PostgreSQL est maintenant configuré et accessible via Docker !