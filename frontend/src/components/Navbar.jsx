import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="header-nav">
      <div className="container nav-container">
        <NavLink to="/" className="logo" style={{ cursor: 'pointer' }}>
          <div className="logo-icon" style={{ overflow: 'hidden', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(216, 155, 60, 0.15)', border: '1px solid rgba(216, 155, 60, 0.3)' }}>
            <img
              src="/logo.png"
              alt="Mandi API Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div>
            <span>Mandi<span style={{ color: 'var(--accent-gold)' }}>API</span></span>
            <span className="logo-subtitle" style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1 }}>
              v1 / Open Ag-Data
            </span>
          </div>
        </NavLink>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
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

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <StatusBadge />
      </div>
    </header>
  );
}
