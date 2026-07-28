import React, { useState, useEffect } from 'react';

export default function StatusBadge() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/health');
        if (res.ok) {
          setStatus('online');
        } else {
          setStatus('degraded');
        }
      } catch (err) {
        setStatus('offline');
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-pill">
      <div 
        className="status-dot"
        style={{
          backgroundColor: status === 'online' ? '#10b981' : status === 'degraded' ? '#f59e0b' : '#ef4444',
          boxShadow: `0 0 10px ${status === 'online' ? '#10b981' : status === 'degraded' ? '#f59e0b' : '#ef4444'}`
        }}
      />
      <span style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>
        {status === 'online' ? 'API Online' : status === 'checking' ? 'Connecting...' : status}
      </span>
    </div>
  );
}
