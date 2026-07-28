import React from 'react';
import { Sprout, Terminal, BarChart2, BookOpen, Activity } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="header-nav">
      <div className="container nav-container">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div className="logo-icon">
            <Sprout size={22} />
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
