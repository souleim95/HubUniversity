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
  const [activeTab, setActiveTab] = useState('classique');
  const currentFormations = formationsData[activeTab];

  return (
    <FormationContainer>
      <FormationHeader>
        <h1>Nos Formations</h1>
        <TabContainer>
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

      <FormationGrid>
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
