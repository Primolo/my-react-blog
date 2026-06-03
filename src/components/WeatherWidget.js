import { useState, useEffect } from 'react';

const WEATHER_CODES = {
  0: { icon: '☀️', label: 'Ensoleillé' },
  1: { icon: '🌤️', label: 'Partiellement nuageux' },
  2: { icon: '⛅', label: 'Nuageux' },
  3: { icon: '☁️', label: 'Couvert' },
  45: { icon: '🌫️', label: 'Brouillard' },
  48: { icon: '🌫️', label: 'Brouillard givrant' },
  51: { icon: '🌧️', label: 'Bruine légère' },
  53: { icon: '🌧️', label: 'Bruine' },
  55: { icon: '🌧️', label: 'Bruine dense' },
  61: { icon: '🌧️', label: 'Pluie légère' },
  63: { icon: '🌧️', label: 'Pluie' },
  65: { icon: '🌧️', label: 'Pluie forte' },
  71: { icon: '🌨️', label: 'Neige légère' },
  73: { icon: '🌨️', label: 'Neige' },
  75: { icon: '🌨️', label: 'Neige forte' },
  77: { icon: '🌨️', label: 'Grains de neige' },
  80: { icon: '🌦️', label: 'Averses légères' },
  81: { icon: '🌦️', label: 'Averses' },
  82: { icon: '🌦️', label: 'Averses fortes' },
  95: { icon: '⛈️', label: 'Orage' },
  96: { icon: '⛈️', label: 'Orage avec grêle' },
  99: { icon: '⛈️', label: 'Orage fort avec grêle' },
};

function WeatherWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = 46.93;
        const lon = 6.32;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility&hourly=temperature_2m,weather_code&timezone=Europe/Paris`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur météo');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // refresh toutes les 10 min
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="widget">
        <div className="widget-header">
          <span className="widget-icon">🌦️</span>
          <h2 className="widget-title">Météo Montperreux</h2>
        </div>
        <div className="loading">
          <div className="spinner" />
          Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="widget">
        <div className="widget-header">
          <span className="widget-icon">🌦️</span>
          <h2 className="widget-title">Météo Montperreux</h2>
        </div>
        <div className="error">⚠️ {error}</div>
      </div>
    );
  }

  const current = data.current;
  const wmo = WEATHER_CODES[current.weather_code] || { icon: '❓', label: 'Inconnu' };

  const windDirection = (() => {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    return dirs[Math.round(current.wind_direction_10m / 22.5) % 16];
  })();

  return (
    <div className="widget">
      <div className="widget-header">
        <span className="widget-icon">🌦️</span>
        <h2 className="widget-title">Météo Montperreux</h2>
      </div>

      <div className="weather-main">
        <div className="weather-temp">{Math.round(current.temperature_2m)}°</div>
        <div className="weather-desc">
          <div className="condition">{wmo.icon} {wmo.label}</div>
          <div>Ressenti {Math.round(current.apparent_temperature)}°</div>
        </div>
      </div>

      <div className="weather-grid">
        <div className="weather-item">
          <div className="label">Humidité</div>
          <div className="value">{current.relative_humidity_2m}%</div>
        </div>
        <div className="weather-item">
          <div className="label">Vent</div>
          <div className="value">{Math.round(current.wind_speed_10m * 3.6)} km/h {windDirection}</div>
        </div>
        <div className="weather-item">
          <div className="label">Pression</div>
          <div className="value">{Math.round(current.pressure_msl)} hPa</div>
        </div>
        <div className="weather-item">
          <div className="label">Visibilité</div>
          <div className="value">{(current.visibility / 1000).toFixed(1)} km</div>
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget;
