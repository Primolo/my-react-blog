import './App.css';

function App() {
  return (
    <div className="App" style={{padding: '20px', fontFamily: 'system-ui'}}>
      <header>
        <h1>🎉 Mon Blog React</h1>
        <p>Bienvenue sur mon blog ! Déployé via GitHub Actions + Pages.</p>
      </header>
      <main style={{marginTop: '40px'}}>
        <article>
          <h2>Premier article</h2>
          <p>Ce blog est entièrement autonome. Chaque push sur main déclenche un déploiement.</p>
        </article>
      </main>
      <footer style={{marginTop: '60px', opacity: 0.6}}>
        <p>© 2026 — Propulsé par React + GitHub Pages</p>
      </footer>
    </div>
  );
}

export default App;
