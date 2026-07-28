import React from 'react';
import { ArrowRight, Database, ShieldCheck, Zap, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import CodeSnippet from '../components/CodeSnippet';

export default function HomePage({ setActiveTab }) {
  return (
    <div style={{ padding: '3rem 0' }}>
      {/* Hero Banner */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
        <div style={{
          display: 'inline-flex',
          align: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid var(--border-emerald)',
          color: 'var(--accent-emerald)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={14} /> Open Source Ag-Tech Infrastructure
        </div>
        
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, #ffffff 40%, #9ca3af 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Daily Agricultural Mandi Prices API for Developers
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Free, keyless REST API serving real-time and historical wholesale crop prices across 
          5 major Indian states sourced directly from data.gov.in.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('playground')}>
            Try Live Playground <ArrowRight size={16} />
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('docs')}>
            View API Docs
          </button>
        </div>
      </div>

      {/* Quick Start Code Preview */}
      <div style={{ maxWidth: '900px', margin: '0 auto 4rem auto' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          ⚡ Quick Start Request
        </h3>
        <CodeSnippet url="/v1/prices?state=Maharashtra&commodity=Onion" />
      </div>

      {/* Feature Cards */}
      <div className="grid-3" style={{ marginBottom: '4rem' }}>
        <div className="glass-card">
          <div style={{ color: 'var(--accent-emerald)', marginBottom: '1rem' }}>
            <Zap size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Keyless & Open Access</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            No sign-ups or complex authentication headers required. Start building agri-tech tools immediately.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
            <Database size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Daily Govt Sync</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Automated daily ingestion pipelines pull fresh prices from the Ministry of Agriculture portal every day.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ color: 'var(--accent-amber)', marginBottom: '1rem' }}>
            <Globe size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>5 Top Indian States</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Comprehensive coverage across Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh, and Karnataka.
          </p>
        </div>
      </div>

      {/* Supported States Pill List */}
      <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Supported States in v1</h4>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Maharashtra', 'Uttar Pradesh', 'Punjab', 'Madhya Pradesh', 'Karnataka'].map(st => (
            <span key={st} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <CheckCircle2 size={14} color="#10b981" /> {st}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
