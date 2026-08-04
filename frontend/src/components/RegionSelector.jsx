import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, MapPin } from 'lucide-react';
import { SUPPORTED_STATES } from '../config';

export default function RegionSelector({ selectedState, onSelectState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredStates = SUPPORTED_STATES.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
        Select State
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          padding: '0.65rem 0.85rem',
          background: '#16231d',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          color: '#fff',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          cursor: 'pointer'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={16} color="var(--accent-gold)" />
          <span>{selectedState}</span>
        </span>
        <ChevronDown size={16} color="var(--text-secondary)" />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.35rem',
          background: '#1c2b22',
          border: '1px solid var(--border-gold)',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 50,
          overflow: 'hidden'
        }}>
          {/* Search Bar */}
          <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)' }}>
            <Search size={14} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* List Options */}
          <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '0.35rem 0' }}>
            {filteredStates.map(state => {
              const isSelected = state === selectedState;
              return (
                <div
                  key={state}
                  onClick={() => {
                    onSelectState(state);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    padding: '0.55rem 0.85rem',
                    fontSize: '0.88rem',
                    color: isSelected ? 'var(--accent-gold)' : '#ede6d6',
                    background: isSelected ? 'rgba(216, 155, 60, 0.1)' : 'transparent',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = isSelected ? 'rgba(216, 155, 60, 0.1)' : 'transparent'}
                >
                  <span>{state}</span>
                  {isSelected && <Check size={14} color="var(--accent-gold)" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
