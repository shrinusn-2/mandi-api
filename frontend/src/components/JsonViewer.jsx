import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function JsonViewer({ data }) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-box">
      <div className="code-header">
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Response Body ({data && data.data ? `${Array.isArray(data.data) ? data.data.length : 1} records` : 'JSON'})
        </span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? <Check size={14} color="var(--status-online)" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy JSON'}</span>
        </button>
      </div>
      <div className="code-body" style={{ maxHeight: '420px', overflowY: 'auto' }}>
        <pre style={{ color: '#f0dcae' }}>{jsonString}</pre>
      </div>
    </div>
  );
}
