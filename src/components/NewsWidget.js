import { useState, useEffect } from 'react';

function NewsWidget() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const allStories = [];
        for (const query of ['artificial intelligence', 'machine learning', 'LLM']) {
          const res = await fetch(`https://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=8`);
          if (!res.ok) continue;
          const json = await res.json();
          allStories.push(...(json.hits || []));
        }
        const seen = new Set();
        const unique = allStories
          .filter(s => { if (seen.has(s.objectID)) return false; seen.add(s.objectID); return true; })
          .sort((a, b) => b.created_at_i - a.created_at_i)
          .slice(0, 8);
        setStories(unique);
      } catch (err) {
        setError('Impossible de charger les news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 600000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp) => {
    const diff = Date.now() / 1000 - timestamp;
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    return `${Math.floor(diff / 86400)} j`;
  };

  if (loading) {
    return (
      <div className="widget">
        <div className="widget-header"><span className="widget-icon">🤖</span><h2 className="widget-title">News IA</h2></div>
        <div className="loading"><div className="spinner" />Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="widget">
        <div className="widget-header"><span className="widget-icon">🤖</span><h2 className="widget-title">News IA</h2></div>
        <div className="error">⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div className="widget">
      <div className="widget-header"><span className="widget-icon">🤖</span><h2 className="widget-title">News IA — HackerNews</h2></div>
      <div className="news-list">
        {stories.map((story) => (
          <a key={story.objectID} href={story.url || `https://news.ycombinator.com/item?id=${story.objectID}`} target="_blank" rel="noopener noreferrer" className="news-item">
            <div className="news-title">{story.title}</div>
            <div className="news-meta">
              <span>{story.author} · {formatTime(story.created_at_i)}</span>
              <span className="news-score">{story.points || 0}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default NewsWidget;
