import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PlaygroundPage from './pages/PlaygroundPage';
import DocsPage from './pages/DocsPage';
import StatusPage from './pages/StatusPage';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="container" style={{ flex: 1, paddingBottom: '4rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/status" element={<StatusPage />} />
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
