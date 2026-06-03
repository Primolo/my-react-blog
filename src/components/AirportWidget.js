import { useState, useEffect } from 'react';

function AirportWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAirport = async () => {
      try {
        const [metarRes, stationRes] = await Promise.all([
          fetch('https://aviationweather.gov/api/data/metar?ids=LFSP&format=json'),
          fetch('https://aviationweather.gov/api/data/stationinfo?ids=LFSP&format=json')
        ]);

        let metar = null;
        let station = null;

        if (metarRes.ok) {
          const metarJson = await metarRes.json();
          metar = metarJson?.[0] || metarJson;
        }
        if (stationRes.ok) {
          station = await stationRes.json();
        }

        setData({ metar, station });
      } catch (err) {
        setError('Données indisponibles');
      } finally {
        setLoading(false);
      }
    };

    fetchAirport();
    const interval = setInterval(fetchAirport, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="widget">
        <div className="widget-header"><span className="widget-icon">✈️</span><h2 className="widget-title">LFSP Pontarlier</h2></div>
        <div className="loading"><div className="spinner" />Chargement...</div>
      </div>
    );
  }

  if (error || !data?.metar) {
    return (
      <div className="widget">
        <div className="widget-header"><span className="widget-icon">✈️</span><h2 className="widget-title">LFSP Pontarlier</h2></div>
        <div className="airport-info">
          <div className="airport-item"><div className="label">ICAO</div><div className="value">LFSP</div></div>
          <div className="airport-item"><div className="label">Piste</div><div className="value active">05/23 — 800m</div></div>
          <div className="airport-item"><div className="label">Altitude</div><div className="value">1200m</div></div>
          <div className="airport-item"><div className="label">Surface</div><div className="value">Herbe</div></div>
        </div>
        <div style={{ marginTop: '12px', fontSize: '0.85rem', color: '#fbbf24' }}>⚠️ METAR temps réel indisponible</div>
        <a href="https://metar-taf.com/fr/LFSP" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '12px', color: '#00d4ff', fontSize: '0.9rem', textDecoration: 'none' }}>Voir METAR/TAF →</a>
      </div>
    );
  }

  const m = data.metar;
  const obsTime = m.obsTime ? new Date(m.obsTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--';

  return (
    <div className="widget">
      <div className="widget-header"><span className="widget-icon">✈️</span><h2 className="widget-title">LFSP Pontarlier</h2></div>
      <div className="airport-info">
        <div className="airport-item"><div className="label">Vent</div><div className="value">{m.wspd !== undefined ? `${m.wdir}° à ${m.wspd}kt` : 'N/A'}</div></div>
        <div className="airport-item"><div className="label">Visibilité</div><div className="value">{m.visib !== undefined ? `${m.visib} miles` : 'N/A'}</div></div>
        <div className="airport-item"><div className="label">Température</div><div className="value">{m.temp !== undefined ? `${m.temp}°C` : 'N/A'}</div></div>
        <div className="airport-item"><div className="label">Point de rosée</div><div className="value">{m.dewp !== undefined ? `${m.dewp}°C` : 'N/A'}</div></div>
        <div className="airport-item"><div className="label">Altimètre</div><div className="value">{m.altim !== undefined ? `${Math.round(m.altim)} hPa` : 'N/A'}</div></div>
        <div className="airport-item"><div className="label">Piste</div><div className="value active">05/23 — 800m</div></div>
      </div>
      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '12px 16px', marginTop: '16px', fontFamily: 'Courier New, monospace', fontSize: '0.8rem' }}>
        <div style={{ color: '#94a3b8', marginBottom: '4px', fontSize: '0.75rem' }}>METAR / {obsTime} UTC</div>
        <div style={{ color: '#e2e8f0', wordBreak: 'break-all' }}>{m.rawOb || 'N/A'}</div>
      </div>
      <a href="https://metar-taf.com/fr/LFSP" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '12px', color: '#00d4ff', fontSize: '0.9rem', textDecoration: 'none' }}>Détails METAR/TAF →</a>
    </div>
  );
}

export default AirportWidget;