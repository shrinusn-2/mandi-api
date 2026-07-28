import React, { useState, useEffect } from 'react';
import { Play, Filter, RefreshCw, Terminal, AlertCircle, MapPin, Sprout, Store, Clock, Code, Layers } from 'lucide-react';
import CodeSnippet from '../components/CodeSnippet';
import JsonViewer from '../components/JsonViewer';
import PriceChart from '../components/PriceChart';
import CustomSelect from '../components/CustomSelect';
import StatusBadge from '../components/StatusBadge';
import { API_BASE_URL, SUPPORTED_STATES } from '../config';

export default function PlaygroundPage() {
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [market, setMarket] = useState('');
  const [commodity, setCommodity] = useState('Onion');
  const [endpoint, setEndpoint] = useState('/v1/prices');

  // Dynamic dropdown options fetched from backend
  const [marketsList, setMarketsList] = useState([]);
  const [commoditiesList, setCommoditiesList] = useState([]);
  const [loadingMarkets, setLoadingMarkets] = useState(false);
  const [loadingCommodities, setLoadingCommodities] = useState(false);

  // Request execution state
  const [loading, setLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [activeViewTab, setActiveViewTab] = useState('json');
  const [responseStatus, setResponseStatus] = useState(null);
  const [latency, setLatency] = useState(null);

  // Step 1: Fetch markets whenever state changes
  useEffect(() => {
    async function fetchMarkets() {
      setLoadingMarkets(true);
      try {
        const res = await fetch(`${API_BASE_URL}/v1/markets?state=${encodeURIComponent(selectedState)}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const formatted = [
            { label: 'All Markets (State Aggregate)', value: '' },
            ...data.data.map(m => ({
              label: m.market,
              value: m.market,
              sublabel: m.district ? `District: ${m.district}` : null
            }))
          ];
          setMarketsList(formatted);
          setMarket('');
        } else {
          setMarketsList([{ label: 'All Markets (State Aggregate)', value: '' }]);
        }
      } catch (err) {
        console.error('Error fetching markets:', err);
      } finally {
        setLoadingMarkets(false);
      }
    }

    fetchMarkets();
  }, [selectedState]);

  // Step 2: Fetch commodities whenever state or market changes
  useEffect(() => {
    async function fetchCommodities() {
      setLoadingCommodities(true);
      try {
        let url = `${API_BASE_URL}/v1/commodities?state=${encodeURIComponent(selectedState)}`;
        if (market) {
          url += `&market=${encodeURIComponent(market)}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setCommoditiesList(data.data);
          if (data.data.length > 0 && !data.data.includes(commodity)) {
            setCommodity(data.data[0]);
          }
        } else {
          setCommoditiesList([]);
        }
      } catch (err) {
        console.error('Error fetching commodities:', err);
      } finally {
        setLoadingCommodities(false);
      }
    }

    fetchCommodities();
  }, [selectedState, market]);

  const buildQueryPath = () => {
    let url = endpoint;
    const params = new URLSearchParams();
    if (selectedState) params.append('state', selectedState);
    if (market) params.append('market', market);
    if (commodity) params.append('commodity', commodity);

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
  }, [endpoint, selectedState, market, commodity]);

  const formatIngestionTime = (isoString) => {
    if (!isoString) return null;
    try {
      return new Date(isoString).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return null;
    }
  };

  const latestIngestTime = responseData?.meta?.latest_fetched_at ? formatIngestionTime(responseData.meta.latest_fetched_at) : null;

  return (
    <div style={{ padding: '2rem 0' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>API Interactive Console</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Build queries, generate code snippets, inspect live JSON, and plot price charts</p>
        </div>
        <StatusBadge />
      </div>

      {/* Top 2-Column Section: Request Controls + Code Snippet */}
      <div className="grid-2" style={{ marginBottom: '2rem', alignItems: 'stretch' }}>
        {/* Left Column: Request Builder */}
        <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                style={{ flex: 1, padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                onClick={() => setEndpoint('/v1/prices')}
              >
                /v1/prices
              </button>
              <button 
                className={`btn ${endpoint === '/v1/prices/history' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.55rem 0.75rem', fontSize: '0.85rem' }}
                onClick={() => setEndpoint('/v1/prices/history')}
              >
                /v1/prices/history
              </button>
            </div>
          </div>

          {/* Step 1: State Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <CustomSelect
              label="Step 1: Select State"
              value={selectedState}
              onChange={setSelectedState}
              options={SUPPORTED_STATES}
              icon={MapPin}
            />
          </div>

          {/* Step 2: Specific Market Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <CustomSelect
              label={`Step 2: Specific Market / Mandi (${marketsList.length > 0 ? marketsList.length - 1 : 0} active)`}
              value={market}
              onChange={setMarket}
              options={marketsList}
              placeholder="All Markets (State Aggregate)"
              loading={loadingMarkets}
              disabled={loadingMarkets}
              icon={Store}
            />
          </div>

          {/* Step 3: Commodity Selector */}
          <div style={{ marginBottom: '1.5rem', flex: 1 }}>
            <CustomSelect
              label={`Step 3: Commodity / Crop (${commoditiesList.length} available)`}
              value={commodity}
              onChange={setCommodity}
              options={commoditiesList}
              placeholder="Select crop..."
              loading={loadingCommodities}
              disabled={loadingCommodities || commoditiesList.length === 0}
              icon={Sprout}
            />
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
            onClick={handleExecute}
            disabled={loading}
          >
            {loading ? <RefreshCw size={16} className="spin" /> : <Play size={16} />}
            Execute Request
          </button>
        </div>

        {/* Right Column: Code Snippet Generator */}
        <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={18} color="var(--accent-cyan)" /> Integration Code Generator
          </h3>

          <div style={{ flex: 1 }}>
            <CodeSnippet path={buildQueryPath()} />
          </div>
        </div>
      </div>

      {/* Full-Width Bottom Section: Response Payload & Visualizer Console */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
        {/* Console Header Bar */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          background: '#0d121f',
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
            </div>

            <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="var(--accent-emerald)" /> Response Payload
            </span>

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
          </div>

          {/* View Toggle Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.4)', padding: '0.3rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              className={`code-tab ${activeViewTab === 'json' ? 'active' : ''}`}
              onClick={() => setActiveViewTab('json')}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}
            >
              Pretty JSON
            </button>
            <button
              className={`code-tab ${activeViewTab === 'chart' ? 'active' : ''}`}
              onClick={() => setActiveViewTab('chart')}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}
            >
              Price Chart Visualizer
            </button>
          </div>
        </div>

        {/* Console Body Padding */}
        <div style={{ padding: '1.5rem' }}>
          {/* Dynamic Ingestion Timestamp Badge */}
          {latestIngestTime && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.25rem'
            }}>
              <Clock size={14} />
              <span>Today's Closing Prices (Ingested: {latestIngestTime} IST)</span>
            </div>
          )}

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
              fontSize: '0.88rem',
              marginBottom: '1.25rem',
              animation: 'pulse 2s infinite'
            }}>
              <AlertCircle size={16} />
              <span>Waking up backend server (this initial load takes 30-40s)...</span>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <RefreshCw size={28} className="spin" color="var(--accent-emerald)" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Querying Mandi Price API server...</p>
            </div>
          ) : activeViewTab === 'json' ? (
            responseData && <JsonViewer data={responseData} />
          ) : (
            <PriceChart historyData={historyData || (responseData?.data || [])} commodity={commodity} state={selectedState} />
          )}
        </div>
      </div>
    </div>
  );
}
