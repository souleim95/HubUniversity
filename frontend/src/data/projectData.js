// src/data/projectData.js
import biotechnologie from '../assets/biotechnologie.png'; 
import genieCivil from '../assets/genieCivil.png';
import informatique from '../assets/informatique.jpeg';
import mecanique from '../assets/mecanique.png';
import mathematiques from '../assets/mathematique.png';
import design from '../assets/design.png';
import humanitesDigital from '../assets/HumaniteDigital.png';
import chimie from '../assets/VRchimie.png';
import biologie from '../assets/VRbiologie.png';
import architecte from '../assets/architecte.png';
export const formationsData = {
  classique: {
    INFORMATIQUE: {
      description: "Plongez au cœur de l'innovation numérique avec notre formation d'ingénieur en informatique. Devenez un expert en développement logiciel, cybersécurité, IA et Big Data. Imaginez-vous concevoir des applications révolutionnaires et protéger les données de demain.",
      competences: ["Programmation avancée", "Architecture des systèmes", "Intelligence artificielle", "Sécurité informatique"],
      image: informatique,
      temoignage: "« Cette formation m'a ouvert les portes d'un monde passionnant. J'ai pu travailler sur des projets concrets et développer des compétences très recherchées. » - Ancien élève en Informatique",
      lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-informatique"
    },
    "GÉNIE CIVIL": {
      description: "Construisez le monde de demain avec notre formation d'ingénieur en génie civil. Apprenez à concevoir des infrastructures durables, à gérer des projets de construction ambitieux et à relever les défis environnementaux. Votre expertise façonnera le paysage urbain et rural.",
      competences: ["Structures complexes", "Matériaux innovants", "Géotechnique avancée", "Management de grands projets"],
      image: genieCivil,
      temoignage: "« J'ai toujours été passionné par la construction. Cette formation m'a donné les outils pour réaliser mes rêves et contribuer à des projets d'envergure. » - Ancien élève en Génie Civil",
      lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-genie-civil"
    },
    BIOTECHNOLOGIES: {
      description: "Explorez les frontières de la science avec notre formation d'ingénieur en biotechnologies. Innovez dans les domaines de la santé, de l'environnement et de l'agroalimentaire. Votre créativité et votre expertise contribueront à améliorer la qualité de vie et à préserver notre planète.",
      competences: ["Biologie moléculaire avancée", "Génie des procédés", "Chimie analytique", "Biotechnologie industrielle"],
      image: biotechnologie,
      temoignage: "« La biotechnologie est un domaine en pleine expansion. Cette formation m'a permis d'acquérir des connaissances pointues et de participer à des projets de recherche passionnants. » - Ancien élève en Biotechnologies",
      lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-biotechnologies-et-chimie"
    },
    MÉCANIQUE: {
      description: "Devenez un acteur clé de l'industrie avec notre formation d'ingénieur en mécanique. Concevez des systèmes innovants, optimisez les performances des machines et relevez les défis de la robotique. Votre expertise contribuera à l'essor de l'industrie 4.0.",
      competences: ["CAO avancée", "Mécanique des fluides", "Robotique industrielle", "Matériaux avancés"],
      image: mecanique,
      temoignage: "« La mécanique est au cœur de nombreuses industries. Cette formation m'a permis de développer une expertise technique solide et de travailler sur des projets concrets. » - Ancien élève en Mécanique",
      lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-mecanique"
    },
    "MATHÉMATIQUES APPLIQUÉES": {
      description: "Explorez le monde fascinant des mathématiques appliquées à travers notre formation d'ingénieur. Développez des modèles mathématiques pour résoudre des problèmes concrets dans des domaines variés tels que la finance, l'ingénierie et la science des données. Devenez un expert en modélisation, simulation et optimisation.",
      competences: ["Modélisation mathématique", "Analyse numérique", "Optimisation", "Science des données"],
      image: mathematiques,
      temoignage: "« Les mathématiques appliquées sont un outil puissant pour résoudre des problèmes complexes. Cette formation m'a permis d'acquérir des compétences très recherchées dans de nombreux secteurs. » - Ancien élève en Mathématiques Appliquées",
      lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-mathematiques-appliquees"
    },
  },
  recherche: {
    "BIOTECHNOLOGIES & CHIMIE (Chimie voie Recherche)": {
      description: "Explorez la voie de la recherche avec notre parcours en chimie. Développez des compétences en chimie moléculaire, chimie verte et matériaux innovants. Contribuez à l'avancement des connaissances et à la résolution des défis environnementaux.",
      competences: ["Chimie moléculaire", "Chimie verte", "Matériaux innovants", "Analyse chimique"],
      image: chimie,
      temoignage: "« La recherche en chimie est passionnante. Cette formation m'a permis de développer une expertise pointue et de contribuer à des projets innovants. » - Ancien élève en Chimie voie Recherche",
      lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-biotechnologies-chimie-parcours-chimie"
    },
    "BIOTECHNOLOGIES & CHIMIE (Biologie voie Recherche)": {
      description: "Explorez la voie de la recherche avec notre parcours en biologie. Développez des compétences en biologie moléculaire, génomique et biotechnologies. Contribuez à l'avancement des connaissances et à la résolution des défis de santé.",
      competences: ["Biologie moléculaire", "Génomique", "Biotechnologies", "Analyse biologique"],
      image: biologie,
      temoignage: "« La recherche en biologie est essentielle pour l'avenir. Cette formation m'a permis de développer une expertise pointue et de contribuer à des projets innovants. » - Ancien élève en Biologie voie Recherche",
      lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-biotechnologies-chimie-parcours-biologie"
    },
  },
  "double-diplome": {
    "GÉNIE CIVIL - ARCHITECTE (ENSA-V)": {
      description: "Devenez un expert en génie civil et en architecture grâce à notre double diplôme avec l'ENSA-V. Concevez des bâtiments innovants et durables en intégrant les aspects techniques et esthétiques. Votre expertise façonnera le paysage urbain de demain.",
      competences: ["Génie civil", "Architecture", "Conception de bâtiments", "Urbanisme"],
      image: architecte,
      temoignage: "« Ce double diplôme est une opportunité unique. J'ai pu développer une expertise à la fois technique et artistique, ce qui me permet de concevoir des bâtiments innovants et durables. » - Ancien élève en Génie Civil - Architecte",
      lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-genie-civil-architecte"
    },
    "DATA - HUMANITÉS DIGITALES (Sciences Po Saint-Germain-en-Laye)": {
      description: "Devenez un expert en data et en humanités digitales grâce à notre double diplôme avec Sciences Po Saint-Germain-en-Laye. Analysez les données pour comprendre les enjeux sociaux, économiques et politiques. Votre expertise contribuera à éclairer les décisions et à construire un monde plus juste.",
      competences: ["Data science", "Humanités digitales", "Analyse de données", "Sciences sociales"],
      image: humanitesDigital,
      temoignage: "« Ce double diplôme est une combinaison unique de compétences techniques et humaines. J'ai pu développer une expertise très recherchée dans le monde d'aujourd'hui. » - Ancien élève en Data - Humanités Digitales",
      lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-data-et-humanites-digitales"
    },
    "INFORMATIQUE - DESIGNER (CY École de Design)": {
      description: "Devenez un expert en informatique et en design grâce à notre double diplôme avec CY École de Design. Concevez des interfaces utilisateur innovantes et intuitives en intégrant les aspects techniques et esthétiques. Votre créativité façonnera l'expérience utilisateur de demain.",
      competences: ["Informatique", "Design", "Conception d'interfaces", "Expérience utilisateur"],
      image: design,
      temoignage: "« Ce double diplôme est une opportunité unique de combiner mes passions pour l'informatique et le design. J'ai pu développer une expertise très recherchée dans le monde d'aujourd'hui. » - Ancien élève en Informatique - Designer",
      lien: "https://cytech.cyu.fr/ingenieurs/ingenieur-informatique-designer"
    }
  }
};
 
  
export const dataObjects = [
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
      name: 'Chauffage - Salle Informatique',
      type: 'Chauffage',
      status: 'Inactif',
      temperature: 21,
      targetTemp: 0,
      previousTargetTemp: 20,
      mode: 'auto',
      description: "Ce Chauffage est si précis qu'il détecte quand un prof raconte une blague pas drôle - la température monte ! 🌡️😅"
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
    items: ['salle101', 'amphiA', 'refectoire', 'labo_chimie', 'biblio', 'salle_sport', 'thermo_salle101', 'thermo_amphiA', 'thermo_ref', 'hotte_labo', 'scanner_biblio', 'ventilation_gym', 'proj_salle101', 'proj_amphiA', 'light_salle101', 'light_amphiA', 'light_ref', 'store_salle101', 'store_amphiA', 'store_ref', 'audio_amphiA', 'distributeur_boissons', 'distributeur_snacks', 'cafetiere_auto', 'microwave_ref', 'air_quality', 'dishwasher', 'detecteur_gaz', 'bornes_pret', 'detecteur_rfid', 'score_board', 'sono_gym']
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
      name: 'Projecteur - Salle Informatique',
      type: 'Projecteur',
      status: 'Éteint'
    },
    {
      id: 'thermo_salle101',
      name: 'Chauffage - Salle Informatique',
      type: 'Chauffage',
      status: 'Inactif',
      temperature: 21,
      targetTemp: 0,
      previousTargetTemp: 22,
      mode: 'auto'
    },
    {
      id: 'light_salle101',
      name: 'Éclairage - Salle Informatique',
      type: 'Éclairage',
      status: 'Éteint',
      brightness: 0,
      previousBrightness: 80
    },
    {
      id: 'store_salle101',
      name: 'Store - Salle Informatique',
      type: 'Store',
      status: 'Fermé'
    }
  ],
  'amphiA': [
    {
      id: 'proj_amphiA',
      name: 'Projecteur - Amphithéâtre GIA1',
      type: 'Projecteur',
      status: 'Éteint'
    },
    {
      id: 'thermo_amphiA',
      name: 'Chauffage - Amphithéâtre GIA1',
      type: 'Chauffage',
      status: 'Inactif',
      temperature: 21,
      targetTemp: 0,
      previousTargetTemp: 22,
      mode: 'auto'
    },
    {
      id: 'light_amphiA',
      name: 'Éclairage - Amphithéâtre GIA1',
      type: 'Éclairage',
      status: 'Éteint',
      brightness: 0,
      previousBrightness: 80
    },
    {
      id: 'store_amphiA',
      name: 'Store - Amphithéâtre GIA1',
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
      name: 'Chauffage - Réfectoire',
      type: 'Chauffage',
      status: 'Inactif',
      temperature: 21,
      targetTemp: 0,
      previousTargetTemp: 22,
      mode: 'auto'
    },
    {
      id: 'light_ref',
      name: 'Éclairage - Réfectoire',
      type: 'Éclairage',
      status: 'Éteint',
      brightness: 0,
      previousBrightness: 80,
      mode: 'Auto',
      autoSchedule: true
    },
    {
      id: 'store_ref',
      name: 'Store - Réfectoire',
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

export const faqData = [
  // Questions générales - Accès Visiteur
  {
    question: "Qu'est-ce que je peux faire en tant que visiteur ?",
    answer: <p>En tant que visiteur, vous pouvez explorer la page d'accueil, consulter les informations publiques et vous inscrire ou vous connecter pour accéder à plus de fonctionnalités.</p>
  },
  {
    question: "Comment puis-je effectuer une recherche sur le site en tant que visiteur ?",
    answer: <p>Tous les visiteurs peuvent utiliser la barre de recherche située en haut de chaque page pour trouver rapidement des informations spécifiques.</p>
  },

  // Questions - Accès Étudiant
  {
    question: "À quelles salles et ressources ai-je accès en tant qu'étudiant ?",
    answer: <div>
      En tant qu'étudiant, vous avez accès à :
      <ul>
        <li>Salles de classe</li>
        <li>Réfectoire (totalité)</li>
        <li>Bibliothèque (totalité sauf Portique RFID)</li>
        <li>Amphithéâtre (totalité sauf Système Audio)</li>
      </ul>
      Vous ne pouvez pas réserver de salles.
    </div>
  },
  {
    question: "Comment puis-je consulter les informations sur l'école en tant qu'étudiant ?",
    answer: <div>
      Vous pouvez consulter les informations sur :
      <ul>
        <li>Alarme incendie</li>
        <li>Éclairage du Hall Principal</li>
      </ul>
    </div>
  },
  {
    question: "Quels sont mes accès concernant le parking en tant qu'étudiant ?",
    answer: <div>
      Vous pouvez consulter les informations sur :
      <ul>
        <li>Éclairage du Parking</li>
        <li>Barrière du Parking</li>
        <li>Borne de recharge</li>
      </ul>
    </div>
  },

  // Questions - Accès Professeur
  {
    question: "À quels objets ai-je accès en tant que professeur ?",
    answer: <p>En tant que professeur, vous avez accès à la plupart des objets connectés, sauf : Grille principale, Caméra Issue de Secours, Détecteur de Fumée et objets du Parking & extérieur (sauf Barrière & éclairage Parking, Borne de recharge, Capteur de présence).</p>
  },
  {
    question: "Quelles actions puis-je effectuer sur les objets en tant que professeur ?",
    answer: <p>Vous pouvez créer une alerte sur un objet, solliciter la suppression d'un objet connecté, réserver une salle et ajouter un objet avec configuration des services.</p>
  },
  {
    question: "Comment puis-je associer des objets connectés à des pièces ou zones en tant que professeur ?",
    answer: <p>Vous pouvez associer des objets connectés à des pièces ou zones spécifiques et configurer les paramètres d'utilisation des objets connectés (par ex. température cible, horaire de fonctionnement).</p>
  },
  {
    question: "Comment puis-je surveiller et optimiser les ressources en tant que professeur ?",
    answer: <p>Vous pouvez consulter et générer des rapports d'utilisation des objets, identifier les objets inefficaces ou nécessitant une maintenance, et accéder aux historiques des données des objets connectés.</p>
  },

  // Questions - Accès Directeur
  {
    question: "À quels objets ai-je accès en tant que directeur ?",
    answer: <p>En tant que directeur, vous avez accès à tous les objets connectés.</p>
  },
  {
    question: "Quelles actions puis-je effectuer en tant que directeur ?",
    answer: <p>Vous pouvez résoudre les alertes, gérer les accès aux objets, gérer les utilisateurs, gérer les objets et outils/services, assurer la sécurité et la maintenance, personnaliser la plateforme et générer des rapports avancés.</p>
  },
  {
    question: "Comment puis-je gérer les utilisateurs en tant que directeur ?",
    answer: <p>Vous pouvez ajouter, modifier ou supprimer des utilisateurs, attribuer ou révoquer des niveaux d'accès, superviser les points accumulés et consulter les historiques de connexion et d'actions.</p>
  },
  {
    question: "Comment puis-je gérer les objets et outils/services en tant que directeur ?",
    answer: <p>Vous pouvez ajouter ou supprimer des catégories d'objets et d'outils/services, ajouter ou supprimer des objets et des outils/services, et définir les règles de fonctionnement globales.</p>
  },
  {
    question: "Comment puis-je assurer la sécurité et la maintenance de la plateforme en tant que directeur ?",
    answer: <p>Vous pouvez mettre à jour le système de gestion des accès, effectuer des sauvegardes régulières de la base de données et vérifier l'intégrité des données.</p>
  },
  {
    question: "Comment puis-je personnaliser la plateforme en tant que directeur ?",
    answer: <p>Vous pouvez modifier l'apparence et la structure des modules, et configurer des règles de validation pour les inscriptions.</p>
  },
  {
    question: "Quels types de rapports avancés puis-je générer en tant que directeur ?",
    answer: <p>Vous pouvez générer des rapports détaillés sur l'utilisation globale de la plateforme, des statistiques sur la consommation énergétique totale, le taux de connexion des utilisateurs et les services les plus utilisés, et accéder aux historiques des données des objets connectés.</p>
  },
];

export const POINTS_CONFIG = {
  // Points par interaction
  BASIC_INTERACTION: 5,    // Pour les interactions simples
  DEVICE_TOGGLE: 10,       // Pour allumer/éteindre un appareil
  ADJUST_SETTING: 15,      // Pour ajuster des paramètres (Chauffage, volume)
  SPECIAL_TASK: 25,        // Pour des tâches spéciales (préparer café, utiliser microonde)
  
  // Multiplicateurs de points par rôle
  ROLE_MULTIPLIERS: {
    'eleve': 1,          // Élève : multiplicateur de base
    'professeur': 1.5,     // Professeur : 1.5x les points
    'directeur': 2         // Directeur : 2x les points
  },

  // Seuils de niveau
  LEVEL_THRESHOLDS: {
    'eleve': 0,
    'professeur': 200,    // 200 points pour devenir gestionnaire
    'directeur': 500      // 500 points pour devenir directeur
  }
};

