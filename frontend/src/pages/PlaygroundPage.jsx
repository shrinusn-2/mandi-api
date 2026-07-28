import React, { useState, useEffect } from 'react';
import { Play, Filter, TrendingUp, RefreshCw } from 'lucide-react';
import CodeSnippet from '../components/CodeSnippet';
import JsonViewer from '../components/JsonViewer';
import PriceChart from '../components/PriceChart';

const STATES = ['Maharashtra', 'Uttar Pradesh', 'Punjab', 'Madhya Pradesh', 'Karnataka'];

export default function PlaygroundPage() {
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [commodity, setCommodity] = useState('Onion');
  const [market, setMarket] = useState('');
  const [endpoint, setEndpoint] = useState('/v1/prices');
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  const buildQueryUrl = () => {
    let url = endpoint;
    const params = new URLSearchParams();
    if (selectedState) params.append('state', selectedState);
    if (commodity) params.append('commodity', commodity);
    if (market) params.append('market', market);

    const str = params.toString();
    return str ? `${url}?${str}` : url;
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponseData(null);
    try {
      const url = buildQueryUrl();
      const res = await fetch(url);
      const data = await res.json();
      setResponseData(data);

      // If fetching prices/history, store graph history data
      if (endpoint === '/v1/prices/history' && data.success) {
        setHistoryData(data.data);
      } else {
        setHistoryData(null);
      }
    } catch (err) {
      setResponseData({
        success: false,
        error: { code: 'CLIENT_FETCH_ERROR', message: err.message }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleExecute();
  }, [endpoint]);

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        API Interactive Playground
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Test endpoints, build dynamic queries, preview JSON responses, and visualize mandi market trends live.
      </p>

      <div className="grid-2" style={{ marginBottom: '2rem', alignItems: 'start' }}>
        {/* Left Column: Controls */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--accent-emerald)" /> Query Parameters
          </h3>

          {/* Endpoint selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              API Endpoint
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className={`btn ${endpoint === '/v1/prices' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                onClick={() => setEndpoint('/v1/prices')}
              >
                /v1/prices
              </button>
              <button 
                className={`btn ${endpoint === '/v1/prices/history' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                onClick={() => setEndpoint('/v1/prices/history')}
              >
                /v1/prices/history
              </button>
            </div>
          </div>

          {/* State selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              State (Required)
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: '#0d121f',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem'
              }}
            >
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Commodity field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              Commodity / Crop (e.g. Onion, Wheat, Potato, Brinjal)
            </label>
            <input
              type="text"
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              placeholder="e.g. Onion"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: '#0d121f',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Market optional filter */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              Specific Market / Mandi (Optional)
            </label>
            <input
              type="text"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              placeholder="e.g. Nagpur APMC"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: '#0d121f',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleExecute}
            disabled={loading}
          >
            {loading ? <RefreshCw size={16} className="spin" /> : <Play size={16} />}
            Execute API Request
          </button>
        </div>

        {/* Right Column: Code Generator & JSON Output */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Generated Request Code
            </h4>
            <CodeSnippet url={buildQueryUrl()} />
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Live API Response
            </h4>
            {responseData ? (
              <JsonViewer data={responseData} />
            ) : (
              <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>Click "Execute API Request" to view output</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History Trend Visualizer */}
      {endpoint === '/v1/prices/history' && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="var(--accent-emerald)" /> Price History Trend Visualizer
          </h3>
          <PriceChart historyData={historyData} commodity={commodity} state={selectedState} />
        </div>
      )}
    </div>
  );
}
