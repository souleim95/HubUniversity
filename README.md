# HubUniversity - Plateforme de Gestion Intelligente de Campus 🎓

## Description

HubUniversity est une plateforme web moderne conçue pour la gestion intelligente des campus universitaires. Elle permet de gérer les équipements connectés, les salles, les utilisateurs et les données en temps réel.

## Fonctionnalités Principales 🚀

- **Module Information**
  - "Free tour" de la plateforme pour les visiteurs
  - Recherche d’informations locales avec pleins de filtres
  - Possibilité de s’inscrire à la plateforme
  - Voir les formations

- **Module Visualisation**
  - Inscription et validation d’utilisateur par e-mail
  - Connexion sécurisée (vérification login/mot de passe)
  - Gestion et modification du profil utilisateur
  - Consultation des profils des autres utilisateurs
  - Recherche et consultation des objets connectés et services (avec filtres)
  - Système de progression basé sur points pour accéder à de nouveaux niveaux (élève, professeur, directeur)

- **Module Gestion**
  - Ajout et modification d’objets connectés
  - Demande de suppression d’objets connectés
  - Contrôle de l’état et configuration des objets (attributs, paramètres, zones spécifiques)
  - Surveillance de la consommation énergétique et des statistiques d’utilisation
  - Génération de rapports d’utilisation et d’optimisation des ressources

- **Module Administration**
  - Gestion complète des utilisateurs (ajout, modification, suppression, niveaux d’accès)
  - Supervision des points et ajustement manuel si nécessaire
  - Gestion des catégories, objets et outils/services
  - Configuration des règles de fonctionnement (priorités énergétiques, alertes)
  - Sécurité et maintenance de la base de données (sauvegarde, vérification de l’intégrité)
  - Personnalisation de la plateforme (apparence, structure des modules)
  - Rapports avancés sur l’utilisation globale de la plateforme (exportables en CSV/PDF)

- **Services en Temps Réel**
  - Horaires RER A (API RATP)
  - Informations météo (API METEO)


## Architecture Technique 🛠

### Frontend
- React.js & ces librairies
- Recharts (visualisation de données)

### Backend
- Node.js
- Express
- PostgreSQL
- Socket.io
- API RESTful

## Prérequis 📋

- Docker desktop
- Connexion Internet

## Installation 💻

1. **Cloner le dépôt**
   ```bash
   git clone [url-du-repo]
   ```

2. **Lancer Docker desktop**

3. **Lancer l'application**
  A la racine du projet :
   ```bash 
   docker-compose up --build
   ```

## Structure du Projet 📁

```
HubUniversity/
├── docker-compose.yml          # Configuration Docker
├── package.json               # Dépendances principales
├── README.md                  # Documentation principale
│
├── backend/                   # Serveur Node.js
│   ├── Database-URL.env      # Configuration BD
│   ├── Dockerfile           # Configuration Docker backend
│   ├── package.json         # Dépendances backend
│   ├── server.js           # Point d'entrée du serveur
│   └── db/
│       └── migrations/     # Migrations base de données
│
├── database/                # Scripts base de données
│   └── init.sql           # Initialisation BD
│
├── docs/                   # Documentation
│   ├── README.md
│   └── Guides techniques
│
└── frontend/              # Application React
    ├── package.json      # Dépendances frontend
    ├── public/          # Fichiers statiques
    │   └── index.html
    └── src/
        ├── App.jsx
        ├── index.jsx
        ├── assets/      # Images et médias
        │   ├── HubCyLogo.png
        │   ├── welcome.mp4
        │   └── ...
        ├── components/  # Composants React
        │   ├── AdminPage.jsx
        │   ├── Dashboard.jsx
        │   ├── Formation.jsx
        │   ├── Header.jsx
        │   └── ...
        ├── context/    # Gestion d'état global
        │   └── PlatformContext.jsx
        ├── data/      # Données statiques
        │   └── projectData.js
        ├── hooks/     # Hooks personnalisés
        │   ├── useAdmin.js
        │   ├── useDashboard.js
        │   └── ...
        ├── styles/    # Styled-components
        │   ├── GlobalStyle.js
        │   ├── HeaderStyles.js
        │   └── ...
        └── utils/     # Utilitaires
            └── iconUtils.js
```

Cette structure suit une architecture moderne et maintenable avec :
- Séparation claire frontend/backend
- Organisation modulaire des composants
- Gestion d'état centralisée
- Styles isolés et réutilisables
- Configuration Docker pour le déploiement
- Documentation complète


## Équipe 👥

- Louaye Saghir
- Paul Pitiot  
- Florian Delsuc
- Souleim Ghoudi

## Licence 📄

Ce projet est sous licence CY TECH®

---

Développé avec ❤️ par l'équipe HubUniversity