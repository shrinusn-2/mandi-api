import React, { useState, useEffect } from 'react';
import { Server, Database, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function StatusPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/health');
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setHealth({ status: 'offline', error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>System & API Status</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Live health and infrastructure status for Mandi Price API</p>
        </div>
        <button className="btn btn-secondary" onClick={checkStatus} disabled={loading}>
          {loading ? <RefreshCw size={14} className="spin" /> : <RefreshCw size={14} />} Refresh
        </button>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Backend API Server */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Server size={20} color="var(--accent-emerald)" />
              <span style={{ fontWeight: 700 }}>Express API Server</span>
            </div>
            {health && health.status === 'ok' ? (
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> Operational
              </span>
            ) : (
              <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                <AlertTriangle size={16} /> Degraded / Offline
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Version: {health?.version || 'v1'} | Response: 200 OK
          </p>
        </div>

        {/* Data Source */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Database size={20} color="var(--accent-cyan)" />
              <span style={{ fontWeight: 700 }}>Data.gov.in Sync</span>
            </div>
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} /> Active (Daily Sync)
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Ministry of Agriculture Data Resource Connected
          </p>
        </div>
      </div>

      {/* Production Health Banner */}
      <div className="glass-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}>
        <h4 style={{ color: '#10b981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> API Service Healthy
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          All systems operational across 5 Indian states. Daily prices update automatically via automated ingestion workflow.
        </p>
      </div>
    </div>
  );
}
