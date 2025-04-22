import React, { useState, useEffect } from 'react';
import WeatherInfo from './WeatherInfo';
import {
  ScheduleContainer,
  MainTitle,
  DirectionBox,
  DirectionTitle,
  ErrorMessage,
  TrainInfo,
  FlexContainer
} from '../styles/RerScheduleStyles';

/*
* Composant RerSchedule : affiche les horaires RER A depuis l’API SNCF en temps réel
* Sépare les directions Paris et Cergy, avec mise à jour toutes les 30 secondes
* Affiche les prochains trains disponibles, ou un message si aucun train n’est prévu
* Permet d'accéder aux horaires complets en ouvrant les liens RATP correspondants
* Inclut le composant WeatherInfo pour enrichir l'interface avec la météo actuelle
*/
export default function RerSchedule() {
  const [schedules, setSchedules] = useState({ toParis: [], toCergy: [] });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);
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

        // Filtrage selon la direction des trains
        const toParis = arrivals.filter(arrival => {
          const dir = arrival.display_informations.direction.toLowerCase();
          return /paris|châtelet|nation|boissy|torcy|marne|chessy/.test(dir);
        });        
        const toCergy = arrivals.filter(arrival =>
          arrival.display_informations.direction.includes('Cergy le Haut')
        );
        
        setSchedules({ toParis, toCergy });
        setLastUpdate(new Date()); // Enregistre l'heure de dernière mise à jour
      } catch (error) {
        setError('Erreur lors de la récupération des horaires');
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
    const interval = setInterval(fetchSchedules, 30000); // Rafraîchit toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  const handleDirectionClick = (direction) => {
    const url =
      direction === 'paris'
        ? 'https://www.ratp.fr/horaires-rer?network-current=rer&networks=rer&line_rer=A&stop_point_rer=Boissy-Saint-Léger'
        : 'https://www.ratp.fr/horaires-rer?network-current=rer&networks=rer&line_rer=A&stop_point_rer=Cergy+le+Haut';
    window.open(url, '_blank'); // Ouvre le lien dans un nouvel onglet
  };

  // Formatage des heures à partir des chaînes de datetime API
  const formatHeure = (dateTimeStr) => {
    if (!dateTimeStr || dateTimeStr.length < 13) return dateTimeStr;
    const heure = dateTimeStr.substring(9, 11);
    const minutes = dateTimeStr.substring(11, 13);
    return `${heure}:${minutes}`;
  };

  return (
    <div>
      <h3 style={{ fontSize: '1.8em', color: '#0f6ead', textAlign: 'center', marginBottom: '20px' }}>
        Horaires RER A - Cergy Préfecture
      </h3>
      <small>Dernière mise à jour : {lastUpdate?.toLocaleTimeString()}</small>
      {loading && <p>Chargement des horaires...</p>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div>
        {/* Bloc des trains vers Paris */}
        <DirectionBox>
          <DirectionTitle onClick={() => handleDirectionClick('paris')}>
            Direction Paris ↗️
          </DirectionTitle>
          {schedules.toParis.length > 0 ? (
            schedules.toParis.slice(0, 3).map((train, index) => (
              <TrainInfo key={index}>
                ⏰ Prochain train vers {train.display_informations.direction} à {formatHeure(train.stop_date_time.arrival_date_time)}
              </TrainInfo>
            ))
          ) : (
            <ErrorMessage>Aucun train disponible pour le moment</ErrorMessage>
          )}
        </DirectionBox>

        {/* Bloc des trains vers Cergy */}
        <DirectionBox>
          <DirectionTitle onClick={() => handleDirectionClick('cergy')}>
            Direction Cergy ↗️
          </DirectionTitle>
          {schedules.toCergy.length > 0 ? (
            schedules.toCergy.slice(0, 3).map((train, index) => (
              <TrainInfo key={index}>
                ⏰ Prochain train vers {train.display_informations.direction} à {formatHeure(train.stop_date_time.arrival_date_time)}
              </TrainInfo>
            ))
          ) : (
            <ErrorMessage>Aucun train disponible pour le moment</ErrorMessage>
          )}
        </DirectionBox>
      </div>
    </div>
  );
}