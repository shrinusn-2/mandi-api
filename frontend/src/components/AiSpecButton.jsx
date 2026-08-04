import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download } from 'lucide-react';
import { MANDI_API_LLM_SPEC } from '../data/aiSpec';

export default function AiSpecButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MANDI_API_LLM_SPEC);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([MANDI_API_LLM_SPEC], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MANDI-API-SPEC.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      background: 'rgba(216, 155, 60, 0.08)',
      border: '1px solid rgba(216, 155, 60, 0.3)',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      justify: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      margin: '1.5rem 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'rgba(216, 155, 60, 0.2)',
          padding: '0.6rem',
          borderRadius: '10px',
          color: 'var(--accent-gold)',
          display: 'flex'
        }}>
          <Sparkles size={20} />
        </div>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
            Build With AI (ChatGPT, Claude, Gemini)
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Feed this complete API Markdown Spec to any AI coding assistant to generate integration code instantly.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <button
          className="btn btn-primary"
          onClick={handleCopy}
          style={{ fontSize: '0.88rem', padding: '0.55rem 1rem' }}
        >
          {copied ? <Check size={16} color="#ffffff" /> : <Copy size={16} />}
          <span>{copied ? 'Spec Copied!' : 'Copy Spec for AI'}</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleDownload}
          style={{ fontSize: '0.88rem', padding: '0.55rem 1rem' }}
          title="Download MANDI-API-SPEC.md file"
        >
          <Download size={16} />
          <span>Download .md</span>
        </button>
      </div>
    </div>
  );
}
