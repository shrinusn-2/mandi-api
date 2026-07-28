import React, { useState, useEffect } from 'react';
import { Play, Filter, TrendingUp, RefreshCw, Terminal, AlertCircle } from 'lucide-react';
import CodeSnippet from '../components/CodeSnippet';
import JsonViewer from '../components/JsonViewer';
import PriceChart from '../components/PriceChart';
import RegionSelector from '../components/RegionSelector';
import StatusBadge from '../components/StatusBadge';
import { API_BASE_URL } from '../config';

export default function PlaygroundPage() {
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [commodity, setCommodity] = useState('Onion');
  const [market, setMarket] = useState('');
  const [endpoint, setEndpoint] = useState('/v1/prices');

  // Dynamic dropdown options fetched from backend
  const [commoditiesList, setCommoditiesList] = useState([]);
  const [marketsList, setMarketsList] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Request execution state
  const [loading, setLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [activeViewTab, setActiveViewTab] = useState('json');
  const [responseStatus, setResponseStatus] = useState(null);
  const [latency, setLatency] = useState(null);

  // Fetch commodities and markets dynamically whenever state changes
  useEffect(() => {
    async function fetchStateOptions() {
      setLoadingOptions(true);
      try {
        const [commRes, mktRes] = await Promise.all([
          fetch(`${API_BASE_URL}/v1/commodities?state=${encodeURIComponent(selectedState)}`),
          fetch(`${API_BASE_URL}/v1/markets?state=${encodeURIComponent(selectedState)}`)
        ]);

        const commData = await commRes.json();
        const mktData = await mktRes.json();

        if (commData.success && Array.isArray(commData.data)) {
          setCommoditiesList(commData.data);
          // Auto-select first commodity if current commodity isn't in list
          if (commData.data.length > 0 && !commData.data.includes(commodity)) {
            setCommodity(commData.data[0]);
          }
        } else {
          setCommoditiesList([]);
        }

        if (mktData.success && Array.isArray(mktData.data)) {
          setMarketsList(mktData.data);
        } else {
          setMarketsList([]);
        }
      } catch (err) {
        console.error('Error fetching state commodities/markets:', err);
      } finally {
        setLoadingOptions(false);
      }
    }

    fetchStateOptions();
  }, [selectedState]);

  const buildQueryPath = () => {
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
    setIsWakingUp(false);
    setResponseData(null);
    const start = Date.now();

    const timer = setTimeout(() => {
      setIsWakingUp(true);
    }, 2500);

    try {
      const path = buildQueryPath();
      const res = await fetch(`${API_BASE_URL}${path}`);
      const duration = Date.now() - start;
      clearTimeout(timer);

      setResponseStatus(res.status);
      setLatency(duration);

      const data = await res.json();
      setResponseData(data);

      if (endpoint === '/v1/prices/history' && data.success) {
        setHistoryData(data.data);
        setActiveViewTab('chart');
      } else {
        setHistoryData(null);
        setActiveViewTab('json');
      }
    } catch (err) {
      clearTimeout(timer);
      setResponseStatus(500);
      setResponseData({
        success: false,
        error: { code: 'CLIENT_FETCH_ERROR', message: err.message }
      });
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setIsWakingUp(false);
    }
  };

  useEffect(() => {
    handleExecute();
  }, [endpoint, selectedState, commodity, market]);

  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Console Header Bar */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        background: '#0d121f',
        padding: '0.75rem 1.25rem',
        borderRadius: '12px 12px 0 0',
        border: '1px solid var(--border-subtle)',
        borderBottom: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Terminal size={14} color="var(--accent-emerald)" /> API Console
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {responseStatus && (
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              background: responseStatus === 200 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: responseStatus === 200 ? '#10b981' : '#ef4444',
              border: `1px solid ${responseStatus === 200 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              HTTP {responseStatus}
            </span>
          )}
          {latency && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {latency}ms
            </span>
          )}
          <StatusBadge />
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '2rem', alignItems: 'start' }}>
        {/* Left Column: Selectable Query Request Controls */}
        <div className="glass-card" style={{ borderRadius: '0 0 16px 16px', borderTop: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} color="var(--accent-emerald)" /> Request Builder
          </h3>

          {/* Endpoint selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              Endpoint
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
            <RegionSelector selectedState={selectedState} onSelectState={setSelectedState} />
          </div>

          {/* Selectable Commodity Dropdown */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              <span>Commodity / Crop ({commoditiesList.length} available)</span>
              {loadingOptions && <RefreshCw size={12} className="spin" color="var(--accent-emerald)" />}
            </label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              disabled={loadingOptions || commoditiesList.length === 0}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: '#0d121f',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {commoditiesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              {commoditiesList.length === 0 && <option value="">No crops available</option>}
            </select>
          </div>

          {/* Selectable Market Dropdown */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
              <span>Specific Market / Mandi ({marketsList.length} active)</span>
              {loadingOptions && <RefreshCw size={12} className="spin" color="var(--accent-emerald)" />}
            </label>
            <select
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              disabled={loadingOptions}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: '#0d121f',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: '#fff',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="">All Markets (State Aggregate)</option>
              {marketsList.map(m => (
                <option key={m.market} value={m.market}>
                  {m.market} ({m.district})
                </option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleExecute}
            disabled={loading}
          >
            {loading ? <RefreshCw size={16} className="spin" /> : <Play size={16} />}
            Execute Request
          </button>
        </div>

        {/* Right Column: Code Generator & Dual Visualizer */}
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Integration Code Generator
            </h4>
            <CodeSnippet path={buildQueryPath()} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Response Payload
              </h4>

              {/* View Toggle Tabs */}
              <div style={{ display: 'flex', gap: '0.3rem', background: '#0d121f', padding: '0.2rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <button
                  className={`code-tab ${activeViewTab === 'json' ? 'active' : ''}`}
                  onClick={() => setActiveViewTab('json')}
                  style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
                >
                  Pretty JSON
                </button>
                <button
                  className={`code-tab ${activeViewTab === 'chart' ? 'active' : ''}`}
                  onClick={() => setActiveViewTab('chart')}
                  style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
                >
                  Price Chart
                </button>
              </div>
            </div>

            {/* Cold-start Warning Notice */}
            {isWakingUp && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#f59e0b',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                animation: 'pulse 2s infinite'
              }}>
                <AlertCircle size={16} />
                <span>Waking up backend server (this initial load takes 30-40s)...</span>
              </div>
            )}

            {loading ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <RefreshCw size={24} className="spin" color="var(--accent-emerald)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Querying Mandi Price API server...</p>
              </div>
            ) : activeViewTab === 'json' ? (
              responseData && <JsonViewer data={responseData} />
            ) : (
              <PriceChart historyData={historyData || (responseData?.data || [])} commodity={commodity} state={selectedState} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
