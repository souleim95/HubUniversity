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
