/*
 * Composant Formation : Présentation des parcours de formation
 * 
 * Structure :
 * 1. Système d'onglets pour les types de formation :
 *    - Voie classique
 *    - Voie Recherche & Développement
 *    - Doubles diplômes
 * 
 * 2. Grille de cartes pour chaque formation :
 *    - Image représentative
 *    - Description détaillée
 *    - Liste des compétences clés
 *    - Témoignages d'étudiants
 *    - Liens vers plus d'informations
 * 
 * Fonctionnement :
 * - Gestion d'état avec useState pour l'onglet actif
 * - Chargement dynamique des données depuis formationsData
 * - Mise en page responsive avec CSS Grid
 * - Navigation fluide entre les différents types de formation
 * 
 * Interactions utilisateur :
 * - Changement d'onglet instantané
 * - Affichage des détails dans des cartes interactives
 * - Liens externes sécurisés (rel="noopener noreferrer")
 */

import React, { useState } from 'react';
import { 
  FormationContainer,
  FormationHeader,
  FormationGrid,
  FormationCard,
  FormationType,
  FormationDetails,
  TabContainer,
  Tab
} from '../styles/FormationStyles';


import {formationsData} from '../data/projectData';


const Formation = () => {
  // État pour gérer l'onglet de formation actif
  const [activeTab, setActiveTab] = useState('classique');
  
  // Données des formations filtrées selon l'onglet actif
  const currentFormations = formationsData[activeTab];

  return (
    // Conteneur principal avec layout responsive
    <FormationContainer>
      {/* En-tête avec navigation par onglets */}
      <FormationHeader>
        <h1>Nos Formations</h1>
        
        {/* Système de navigation par onglets */}
        <TabContainer>
          {/* Chaque onglet est interactif et reflète son état actif */}
          <Tab 
            active={activeTab === 'classique'} 
            onClick={() => setActiveTab('classique')}
          >
            Ingénieur | Voie classique
          </Tab>
          <Tab 
            active={activeTab === 'recherche'} 
            onClick={() => setActiveTab('recherche')}
          >
            Ingénieur | Voie Recherche & Développement
          </Tab>
          <Tab 
            active={activeTab === 'double-diplome'} 
            onClick={() => setActiveTab('double-diplome')}
          >
            Ingénieur | Doubles diplômes (en 6 ans)
          </Tab>
        </TabContainer>
      </FormationHeader>

      {/* Grille des formations */}
      <FormationGrid>
        {/* Génération des cartes de formation avec les détails */}
        {currentFormations && Object.entries(currentFormations).map(([name, details]) => (
          <FormationCard key={name}>
            <FormationType>{name}</FormationType>
            <img src={details.image} alt={name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <FormationDetails>
              <p>{details.description}</p>
              <h4>Compétences clés :</h4>
              <ul>
                {details.competences.map(comp => (
                  <li key={comp}>{comp}</li>
                ))}
              </ul>
              <p style={{ fontStyle: 'italic' }}>{details.temoignage}</p>
              <a href={details.lien} target="_blank" rel="noopener noreferrer">En savoir plus</a>
            </FormationDetails>
          </FormationCard>
        ))}
      </FormationGrid>
    </FormationContainer>
  );
};

export default Formation;
