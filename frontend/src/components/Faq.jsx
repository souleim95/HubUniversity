import React, { useState } from 'react';
import { 
  FaqContainer, 
  FaqTitle, 
  FaqContent, 
  FaqColumn, 
  FaqItem, 
  Question, 
  Answer 
} from '../styles/FaqStyles';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    // Questions générales sur la navigation et les fonctionnalités de base
    {
        question: "Comment naviguer sur le Dashboard ?",
        answer: <div>
        Le Dashboard propose :
        <ul>
            <li>🏅 Votre niveau et points</li>
            <li>📡 Accès aux objets connectés</li>
            <li>📅 Réservation de salles</li>
            <li>⚡ Suivi énergétique</li>
        </ul>
        </div>
    },
    {
        question: "Comment utiliser le plan interactif du campus ?",
        answer: <div>
        Le plan interactif permet de :
        <ul>
            <li>🏫 Localiser les bâtiments</li>
            <li>📚 Trouver les bibliothèques</li>
            <li>🎓 Voir les points d'intérêt</li>
            <li>📍 Obtenir des itinéraires</li>
        </ul>
        </div>
    },
    
    // Questions pratiques sur l'utilisation quotidienne
    {
        question: "Comment accéder aux bâtiments avec ma carte étudiante ?",
        answer: <p>
            Votre carte étudiante sert de badge d'accès. 
            Présentez-la devant les lecteurs aux entrées. <br />
            ⚠️Les accès sont limités selon vos horaires de cours et votre niveau d'autorisation.
        </p>
    },
    {
        question: "Comment puis-je réserver une salle d'étude ?",
        answer: <p>
            Les étudiants peuvent réserver une salle via leur espace personnel dans le module 'Gestion des salles'.<br /> 
            ⚠️La réservation est limitée à 3 fois par semaine et rapporte 1 point.
        </p>
    },
    {
        question: "Comment réserver une salle d'étude ?",
        answer: <div>
        Processus de réservation :
        <ul>
            <li>📅 Choisir date et horaire</li>
            <li>🏫 Sélectionner une salle disponible</li>
            <li>👥 Indiquer nombre de participants</li>
            <li>✅ Confirmer la réservation</li>
        </ul>
        <p>Limite : 3 réservations par semaine</p>
        </div>
    },
    {
        question: "Comment signaler un incident dans une salle ?",
        answer: <p>
          Dans votre espace personnel, accédez à la section 'Signalement d'incidents'. <br/>
          🏫Sélectionnez la salle concernée et décrivez le problème.<br/> 
          ⚠️Vous pouvez signaler jusqu'à 3 incidents par jour.
        </p>
    },
    
    // Questions sur le suivi et la gestion
    {
        question: "Comment suivre mes incidents signalés ?",
        answer: <div>
        Dans votre espace personnel :
        <ul>
            <li>📋 Liste complète des signalements</li>
            <li>🔄 Statut actualisé en direct</li>
            <li>📅 Historique des résolutions</li>
            <li>📬 Notifications de suivi</li>
        </ul>
        </div>
    },
    {
        question: "Comment gérer les objets connectés ?",
        answer: <div>
        Fonctionnalités disponibles :
        <ul>
            <li>🔥 Contrôle température par salle</li>
            <li>💡 Gestion éclairage intelligent</li>
            <li>📊 Suivi consommation en temps réel</li>
            <li>⚙️ Programmation automatique</li>
        </ul>
        </div>
    },
    
    // Questions sur le système de points et niveaux (moins prioritaires pour les nouveaux)
    {
        question: "Comment fonctionne le système de points ?",
        answer: <div>
        Points gagnés par action :
        <ul>
            <li>🎯 Connexion quotidienne : +0.5pt</li>
            <li>📝 Signalement d'incident : +2pts</li>
            <li>🏫 Réservation de salle : +1pt</li>
            <li>🎓 Participation événement : +3pts</li>
        </ul>
        </div>
    },
    {
        question: "Quels sont les différents niveaux d'utilisateur ?",
        answer: <div>
        Il existe 4 niveaux :
            <ul>
                <li>Débutant (0 pts)</li>
                <li>Intermédiaire (10 pts)</li>
                <li>Avancé (30 pts)</li>
                <li>Expert (50 pts)</li>
            </ul>
            <p>✅Chaque niveau débloque de nouvelles fonctionnalités.</p>
        </div>
    }
];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Diviser les questions en deux colonnes
  const midpoint = Math.ceil(faqData.length / 2);
  const firstColumn = faqData.slice(0, midpoint);
  const secondColumn = faqData.slice(midpoint);

  return (
    <FaqContainer>
      <FaqTitle>Foire aux questions</FaqTitle>
      <FaqContent>
        <FaqColumn>
          {firstColumn.map((item, index) => (
            <FaqItem key={index}>
              <Question onClick={() => toggleQuestion(index)}>
                {item.question}
                {openIndex === index ? ' ▼' : ' ▶'}
              </Question>
              <Answer isOpen={openIndex === index}>
                {item.answer}
              </Answer>
            </FaqItem>
          ))}
        </FaqColumn>
        
        <FaqColumn>
          {secondColumn.map((item, index) => (
            <FaqItem key={index + midpoint}>
              <Question onClick={() => toggleQuestion(index + midpoint)}>
                {item.question}
                {openIndex === (index + midpoint) ? ' ▼' : ' ▶'}
              </Question>
              <Answer isOpen={openIndex === (index + midpoint)}>
                {item.answer}
              </Answer>
            </FaqItem>
          ))}
        </FaqColumn>
      </FaqContent>
    </FaqContainer>
  );
};

export default Faq;
