// src/data/fakeData.js


  
export const fakeObjects = [
    {
        id: 'salle101',
        name: 'Salle Informatique',
        type: 'Salle',
        status: 'Disponible',
        capacity: 30,
        reservedBy: null,
        nextReservation: '2024-01-20T14:00:00',
        description: "La salle de la meileur prof Taisa <3 où les rêves de code prennent vie ! 💻✨",
    },
    {
        id: 'amphiA',
        name: 'Amphithéâtre GIA1',
        type: 'Salle',
        status: 'Disponible',  
        capacity: 200,
        reservedBy: null,
        description: "La salle la plus intelligente du campus ! Elle fait même les devoirs à votre place... ou pas 🤖❌"
    },
    {
        id: 'thermo123',
        name: 'Thermostat Salle A',
        type: 'Thermostat',
        status: 'Inactif',
        temperature: 21,
        targetTemp: 0,
        previousTargetTemp: 20,
        mode: 'auto',
        description: "Ce thermostat est si précis qu'il détecte quand un prof raconte une blague pas drôle - la température monte ! 🌡️😅"
    },
    {
        id: 'cam456',
        name: 'Caméra Parking',
        type: 'Caméra',
        status: 'Déconnecté',
        isRecording: false,
        lastMaintenance: '2024-01-15',
        resolution: '1080p',
        description: "La seule caméra qui fait des selfies quand personne ne regarde ! 📸 #CameraSpy"
    },
    {
        id: 'capteur789',
        name: 'Capteur de présence',
        type: 'Capteur',
        status: 'Actif',
        lastDetection: '2024-01-19T10:30:00',
        description: "Détecte même les étudiants invisibles qui séchent les cours ! 👻 Pas de chance !"
    },
    {
        id: 'light001',
        name: 'Éclairage Hall Principal',
        type: 'Éclairage',
        status: 'Éteint',
        brightness: 0,
        previousBrightness: 80,
        autoMode: true,
        description: "Les lumières qui font un mini show disco quand les profs passent ! 💃💡"
    },
    {
        id: 'door001',
        name: 'Porte principale Bâtiment A',
        type: 'Porte',
        status: 'Verrouillée',
        lastAccess: '2024-01-19T08:00:00',
        autoLock: true,
        securityLevel: 'high',
        description: "La porte la plus sarcastique du campus : 'Mot de passe incorrect... encore !' 🚪😅"
    },
    {
        id: 'refectoire',
        name: 'Réfectoire',
        type: 'Salle',
        status: 'Disponible',
        capacity: 150,
        reservedBy: null,
        description: "Le seul endroit où les machines distributrices jugent vos choix alimentaires ! 🍕🤖"
    },
    {
        id: 'labo_chimie',
        name: 'Laboratoire de Chimie',
        type: 'Salle',
        status: 'Disponible',
        capacity: 24,
        reservedBy: null,
        description: "Attention : les béchers sont plus intelligents que certains étudiants ! 🧪🤓"
    },
    {
        id: 'biblio',
        name: 'Bibliothèque',
        type: 'Salle',
        status: 'Disponible',
        capacity: 100,
        reservedBy: null,
        description: "Les livres font la fête dès que vous avez le dos tourné ! 📚🎉"
    },
    {
        id: 'salle_sport',
        name: 'Gymnase',
        type: 'Salle',
        status: 'Disponible',
        capacity: 150,
        reservedBy: null,
        description: "Le seul gymnase où les ballons se cachent d'eux-mêmes après le cours ! 🏀😱"
    },
    {
        id: 'acces_parking',
        name: 'Barrière Parking',
        type: 'Barriere',
        status: 'Fermée',
        lastAccess: '2024-01-19T08:00:00',
        description: "La seule barrière qui se bloque mystérieusement quand c'est toi qui es devant... et que c'est bouché ! 🚧😤"
    },
    {
        id: 'panneau_info',
        name: 'Panneau d\'Information',
        type: 'Panneau',
        status: 'Actif',
        message: 'Bienvenue',
        brightness: 70,
        description: "Affiche parfois des blagues nulles pour réveiller les étudiants du matin ! 📱😴"
    },
    {
        id: 'grille_ecole',
        name: 'Grille Principale',
        type: 'Grille',
        status: 'Ouverte',
        lastAccess: '2024-01-19T07:00:00',
        autoLock: true,
        securityLevel: 'high',
        description: "La grille qui joue à cache-cache avec les retardataires ! 🏃‍♂️🚪"
    },
    {
        id: 'cam_entree',
        name: 'Caméra Entrée',
        type: 'Caméra',
        status: 'Actif',
        isRecording: true,
        resolution: '4K',
        description: "La caméra qui compte les bâillements pendant les cours du matin ! 😴📹"
    },
    {
        id: 'eclairage_parking',
        name: 'Éclairage Parking',
        type: 'Éclairage',
        status: 'Éteint',
        brightness: 0,
        previousBrightness: 70,
        autoMode: true,
        description: "L'éclairage qui organise des rave parties nocturnes avec les voitures ! 🚗💡"
    },
    {
        id: 'borne_recharge',
        name: 'Borne de recharge VE',
        type: 'Borne',
        status: 'Disponible',
        description: "La seule borne qui raconte des blagues pendant que vous rechargez ! ⚡😄"
    },
    {
        id: 'panneau_places',
        name: 'Affichage Places',
        type: 'Panneau',
        status: 'Actif',
        message: '45 places libres',
        description: "Le panneau qui ment comme un arracheur de dents sur les places disponibles ! 🅿️🤥"
    },
    {
        id: 'detecteur_parking',
        name: 'Détecteur Occupation',
        type: 'Capteur',
        status: 'Actif',
        description: "Détecte même les voitures fantômes et les licornes garées ! 🚙👻"
    },
    {
        id: 'cam_urgence',
        name: 'Caméra Issue Secours',
        type: 'Caméra',
        status: 'Actif',
        description: "La caméra qui filme les héros en action... ou juste les gens perdus ! 🦸‍♂️🎥"
    },
    {
        id: 'alarme_incendie',
        name: 'Alarme Incendie',
        type: 'Securite',
        status: 'Actif',
        description: "L'alarme qui se déclenche quand les étudiants sont trop en feu ! 🔥😎"
    },
    {
        id: 'eclairage_urgence',
        name: 'Éclairage Secours',
        type: 'Éclairage',
        status: 'Éteint',
        brightness: 0,
        previousBrightness: 100,
        description: "Les lumières qui transforment le couloir en piste de discothèque en cas d'urgence ! 🕺💃"
    },
    {
        id: 'detecteur_fumee',
        name: 'Détecteur de Fumée',
        type: 'Detecteur',
        status: 'Actif',
        description: "Détecte même la fumée des cerveaux qui surchauffent pendant les examens ! 🧠💨"
    }
];

export const categories = {
  salles: {
    name: 'Salles',
    items: ['salle101', 'amphiA', 'refectoire', 'labo_chimie', 'biblio', 'salle_sport']
  },
  ecole: {
    name: 'École',
    items: ['grille_ecole', 'light001', 'door001', 'panneau_info', 'alarme_incendie', 'eclairage_urgence', 'detecteur_fumee', 'cam_urgence']
  },
  parking: {
    name: 'Parking & Extérieur',
    items: ['acces_parking', 'cam456', 'cam_entree', 'capteur789', 'eclairage_parking', 'borne_recharge', 'panneau_places', 'detecteur_parking']
  }
};

export const equipments = {
  'salle101': [
    {
      id: 'proj_salle101',
      name: 'Projecteur',
      type: 'Projecteur',
      status: 'Éteint'
    },
    {
      id: 'thermo_salle101',
      name: 'Chauffage',
      type: 'Thermostat',
      status: 'Inactif',
      temperature: 21,
      targetTemp: 0,
      previousTargetTemp: 22,
      mode: 'auto'
    },
    {
      id: 'light_salle101',
      name: 'Éclairage',
      type: 'Éclairage',
      status: 'Éteint',
      brightness: 0,
      previousBrightness: 80
    },
    {
      id: 'store_salle101',
      name: 'Store',
      type: 'Store',
      status: 'Fermé'
    }
  ],
  'amphiA': [
    {
      id: 'proj_amphiA',
      name: 'Projecteur',
      type: 'Projecteur',
      status: 'Éteint'
    },
    {
      id: 'thermo_amphiA',
      name: 'Chauffage',
      type: 'Thermostat',
      status: 'Inactif',
      temperature: 21,
      targetTemp: 0,
      previousTargetTemp: 22,
      mode: 'auto'
    },
    {
      id: 'light_amphiA',
      name: 'Éclairage',
      type: 'Éclairage',
      status: 'Éteint',
      brightness: 0,
      previousBrightness: 80
    },
    {
      id: 'store_amphiA',
      name: 'Store',
      type: 'Store',
      status: 'Fermé'
    },
    {
      id: 'audio_amphiA',
      name: 'Système Audio',
      type: 'Audio',
      status: 'Mute',
      volume: 0,
      previousVolume: 50,
      mode: 'Stéréo'
    }
  ],
  'refectoire': [
    {
      id: 'distributeur_boissons',
      name: 'Distributeur de Boissons',
      type: 'Distributeur',
      status: 'Actif',
      stock: {
        eau: 85,
        soda: 70,
        café: 90,
        thé: 95
      },
      capacity: {
        eau: 100,
        soda: 100,
        café: 100,
        thé: 100
      },
      temperature: 4,
      needsMaintenance: false,
      lastMaintenance: '2024-01-15'
    },
    {
      id: 'distributeur_snacks',
      name: 'Distributeur de Snacks',
      type: 'Distributeur',
      status: 'Actif',
      stock: {
        sandwichs: 80,
        snacks: 75,
        desserts: 85
      },
      capacity: {
        sandwichs: 100,
        snacks: 100,
        desserts: 100
      },
      temperature: 6,
      needsMaintenance: false,
      lastMaintenance: '2024-01-15'
    },
    {
      id: 'cafetiere_auto',
      name: 'Cafetière Automatique',
      type: 'Cafetiere',
      status: 'Inactif',
      waterLevel: 90,
      waterLowThreshold: 10,
      beansLevel: 85,
      beansLowThreshold: 15,
      temperature: 92,
      mode: 'Veille',
      isCleaning: false,
      lastCleaning: '2024-01-18'
    },
    {
      id: 'microwave_ref',
      name: 'Micro-ondes Connecté',
      type: 'Microwave',
      status: 'Disponible',
      power: 900,
      mode: 'Veille',
      timer: 0,
      maxTime: 10,
      doorStatus: 'Fermée'
    },
    {
      id: 'thermo_ref',
      name: 'Chauffage',
      type: 'Thermostat',
      status: 'Inactif',
      temperature: 21,
      targetTemp: 0,
      previousTargetTemp: 22,
      mode: 'auto'
    },
    {
      id: 'light_ref',
      name: 'Éclairage',
      type: 'Éclairage',
      status: 'Éteint',
      brightness: 0,
      previousBrightness: 80,
      mode: 'Auto',
      autoSchedule: true
    },
    {
      id: 'store_ref',
      name: 'Store',
      type: 'Store',
      status: 'Ouvert',
      position: 100
    },
    {
      id: 'air_quality',
      name: 'Capteur Qualité Air',
      type: 'AirSensor',
      status: 'Actif',
      co2Level: 450,
      co2Threshold: 1000,
      humidity: 45,
      lastMeasure: '2024-01-19T10:30:00'
    },
    {
      id: 'dishwasher',
      name: 'Lave-Vaisselle Pro',
      type: 'Dishwasher',
      status: 'Disponible',
      program: 'Standard',
      availablePrograms: ['Eco', 'Standard', 'Intensif'],
      timeRemaining: 0,
      waterTemp: 65,
      rinseAidLevel: 80,
      rinseAidMaxCapacity: 100,
      rinseAidLowThreshold: 20
    }
  ],
  'labo_chimie': [
    {
      id: 'hotte_labo',
      name: 'Hotte Aspirante',
      type: 'Ventilation',
      status: 'Éteint',
      speed: 0,
      minSpeed: 20,
      maxSpeed: 100,
      filterStatus: 'OK',
      filterLife: 95,
      filterChangeThreshold: 10,
      lastMaintenance: '2024-01-10'
    },
    {
      id: 'detecteur_gaz',
      name: 'Détecteur de Gaz',
      type: 'Detecteur',
      status: 'Actif',
      detectedGases: [],
      alertThreshold: 50,
      batteryLevel: 95,
      batteryLowThreshold: 15,
      lastAlert: null
    }
  ],
  'biblio': [
    {
      id: 'scanner_biblio',
      name: 'Scanner de Livres',
      type: 'Scanner',
      status: 'Disponible',
      lastScan: '2024-01-19T15:30:00',
      lastScannedItem: null,
      scanResult: null
    },
    {
      id: 'bornes_pret',
      name: 'Borne de Prêt/Retour',
      type: 'Borne',
      status: 'Actif',
      lastTransaction: '2024-01-19T16:45:00',
      lastTransactionDetails: { type: null, itemId: null, userId: null },
      authState: 'idle'
    },
    {
      id: 'detecteur_rfid',
      name: 'Portique RFID Antivol',
      type: 'Securite',
      status: 'Actif',
      lastDetection: null,
      alarmTriggerItem: null
    }
  ],
  'salle_sport': [
    {
      id: 'ventilation_gym',
      name: 'Système de Ventilation',
      type: 'Ventilation',
      status: 'Inactif',
      speed: 0,
      minSpeed: 10,
      maxSpeed: 100,
      mode: 'Off',
      availableModes: ['Off', 'Auto', 'Manual']
    },
    {
      id: 'score_board',
      name: 'Tableau des Scores',
      type: 'Affichage',
      status: 'Éteint',
      score: {
        home: 0,
        away: 0
      },
      timer: 0,
      period: 1
    },
    {
      id: 'sono_gym',
      name: 'Sonorisation',
      type: 'Audio',
      status: 'Mute',
      volume: 0,
      previousVolume: 60,
      input: 'bluetooth',
      availableInputs: ['bluetooth', 'aux', 'radio']
    }
  ]
};
