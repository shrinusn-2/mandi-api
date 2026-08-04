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
        return { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.3)', color: 'var(--status-online)', dot: 'var(--status-online)' };
      case 'sleeping':
        return { bg: 'rgba(232, 196, 104, 0.15)', border: 'rgba(232, 196, 104, 0.4)', color: 'var(--status-warn)', dot: 'var(--status-warn)' };
      case 'offline':
        return { bg: 'rgba(224, 101, 74, 0.1)', border: 'rgba(224, 101, 74, 0.3)', color: 'var(--status-offline)', dot: 'var(--status-offline)' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)', color: '#b8ac97', dot: '#b8ac97' };
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
