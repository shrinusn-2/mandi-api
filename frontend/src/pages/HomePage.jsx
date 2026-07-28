import React, { useState, useEffect } from 'react';
import { ArrowRight, Database, Zap, Globe, Sparkles, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import CodeSnippet from '../components/CodeSnippet';
import RegionSelector from '../components/RegionSelector';
import JsonViewer from '../components/JsonViewer';
import { API_BASE_URL } from '../config';

export default function HomePage({ setActiveTab }) {
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [demoData, setDemoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);

  const fetchDemo = async (stateName) => {
    setLoading(true);
    setIsWakingUp(false);
    
    // Set 2.5s timer for warm-up warning notice
    const timer = setTimeout(() => {
      setIsWakingUp(true);
    }, 2500);

    try {
      const res = await fetch(`${API_BASE_URL}/v1/prices?state=${encodeURIComponent(stateName)}`);
      clearTimeout(timer);
      const data = await res.json();
      setDemoData(data);
    } catch (err) {
      clearTimeout(timer);
      setDemoData({
        success: false,
        error: { code: 'DEMO_FETCH_ERROR', message: 'Could not connect to API server.' }
      });
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setIsWakingUp(false);
    }
  };

  useEffect(() => {
    fetchDemo(selectedState);
  }, [selectedState]);

  return (
    <div style={{ padding: '3rem 0' }}>
      {/* Hero Banner */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
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
          Truly free, open, keyless REST API serving real-time and historical wholesale crop prices 
          across 5 major Indian states sourced directly from data.gov.in.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('playground')}>
            Explore Playground <ArrowRight size={16} />
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('docs')}>
            Read API Docs
          </button>
        </div>
      </div>

      {/* Interactive Live Demo Widget */}
      <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto 4rem auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Interactive Live Demo</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Test live state payloads instantly from your browser
            </p>
          </div>
          <div style={{ width: '220px' }}>
            <RegionSelector selectedState={selectedState} onSelectState={setSelectedState} />
          </div>
        </div>

        {/* Cold-start Warning Notice */}
        {isWakingUp && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#f59e0b',
            fontSize: '0.88rem',
            marginBottom: '1rem',
            animation: 'pulse 2s infinite'
          }}>
            <AlertCircle size={16} />
            <span>Waking up Render backend server (this initial load can take ~30s)...</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <RefreshCw size={24} className="spin" color="var(--accent-emerald)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fetching live prices for {selectedState}...</p>
          </div>
        ) : (
          demoData && <JsonViewer data={demoData} />
        )}
      </div>

      {/* Quick Start Code Section */}
      <div style={{ maxWidth: '900px', margin: '0 auto 4rem auto' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          ⚡ Quick Start Request
        </h3>
        <CodeSnippet path="/v1/prices?state=Maharashtra&commodity=Onion" />
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid-3" style={{ marginBottom: '4rem' }}>
        <div className="glass-card">
          <div style={{ color: 'var(--accent-emerald)', marginBottom: '1rem' }}>
            <Zap size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Authentication</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Zero friction — no API keys, accounts, or headers required. Integrate directly into your app.
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
