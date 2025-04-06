// src/data/fakeData.js

export const fakeUser = {
    login: 'JohnDoe',
    age: 22,
    genre: 'Homme',
    level: 'Débutant',
    points: 3,
  };
  
export const fakeObjects = [
    {
        id: 'salle101',
        name: 'Salle Informatique',
        type: 'Salle',
        status: 'Disponible',
        capacity: 30,
        reservedBy: null,
        nextReservation: '2024-01-20T14:00:00'
    },
    {
        id: 'amphiA',
        name: 'Amphithéâtre GIA1',
        type: 'Salle',
        status: 'Disponible',  
        capacity: 200,
        reservedBy: null
    },
    {
        id: 'thermo123',
        name: 'Thermostat Salle A',
        type: 'Thermostat',
        status: 'Actif',
        temperature: 21,
        targetTemp: 22,
        mode: 'auto'
    },
    {
        id: 'cam456',
        name: 'Caméra Parking',
        type: 'Caméra',
        status: 'Déconnecté',
        isRecording: false,
        lastMaintenance: '2024-01-15',
        resolution: '1080p'
    },
    {
        id: 'capteur789',
        name: 'Capteur de présence Bâtiment B',
        type: 'Capteur',
        status: 'Actif',
        lastDetection: '2024-01-19T10:30:00'
    },
    {
        id: 'light001',
        name: 'Éclairage Hall Principal',
        type: 'Éclairage',
        status: 'Allumé',
        brightness: 80,
        autoMode: true
    },
    {
        id: 'door001',
        name: 'Porte principale Bâtiment A',
        type: 'Porte',
        status: 'Verrouillée',
        lastAccess: '2024-01-19T08:00:00',
        autoLock: true,
        securityLevel: 'high'
    },
    {
        id: 'refectoire',
        name: 'Réfectoire',
        type: 'Salle',
        status: 'Disponible',
        capacity: 150,
        reservedBy: null
    },
    {
        id: 'labo_chimie',
        name: 'Laboratoire de Chimie',
        type: 'Salle',
        status: 'Disponible',
        capacity: 24,
        reservedBy: null
    },
    {
        id: 'biblio',
        name: 'Bibliothèque',
        type: 'Salle',
        status: 'Disponible',
        capacity: 100,
        reservedBy: null
    },
    {
        id: 'salle_sport',
        name: 'Gymnase',
        type: 'Salle',
        status: 'Disponible',
        capacity: 150,
        reservedBy: null
    },
    {
        id: 'acces_parking',
        name: 'Barrière Parking',
        type: 'Barriere',
        status: 'Fermée',
        lastAccess: '2024-01-19T08:00:00'
    },
    {
        id: 'panneau_info',
        name: 'Panneau d\'Information',
        type: 'Panneau',
        status: 'Actif',
        message: 'Bienvenue',
        brightness: 70
    },
    {
        id: 'grille_ecole',
        name: 'Grille Principale',
        type: 'Grille',
        status: 'Ouverte',
        lastAccess: '2024-01-19T07:00:00',
        autoLock: true,
        securityLevel: 'high'
    }
];

export const categories = {
  salles: {
    name: 'Salles',
    items: ['salle101', 'amphiA', 'refectoire', 'labo_chimie', 'biblio', 'salle_sport']
  },
  ecole: {
    name: 'École',
    items: ['grille_ecole', 'cam456', 'capteur789', 'light001', 'door001', 'acces_parking', 'panneau_info']
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
      status: 'Actif',
      temperature: 21,
      targetTemp: 22,
      mode: 'auto'
    },
    {
      id: 'light_salle101',
      name: 'Éclairage',
      type: 'Éclairage',
      status: 'Allumé',
      brightness: 80
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
      status: 'Actif',
      temperature: 21,
      targetTemp: 22,
      mode: 'auto'
    },
    {
      id: 'light_amphiA',
      name: 'Éclairage',
      type: 'Éclairage',
      status: 'Allumé',
      brightness: 80
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
      status: 'Éteint',
      volume: 50,
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
      temperature: 6,
      needsMaintenance: false,
      lastMaintenance: '2024-01-15'
    },
    {
      id: 'cafetiere_auto',
      name: 'Cafetière Automatique',
      type: 'Cafetiere',
      status: 'Actif',
      waterLevel: 90,
      beansLevel: 85,
      temperature: 92,
      mode: 'Veille',
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
      doorStatus: 'Fermée'
    },
    {
      id: 'thermo_ref',
      name: 'Chauffage',
      type: 'Thermostat',
      status: 'Actif',
      temperature: 21,
      targetTemp: 22,
      mode: 'auto'
    },
    {
      id: 'light_ref',
      name: 'Éclairage',
      type: 'Éclairage',
      status: 'Allumé',
      brightness: 80,
      mode: 'Auto',
      autoSchedule: true
    },
    {
      id: 'store_ref',
      name: 'Store',
      type: 'Store',
      status: 'Ouvert',
      position: 100 // 0 = fermé, 100 = ouvert
    },
    {
      id: 'air_quality',
      name: 'Capteur Qualité Air',
      type: 'AirSensor',
      status: 'Actif',
      co2Level: 450,
      humidity: 45,
      lastMeasure: '2024-01-19T10:30:00'
    },
    {
      id: 'dishwasher',
      name: 'Lave-Vaisselle Pro',
      type: 'Dishwasher',
      status: 'Disponible',
      program: 'Standard',
      timeRemaining: 0,
      waterTemp: 65,
      rinseAidLevel: 80
    }
  ],
  'labo_chimie': [
    {
      id: 'hotte_labo',
      name: 'Hotte Aspirante',
      type: 'Ventilation',
      status: 'Actif',
      speed: 50,
      filterStatus: 'OK',
      lastMaintenance: '2024-01-10'
    },
    {
      id: 'detecteur_gaz',
      name: 'Détecteur de Gaz',
      type: 'Detecteur',
      status: 'Actif',
      batteryLevel: 95,
      lastAlert: null
    }
  ],
  'biblio': [
    {
      id: 'scanner_biblio',
      name: 'Scanner de Livres',
      type: 'Scanner',
      status: 'Disponible',
      lastScan: '2024-01-19T15:30:00'
    },
    {
      id: 'bornes_pret',
      name: 'Borne de Prêt',
      type: 'Borne',
      status: 'Actif',
      lastTransaction: '2024-01-19T16:45:00'
    },
    {
      id: 'detecteur_rfid',
      name: 'Portique RFID',
      type: 'Securite',
      status: 'Actif',
      lastDetection: null
    }
  ],
  'salle_sport': [
    {
      id: 'ventilation_gym',
      name: 'Système de Ventilation',
      type: 'Ventilation',
      status: 'Actif',
      speed: 60,
      mode: 'auto'
    },
    {
      id: 'score_board',
      name: 'Tableau des Scores',
      type: 'Affichage',
      status: 'Éteint',
      score: {
        home: 0,
        away: 0
      }
    },
    {
      id: 'sono_gym',
      name: 'Sonorisation',
      type: 'Audio',
      status: 'Éteint',
      volume: 50,
      input: 'bluetooth'
    }
  ]
};
