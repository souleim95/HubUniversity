import React, { useEffect, useState } from 'react';
import {
  WeatherContainer,
  WeatherTitle,
  WeatherDetails,
  WeatherIcon,
  WeatherDescription,
  WeatherTemp,
  WeatherError,
  WeatherLoading,
  ForecastContainer,
  ForecastDay,
  ForecastTemp,
  ForecastDate
} from '../styles/WeatherStyles';

/* 
* Composant WeatherInfo : affiche les données météo actuelles + prévisions
* Récupère les données depuis l’API WeatherAPI (ville : Cergy)
* Gère les cas de chargement, d’erreur, et affiche un résumé clair de la météo
* Les prévisions à 4 jours sont affichées avec icônes et températures
*/
export default function WeatherInfo() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = '47e393553f924e66b8a171010250704'; // Clé API WeatherAPI
  const city = 'Cergy'; // Ville cible pour la météo

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=4&lang=fr`
        );
        if (!response.ok) throw new Error('Erreur lors de la récupération de la météo');
        const data = await response.json();
        setWeather(data.current); // Météo actuelle
        setForecast(data.forecast.forecastday); // Prévision sur plusieurs jours
      } catch (err) {
        setError(err.message); // Gestion des erreurs
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) return <WeatherLoading>Chargement de la météo...</WeatherLoading>;
  if (error) return <WeatherError>{error}</WeatherError>;

  const iconUrl = `https://${weather.condition.icon}`; // Icône météo actuelle

  return (
    <WeatherContainer>
      <WeatherTitle>Météo à {city}</WeatherTitle>
      <WeatherDetails>
        <WeatherIcon src={iconUrl} alt={weather.condition.text} />
        <div>
          <WeatherDescription>{weather.condition.text}</WeatherDescription>
          <WeatherTemp>🌡️ {Math.round(weather.temp_c)}°C</WeatherTemp>
        </div>
      </WeatherDetails>

      {/* Affichage des prévisions météo */}
      <ForecastContainer>
        {forecast.map((day, index) => (
          <ForecastDay key={index}>
            <ForecastDate>{new Date(day.date).toLocaleDateString()}</ForecastDate>
            <WeatherIcon src={`https://${day.day.condition.icon}`} alt={day.day.condition.text} />
            <ForecastTemp>
              🌡️ {Math.round(day.day.avgtemp_c)}°C
            </ForecastTemp>
            <WeatherDescription>{day.day.condition.text}</WeatherDescription>
          </ForecastDay>
        ))}
      </ForecastContainer>
    </WeatherContainer>
  );
}