# HubUniversity - Plateforme de Gestion Intelligente de Campus 🎓

## Description

HubUniversity est une plateforme web moderne conçue pour la gestion intelligente des campus universitaires. Elle permet de gérer les équipements connectés, les salles, les utilisateurs et les données en temps réel.

## Fonctionnalités Principales 🚀

- **Tableau de Bord Interactif**
  - Visualisation en temps réel des équipements
  - Gestion des alertes et notifications
  - Statistiques d'utilisation

- **Gestion des Objets Connectés**
  - Contrôle des équipements (éclairage, chauffage, ventilation...)
  - Surveillance des statuts
  - Programmation automatique

- **Interface Utilisateur**
  - Design responsive et moderne
  - Navigation intuitive
  - Thèmes personnalisables

- **Services en Temps Réel**
  - Horaires RER A
  - Informations météo
  - État des salles et équipements

- **Sécurité et Administration**
  - Gestion des droits d'accès
  - Historique des actions
  - Sauvegarde et maintenance

## Architecture Technique 🛠

### Frontend
- React.js
- Styled Components
- React Router
- Socket.io Client
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