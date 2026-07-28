import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeSnippet({ url }) {
  const [lang, setLang] = useState('curl');
  const [copied, setCopied] = useState(false);

  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

  const getCode = () => {
    switch (lang) {
      case 'curl':
        return `curl -X GET "${fullUrl}" \\\n  -H "Accept: application/json"`;
      case 'javascript':
        return `fetch("${fullUrl}")\n  .then(res => res.json())\n  .then(data => console.log(data));`;
      case 'python':
        return `import requests\n\nresponse = requests.get("${fullUrl}")\ndata = response.json()\nprint(data)`;
      default:
        return fullUrl;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-box">
      <div className="code-header">
        <div className="code-tabs">
          <button 
            className={`code-tab ${lang === 'curl' ? 'active' : ''}`}
            onClick={() => setLang('curl')}
          >
            cURL
          </button>
          <button 
            className={`code-tab ${lang === 'javascript' ? 'active' : ''}`}
            onClick={() => setLang('javascript')}
          >
            JavaScript
          </button>
          <button 
            className={`code-tab ${lang === 'python' ? 'active' : ''}`}
            onClick={() => setLang('python')}
          >
            Python
          </button>
        </div>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="code-body">
        <code>{getCode()}</code>
      </div>
    </div>
  );
}
