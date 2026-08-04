import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function Navbar() {
  return (
    <header className="header-nav">
      <div className="container nav-container">
        <NavLink to="/" className="logo" style={{ cursor: 'pointer' }}>
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
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Overview
          </NavLink>
          <NavLink to="/playground" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Playground
          </NavLink>
          <NavLink to="/docs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Docs
          </NavLink>
          <NavLink to="/status" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Status
          </NavLink>
        </nav>

        <StatusBadge />
      </div>
    </header>
  );
}
