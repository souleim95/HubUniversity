import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ScheduleContainer = styled.div`
  padding: 20px;
  margin: 20px auto;
  max-width: 800px;
  background-color:#f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const MainTitle = styled.h2`
  font-family: var(--font-secondary);
  color: rgb(15, 110, 173);
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
`;

const DirectionBox = styled.div`
  margin: 10px 0;
  padding: 15px;
  background-color:rgb(255, 255, 255);
  border-radius: 4px;
`;

const DirectionTitle = styled.h3`
  font-family: var(--font-secondary);
  cursor: pointer;
  color: rgb(15, 110, 173);
  font-size: 1.5em;
  margin-bottom: 15px;
  text-decoration: none;
  
  &:hover {
    color:rgb(67, 143, 228);
    text-decoration: none;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  margin: 10px 0;
  font-size: 1.1em;
`;

export default function RerSchedule() {
  const [schedules, setSchedules] = useState({ toParis: [], toCergy: [] });
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // Utilisation de l'API pierre-grimaud qui est plus fiable
        const [parisRes, cergyRes] = await Promise.all([
          fetch('https://api-ratp.pierre-grimaud.fr/v4/schedules/rers/A/cergy+le+haut/A'),
          fetch('https://api-ratp.pierre-grimaud.fr/v4/schedules/rers/A/cergy+le+haut/R')
        ]);

        const parisData = await parisRes.json();
        const cergyData = await cergyRes.json();

        setSchedules({
          toParis: parisData.result.schedules || [],
          toCergy: cergyData.result.schedules || []
        });
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Erreur lors de la récupération des horaires:', error);
      }
    };

    fetchSchedules();
    const interval = setInterval(fetchSchedules, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDirectionClick = (direction) => {
    const url = direction === 'paris' 
      ?'https://www.ratp.fr/horaires-rer?network-current=rer&networks=rer&line_rer=A&line_str_id_rer=LIG%3AIDFM%3AC01742&stop_point_rer=Cergy+Préfecture&stop_place_id_rer=ART%3AIDFM%3A44559&form_id=scheduledform&op=Rechercher&type=now&departure_date=22%2F032025&departure_time=0%3A47' 
      : 'https://www.ratp.fr/horaires-rer?network-current=rer&networks=rer&line_rer=A&line_str_id_rer=LIG%3AIDFM%3AC01742&stop_point_rer=Châtelet+-+Les+Halles&stop_place_id_rer=ART%3AIDFM%3A45102&form_id=scheduledform&op=Rechercher&type=now&departure_date=22%2F032025&departure_time=0%3A49' ;
    window.open(url, '_blank');
  };

  return (
    <ScheduleContainer>
      <MainTitle>Horaires RER A - Cergy-le-Haut</MainTitle>
      <small>Dernière mise à jour : {lastUpdate?.toLocaleTimeString()}</small>
      <DirectionBox>
        <DirectionTitle onClick={() => handleDirectionClick('paris')}>
          Direction Paris ↗️
        </DirectionTitle>
        {schedules.toParis.length > 0 ? (
          schedules.toParis.slice(0, 3).map((train, index) => (
            <div key={index} style={{ margin: '10px 0', fontSize: '1.1em' }}>
              ⏰ Prochain train dans : {train.message}
            </div>
          ))
        ) : (
          <ErrorMessage>Aucun train disponible pour le moment</ErrorMessage>
        )}
      </DirectionBox>
      <DirectionBox>
        <DirectionTitle onClick={() => handleDirectionClick('cergy')}>
          Direction Cergy ↗️
        </DirectionTitle>
        {schedules.toCergy.length > 0 ? (
          schedules.toCergy.slice(0, 3).map((train, index) => (
            <div key={index} style={{ margin: '10px 0', fontSize: '1.1em' }}>
              ⏰ Prochain train dans : {train.message}
            </div>
          ))
        ) : (
          <ErrorMessage>Aucun train disponible pour le moment</ErrorMessage>
        )}
      </DirectionBox>
    </ScheduleContainer>
  );
}
