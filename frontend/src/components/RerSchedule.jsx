import React, { useState, useEffect } from 'react';
import {
  ScheduleContainer,
  MainTitle,
  DirectionBox,
  DirectionTitle,
  ErrorMessage
} from '../styles/RerScheduleStyles';

export default function RerSchedule() {
  const [schedules, setSchedules] = useState({ toParis: [], toCergy: [] });
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(
          'https://api.sncf.com/v1/coverage/sncf/stop_areas/stop_area:SNCF:87381905/arrivals?count=10',
          {
            headers: {
              Authorization: '794cbefe-7238-4c7c-835c-8e16aa6f3d7f'
            }
          }
        );
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();
        const arrivals = data.arrivals || [];
        // Filtrer les arrivées selon la direction affichée
        const toParis = arrivals.filter(arrival =>
          arrival.display_informations.direction.includes('Boissy-Saint-Léger')
        );
        const toCergy = arrivals.filter(arrival =>
          arrival.display_informations.direction.includes('Cergy le Haut')
        );
        
        setSchedules({ toParis, toCergy });
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
    // Vous pouvez modifier ces URL ou leur logique selon vos besoins.
    const url =
      direction === 'paris'
        ? 'https://www.ratp.fr/horaires-rer?network-current=rer&networks=rer&line_rer=A&stop_point_rer=Cergy+Préfecture'
        : 'https://www.ratp.fr/horaires-rer?network-current=rer&networks=rer&line_rer=A&stop_point_rer=Cergy+Préfecture';
    window.open(url, '_blank');
  };

  // Fonction de formatage de l'heure (exemple: "20250326T145800" => "14:58")
  const formatHeure = (dateTimeStr) => {
    if (!dateTimeStr || dateTimeStr.length < 13) return dateTimeStr;
    const heure = dateTimeStr.substring(9, 11);
    const minutes = dateTimeStr.substring(11, 13);
    return `${heure}:${minutes}`;
  };

  return (
    <ScheduleContainer>
      <MainTitle>Horaires RER A - Cergy Préfecture</MainTitle>
      <small>Dernière mise à jour : {lastUpdate?.toLocaleTimeString()}</small>
      <DirectionBox>
        <DirectionTitle onClick={() => handleDirectionClick('paris')}>
          Direction Paris ↗️
        </DirectionTitle>
        {schedules.toParis.length > 0 ? (
          schedules.toParis.slice(0, 3).map((train, index) => (
            <div key={index} style={{ margin: '10px 0', fontSize: '1.1em' }}>
              ⏰ Prochain train vers {train.display_informations.direction} à {formatHeure(train.stop_date_time.arrival_date_time)}
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
              ⏰ Prochain train vers {train.display_informations.direction} à {formatHeure(train.stop_date_time.arrival_date_time)}
            </div>
          ))
        ) : (
          <ErrorMessage>Aucun train disponible pour le moment</ErrorMessage>
        )}
      </DirectionBox>
    </ScheduleContainer>
  );
}

