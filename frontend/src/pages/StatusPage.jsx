import React, { useState, useEffect } from 'react';
import { Server, Database, CheckCircle2, AlertTriangle, RefreshCw, Zap, ShieldCheck, Activity } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { API_BASE_URL } from '../config';

export default function StatusPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState(null);

  const checkStatus = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      const duration = Date.now() - start;
      const data = await res.json();
      setHealth(data);
      setLatency(duration);
    } catch (err) {
      setHealth({ status: 'offline', error: err.message });
      setLatency(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div style={{ padding: '2rem 0', maxWidth: '950px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Service Health & Status</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Live latency, data pipelines, and infrastructure specs for Mandi Price API</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <StatusBadge />
          <button className="btn btn-secondary" onClick={checkStatus} disabled={loading}>
            {loading ? <RefreshCw size={14} className="spin" /> : <RefreshCw size={14} />} Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <div style={{ color: 'var(--accent-emerald)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={22} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>RESPONSE LATENCY</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            {latency ? `${latency} ms` : '—'}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.4rem' }}>
            Live browser roundtrip ping
          </p>
        </div>

        <div className="glass-card">
          <div style={{ color: 'var(--accent-cyan)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={22} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>RATE LIMIT THRESHOLD</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            100 req / 15m
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.4rem' }}>
            Per IP rate limit protection
          </p>
        </div>

        <div className="glass-card">
          <div style={{ color: 'var(--accent-amber)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>UPTIME TARGET</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            99.9 %
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.4rem' }}>
            Automated health monitoring
          </p>
        </div>
      </div>

      {/* Operational Details Table */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Infrastructure Operational Specifications
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 600 }}>API Version</td>
              <td style={{ padding: '0.75rem 0', color: '#fff', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>v1.0.0</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 600 }}>Data Source Portal</td>
              <td style={{ padding: '0.75rem 0', color: '#fff', textAlign: 'right' }}>data.gov.in (Ministry of Agriculture)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 600 }}>Daily Ingestion Pipeline</td>
              <td style={{ padding: '0.75rem 0', color: '#10b981', textAlign: 'right', fontWeight: 600 }}>Scheduled GitHub Actions (15:00 UTC)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 600 }}>Database Storage</td>
              <td style={{ padding: '0.75rem 0', color: '#fff', textAlign: 'right' }}>Supabase Postgres DB (3,483 records)</td>
            </tr>
            <tr>
              <td style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 600 }}>State Coverage</td>
              <td style={{ padding: '0.75rem 0', color: '#fff', textAlign: 'right' }}>Maharashtra, UP, Punjab, MP, Karnataka</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
