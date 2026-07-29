import React from 'react';
import { Sprout } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="header-nav">
      <div className="container nav-container">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div className="logo-icon" style={{ overflow: 'hidden', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <img 
              src="/logo.png" 
              alt="Mandi API Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div>
            <span>Mandi<span style={{ color: 'var(--accent-emerald)' }}>API</span></span>
            <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1 }}>
              v1 / Open Ag-Data
            </span>
          </div>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Overview
          </button>
          <button 
            className={`nav-link ${activeTab === 'playground' ? 'active' : ''}`}
            onClick={() => setActiveTab('playground')}
          >
            Playground
          </button>
          <button 
            className={`nav-link ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            Docs
          </button>
          <button 
            className={`nav-link ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            Status
          </button>
        </nav>

        <StatusBadge />
      </div>
    </header>
  );
}
