import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, RefreshCw } from 'lucide-react';

export default function CustomSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  disabled = false,
  loading = false,
  icon: Icon
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Normalize options array (supports string array or object array { label, value, sublabel })
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return opt;
  });

  const filteredOptions = normalizedOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opt.sublabel && opt.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

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
      {label && (
        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
          <span>{label}</span>
          {loading && <RefreshCw size={12} className="spin" color="var(--accent-emerald)" />}
        </label>
      )}

      {/* Button Trigger */}
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          padding: '0.65rem 0.85rem',
          background: '#0d121f',
          border: isOpen ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
          borderRadius: '8px',
          color: selectedOption ? '#fff' : 'var(--text-muted)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          cursor: disabled || loading ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.15s ease'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {Icon && <Icon size={16} color="var(--accent-emerald)" />}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown size={16} color="var(--text-secondary)" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.35rem',
          background: '#121929',
          border: '1px solid var(--border-emerald)',
          borderRadius: '10px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
          zIndex: 100,
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease'
        }}>
          {/* Search Bar Input */}
          <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)' }}>
            <Search size={14} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder={`Search ${label || 'options'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'var(--font-sans)'
              }}
            />
          </div>

          {/* List Options */}
          <div style={{ maxHeight: '220px', overflowY: 'auto', padding: '0.35rem 0' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.88rem',
                      color: isSelected ? 'var(--accent-emerald)' : '#e5e7eb',
                      background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isSelected ? 'rgba(16, 185, 129, 0.12)' : 'transparent';
                    }}
                  >
                    <div>
                      <div>{opt.label}</div>
                      {opt.sublabel && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {opt.sublabel}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check size={14} color="var(--accent-emerald)" />}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No matching options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
