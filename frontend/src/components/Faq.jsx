/*
 * Composant Faq : Foire aux questions interactive
 * - Affiche une liste de questions/réponses organisée en deux colonnes
 * - Gère un système d'accordéon pour afficher/masquer les réponses
 * - Utilise des animations pour l'ouverture/fermeture des réponses
 * - Maintient l'état d'ouverture/fermeture pour chaque question
 * - Charge les données depuis un fichier de configuration externe
 */

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

import {faqData} from '../data/projectData';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Diviser les questions en deux colonnes
  const midpoint = Math.ceil(faqData.length / 2);
  const firstColumn = faqData.slice(0, midpoint);
  const secondColumn = faqData.slice(midpoint);

  return (
    <FaqContainer id="faq-section">
      <FaqTitle>Foire aux questions</FaqTitle>
      <FaqContent>

        {/* Colonne gauche */}
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

        {/* Colonne droite */}
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
