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
} from '../styles/WeatherStyles'; // Ajuste le chemin si nécessaire

export default function WeatherInfo() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = '47e393553f924e66b8a171010250704'; // Remplace par ta vraie clé API WeatherAPI
  const city = 'Cergy'; // Nom de la ville à afficher

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=4&lang=fr`
        );
        if (!response.ok) throw new Error('Erreur lors de la récupération de la météo');
        const data = await response.json();
        setWeather(data.current);
        setForecast(data.forecast.forecastday); // Données de prévision
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]); // Ajoute city dans les dépendances si tu veux mettre à jour la météo en fonction de la ville

  if (loading) return <WeatherLoading>Chargement de la météo...</WeatherLoading>;
  if (error) return <WeatherError>{error}</WeatherError>;

  const iconUrl = `https://${weather.condition.icon}`;

  return (
    <WeatherContainer>
      <WeatherTitle>Météo à {city}</WeatherTitle> {/* Utilisation de la variable city ici */}
      <WeatherDetails>
        <WeatherIcon src={iconUrl} alt={weather.condition.text} />
        <div>
          <WeatherDescription>{weather.condition.text}</WeatherDescription>
          <WeatherTemp>🌡️ {Math.round(weather.temp_c)}°C</WeatherTemp>
        </div>
      </WeatherDetails>

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
