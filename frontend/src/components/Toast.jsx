import React, { useEffect } from 'react';
import { ToastContainer, Toast as ToastElement } from '../styles/ToastStyles';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

/*
* Composant Toast : affiche des notifications temporaires à l'utilisateur
* Gère différents types de messages (succès, erreur, info) avec icônes adaptées
* Supprime automatiquement le toast après 3 secondes grâce à useEffect
*/
const Toast = ({ messages, removeToast }) => {
  useEffect(() => {
    // Lorsque de nouveaux messages sont ajoutés, on déclenche un timer pour retirer le dernier
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      const timer = setTimeout(() => {
        removeToast(latestMessage.id);
      }, 3000); // Délai d'affichage du toast

      // Nettoyage du timer en cas de mise à jour ou démontage
      return () => clearTimeout(timer);
    }
  }, [messages, removeToast]);

  // Fonction utilitaire pour retourner une icône selon le type de message
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaTimesCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  return (
    // Conteneur principal des toasts
    <ToastContainer>
      {/* Affichage des messages sous forme de composants ToastElement */}
      {messages.map(msg => (
        <ToastElement key={msg.id} type={msg.type}>
          {getIcon(msg.type)} {/* Affichage de l'icône selon le type */}
          {msg.text} {/* Texte du message */}
        </ToastElement>
      ))}
    </ToastContainer>
  );
};

export default Toast;
