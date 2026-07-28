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
  const [activeTab, setActiveTab] = useState('json'); // 'code' | 'json' | 'chart'
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
        setActiveTab('chart');
      } else if (activeTab !== 'code') {
        setHistoryData(null);
        setActiveTab('json');
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
    <div style={{ padding: '1.25rem 0' }}>
      {/* Compact Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>API Interactive Console</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Build requests, inspect JSON payloads, plot price charts, and copy code</p>
        </div>
        <StatusBadge />
      </div>

      {/* Split Console Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left Column: Compact Request Controls */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={16} color="var(--accent-emerald)" /> Request Builder
          </h3>

          {/* Endpoint Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
              Endpoint
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button 
                className={`btn ${endpoint === '/v1/prices' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.45rem 0.6rem', fontSize: '0.8rem' }}
                onClick={() => setEndpoint('/v1/prices')}
              >
                /v1/prices
              </button>
              <button 
                className={`btn ${endpoint === '/v1/prices/history' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.45rem 0.6rem', fontSize: '0.8rem' }}
                onClick={() => setEndpoint('/v1/prices/history')}
              >
                /v1/prices/history
              </button>
            </div>
          </div>

          {/* Step 1: State Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <CustomSelect
              label="Step 1: Select State"
              value={selectedState}
              onChange={setSelectedState}
              options={SUPPORTED_STATES}
              icon={MapPin}
            />
          </div>

          {/* Step 2: Specific Market Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <CustomSelect
              label={`Step 2: Specific Market (${marketsList.length > 0 ? marketsList.length - 1 : 0} active)`}
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
          <div style={{ marginBottom: '1.25rem' }}>
            <CustomSelect
              label={`Step 3: Crop (${commoditiesList.length} available)`}
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
            style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
            onClick={handleExecute}
            disabled={loading}
          >
            {loading ? <RefreshCw size={15} className="spin" /> : <Play size={15} />}
            Execute Request
          </button>
        </div>

        {/* Right Column: High-Density Interactive View Console */}
        <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}>
          {/* Console Header Bar */}
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            background: '#0d121f',
            padding: '0.65rem 1rem',
            borderBottom: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#10b981' }} />
              </div>

              <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Terminal size={14} color="var(--accent-emerald)" /> Output Console
              </span>

              {responseStatus && (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '5px',
                  background: responseStatus === 200 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: responseStatus === 200 ? '#10b981' : '#ef4444',
                  border: `1px solid ${responseStatus === 200 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                }}>
                  HTTP {responseStatus}
                </span>
              )}

              {latency && (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {latency}ms
                </span>
              )}
            </div>

            {/* View Switching Tabs */}
            <div style={{ display: 'flex', gap: '0.3rem', background: 'rgba(0,0,0,0.4)', padding: '0.2rem', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <button
                className={`code-tab ${activeTab === 'json' ? 'active' : ''}`}
                onClick={() => setActiveTab('json')}
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
              >
                Pretty JSON
              </button>
              <button
                className={`code-tab ${activeTab === 'chart' ? 'active' : ''}`}
                onClick={() => setActiveTab('chart')}
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
              >
                Price Chart
              </button>
              <button
                className={`code-tab ${activeTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveTab('code')}
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
              >
                Code Generator
              </button>
            </div>
          </div>

          {/* Console Body Area */}
          <div style={{ padding: '1rem' }}>
            {/* Dynamic Ingestion Timestamp Badge */}
            {latestIngestTime && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '0.85rem'
              }}>
                <Clock size={13} />
                <span>Today's Closing Prices (Ingested: {latestIngestTime} IST)</span>
              </div>
            )}

            {/* Cold-start Warning Notice */}
            {isWakingUp && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.85rem',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#f59e0b',
                fontSize: '0.82rem',
                marginBottom: '0.85rem',
                animation: 'pulse 2s infinite'
              }}>
                <AlertCircle size={15} />
                <span>Waking up backend server (this initial load takes 30-40s)...</span>
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <RefreshCw size={24} className="spin" color="var(--accent-emerald)" style={{ margin: '0 auto 0.75rem auto', display: 'block' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Querying Mandi Price API server...</p>
              </div>
            ) : activeTab === 'json' ? (
              responseData && <JsonViewer data={responseData} />
            ) : activeTab === 'chart' ? (
              <PriceChart historyData={historyData || (responseData?.data || [])} commodity={commodity} state={selectedState} />
            ) : (
              <CodeSnippet path={buildQueryPath()} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
