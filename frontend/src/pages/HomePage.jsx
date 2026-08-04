import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import CodeSnippet from '../components/CodeSnippet';
import RegionSelector from '../components/RegionSelector';
import AiSpecButton from '../components/AiSpecButton';
import Seo from '../components/Seo';
import { API_BASE_URL, SITE_URL } from '../config';
import { ROUTES } from '../routes';
import { formatIngestionTime } from '../utils';

const { title: PAGE_TITLE, description: PAGE_DESCRIPTION } = ROUTES.find((r) => r.path === '/');

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Mandi Price API',
      url: SITE_URL,
      description: PAGE_DESCRIPTION
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Mandi Price API',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      description: PAGE_DESCRIPTION,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      featureList: [
        'Daily Indian mandi wholesale crop prices',
        'No API key or authentication required',
        'Coverage across 5 Indian states',
        'Historical price trend data'
      ]
    }
  ]
};

export default function HomePage() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [demoData, setDemoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);

  const fetchDemo = async (stateName) => {
    setLoading(true);
    setIsWakingUp(false);
    
    const timer = setTimeout(() => {
      setIsWakingUp(true);
    }, 2500);

    try {
      const res = await fetch(`${API_BASE_URL}/v1/prices?state=${encodeURIComponent(stateName)}`);
      clearTimeout(timer);
      const data = await res.json();
      setDemoData(data);
    } catch (err) {
      clearTimeout(timer);
      setDemoData({
        success: false,
        error: { code: 'DEMO_FETCH_ERROR', message: 'Could not connect to API server.' }
      });
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setIsWakingUp(false);
    }
  };

  useEffect(() => {
    fetchDemo(selectedState);
  }, [selectedState]);

  const latestIngestTime = demoData?.meta?.latest_fetched_at ? formatIngestionTime(demoData.meta.latest_fetched_at) : null;
  const boardRows = demoData?.success ? demoData.data.slice(0, 6) : [];
  const recordCount = demoData?.success ? demoData.meta?.count ?? demoData.data.length : null;

  return (
    <div style={{ padding: '3rem 0' }}>
      <Seo title={PAGE_TITLE} description={PAGE_DESCRIPTION} path="/" structuredData={STRUCTURED_DATA} />

      {/* Hero: a live mandi rate board, not a marketing tagline */}
      <div style={{ maxWidth: '820px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
        <div className="eyebrow" style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', marginBottom: '1rem' }}>
          Today's Mandi Rates, Straight From an API Call
        </div>
        <h1 style={{ fontSize: 'clamp(1.9rem, 4vw + 1rem, 3rem)', lineHeight: 1.15, marginBottom: '1rem' }}>
          A Free API for Daily Indian Mandi Prices
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
          Keyless REST access to wholesale crop prices from 5 Indian states, pulled daily from data.gov.in.
          What's below is real — fetched live from this API, not a mockup.
        </p>
      </div>

      {/* Live Rate Board */}
      <div className="rate-board" style={{ maxWidth: '820px', margin: '0 auto 2rem auto' }}>
        <div className="rate-board-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="status-dot" style={{ width: 7, height: 7 }} />
            <span className="eyebrow" style={{ fontSize: '0.78rem' }}>Live Rate Board</span>
          </div>
          <div className="region-selector-wrap">
            <RegionSelector selectedState={selectedState} onSelectState={setSelectedState} />
          </div>
        </div>

        {isWakingUp && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1.25rem',
            color: 'var(--status-warn)',
            fontSize: '0.85rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <AlertCircle size={15} />
            <span>Waking up the backend server (first load can take ~30s)...</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <RefreshCw size={22} className="spin" color="var(--accent-gold)" style={{ margin: '0 auto 0.75rem auto', display: 'block' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Reading today's rates for {selectedState}...</p>
          </div>
        ) : boardRows.length > 0 ? (
          boardRows.map((row) => (
            <div className="rate-board-row" key={row.id}>
              <div style={{ minWidth: 0 }}>
                <div className="rate-board-commodity">{row.commodity}</div>
                <div className="rate-board-market">{row.market}, {row.district}</div>
              </div>
              <div className="rate-board-price">
                {row.modal_price != null ? `₹${Number(row.modal_price).toLocaleString('en-IN')}/qtl` : 'N/A'}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            No rates available for {selectedState} right now.
          </div>
        )}

        {latestIngestTime && (
          <div style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Clock size={12} />
            <span>Ingested {latestIngestTime} IST{recordCount != null ? ` · ${recordCount} records returned for ${selectedState}` : ''}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <button className="btn btn-primary" onClick={() => navigate('/playground')}>
          Explore Playground <ArrowRight size={16} />
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/docs')}>
          Read API Docs
        </button>
      </div>

      {/* AI Spec Banner */}
      <div style={{ maxWidth: '900px', margin: '0 auto 3rem auto' }}>
        <AiSpecButton />
      </div>

      {/* Quick Start Code Section */}
      <div style={{ maxWidth: '900px', margin: '0 auto 4rem auto' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Quick Start Request
        </h3>
        <CodeSnippet path="/v1/prices?state=Maharashtra&commodity=Onion" />
      </div>

      {/* Coverage, in numbers rather than icon cards */}
      <div className="grid-3" style={{ marginBottom: '4rem' }}>
        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div className="stat-tile-value">{recordCount ?? '—'}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.4rem' }}>
            latest price records returned for {selectedState}
          </p>
        </div>

        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div className="stat-tile-value">5</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.4rem' }}>
            Indian states covered: Maharashtra, UP, Punjab, MP, Karnataka
          </p>
        </div>

        <div className="glass-card" style={{ textAlign: 'center' }}>
          <div className="stat-tile-value">0</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.4rem' }}>
            API keys required — synced daily from data.gov.in
          </p>
        </div>
      </div>

      {/* Supported States Pill List */}
      <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Supported States in v1</h4>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Maharashtra', 'Uttar Pradesh', 'Punjab', 'Madhya Pradesh', 'Karnataka'].map(st => (
            <span key={st} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <CheckCircle2 size={14} color="var(--accent-gold)" /> {st}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
