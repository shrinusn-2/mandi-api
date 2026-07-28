import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function CodeSnippet({ path }) {
  const [lang, setLang] = useState('curl');
  const [copied, setCopied] = useState(false);

  const fullUrl = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const getCode = () => {
    switch (lang) {
      case 'curl':
        return `curl -X GET "${fullUrl}" \\\n  -H "Accept: application/json"`;
      case 'javascript':
        return `fetch("${fullUrl}")\n  .then(res => res.json())\n  .then(data => console.log(data));`;
      case 'python':
        return `import requests\n\nresponse = requests.get("${fullUrl}")\ndata = response.json()\nprint(data)`;
      case 'go':
        return `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\tres, err := http.Get("${fullUrl}")\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer res.Body.Close()\n\tbody, _ := io.ReadAll(res.Body)\n\tfmt.Println(string(body))\n}`;
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
          {['curl', 'javascript', 'python', 'go'].map((l) => (
            <button 
              key={l}
              className={`code-tab ${lang === l ? 'active' : ''}`}
              onClick={() => setLang(l)}
            >
              {l === 'curl' ? 'cURL' : l === 'javascript' ? 'JavaScript' : l === 'python' ? 'Python' : 'Go'}
            </button>
          ))}
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
