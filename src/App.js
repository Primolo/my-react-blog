import { useState, useEffect } from 'react';
import './App.css';
import WeatherWidget from './components/WeatherWidget';
import AirportWidget from './components/AirportWidget';
import NewsWidget from './components/NewsWidget';

function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Dashboard Primo</h1>
        <p>{formatDate(time)}</p>
        <div className="clock">{formatTime(time)}</div>
      </header>

      <div className="dashboard-grid">
        <WeatherWidget />
        <AirportWidget />
        <NewsWidget />
      </div>
    </div>
  );
}

export default App;
