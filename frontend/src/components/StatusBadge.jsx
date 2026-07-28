import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function StatusBadge() {
  const [status, setStatus] = useState('checking'); // checking | online | sleeping | offline
  const [latency, setLatency] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let timer = null;

    async function checkHealth() {
      const start = Date.now();
      
      // Set 2.5s timer for sleeping state
      timer = setTimeout(() => {
        if (isMounted && status === 'checking') {
          setStatus('sleeping');
        }
      }, 2500);

      try {
        const res = await fetch(`${API_BASE_URL}/health`);
        const duration = Date.now() - start;
        clearTimeout(timer);

        if (res.ok && isMounted) {
          setStatus('online');
          setLatency(duration);
        } else if (isMounted) {
          setStatus('offline');
        }
      } catch (err) {
        clearTimeout(timer);
        if (isMounted) setStatus('offline');
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 30000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const getPillStyle = () => {
    switch (status) {
      case 'online':
        return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', color: '#10b981', dot: '#10b981' };
      case 'sleeping':
        return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b', dot: '#f59e0b' };
      case 'offline':
        return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', dot: '#ef4444' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)', color: '#9ca3af', dot: '#9ca3af' };
    }
  };

  const style = getPillStyle();

  return (
    <div 
      className="status-pill"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color
      }}
    >
      <div className="status-dot" style={{ backgroundColor: style.dot, boxShadow: `0 0 10px ${style.dot}` }} />
      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
        {status === 'online' ? `API Live (${latency}ms)` : 
         status === 'sleeping' ? 'Backend Sleeping (Waking up...)' :
         status === 'checking' ? 'Connecting...' : 'API Offline'}
      </span>
    </div>
  );
}
