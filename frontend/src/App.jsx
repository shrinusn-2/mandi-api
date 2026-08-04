import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PlaygroundPage from './pages/PlaygroundPage';
import DocsPage from './pages/DocsPage';
import StatusPage from './pages/StatusPage';
import { ROUTES } from './routes';

const PAGE_COMPONENTS = {
  '/': HomePage,
  '/playground': PlaygroundPage,
  '/docs': DocsPage,
  '/status': StatusPage
};

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingBottom: '4rem' }}>
        <Routes>
          {ROUTES.map(({ path }) => {
            const Component = PAGE_COMPONENTS[path];
            return <Route key={path} path={path} element={<Component />} />;
          })}
        </Routes>
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '2rem 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <div className="container">
          <p>© 2026 Mandi Price API — Open Agricultural Data Infrastructure for Developers.</p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}>
            Data sourced directly from Ministry of Agriculture and Farmers Welfare (data.gov.in)
          </p>
        </div>
      </footer>
    </div>
  );
}
