import React from 'react';
import {
  FaWifi,
  FaThermometerHalf,
  FaVideo,
  FaRadiation,
  FaLightbulb,
  FaDoorClosed,
  FaChalkboard,
  FaVolumeUp,
  FaUtensils,
  FaCoffee,
  FaFan,
  FaPumpSoap,
  FaBarcode,
  FaBullhorn,
  FaCarAlt,
  FaBars,
  FaDoorOpen,
  FaChargingStation
} from 'react-icons/fa';

// Fonction utilitaire qui retourne une icône React selon le type fourni
// Permet d'afficher dynamiquement l'icône adaptée dans l'interface utilisateur
export const getIcon = (type) => {
  switch(type) {
    case 'Salle':
      return <FaChalkboard />;
    case 'Chauffage':
      return <FaThermometerHalf />;
    case 'Caméra':
      return <FaVideo />;
    case 'Capteur':
      return <FaRadiation />;
    case 'Éclairage':
      return <FaLightbulb />;
    case 'Porte':
      return <FaDoorClosed />;
    case 'Audio':
      return <FaVolumeUp />;
    case 'Distributeur':
      return <FaUtensils />;
    case 'Cafetiere':
      return <FaCoffee />;
    case 'Microwave':
      return <FaUtensils />;
    case 'AirSensor':
      return <FaFan />;
    case 'Dishwasher':
      return <FaPumpSoap />;
    case 'Scanner':
      return <FaBarcode />;
    case 'Ventilation':
      return <FaFan />;
    case 'Detecteur':
    case 'Securite':
      return <FaRadiation />;
    case 'Barriere':
      return <FaCarAlt />;
    case 'Panneau':
    case 'Affichage':
      return <FaBullhorn />;
    case 'Grille':
      return <FaDoorOpen />;
    case 'Borne':
      return <FaChargingStation />;
    case 'Projecteur':
      return <FaLightbulb />;
    case 'Store':
      return <FaBars />;
    default:
      return <FaWifi />; // Icône par défaut si le type n'est pas reconnu
  }
};
