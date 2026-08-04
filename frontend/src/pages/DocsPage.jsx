import React, { useState, useEffect } from 'react';
import CodeSnippet from '../components/CodeSnippet';
import JsonViewer from '../components/JsonViewer';
import AiSpecButton from '../components/AiSpecButton';
import Seo from '../components/Seo';
import { API_BASE_URL } from '../config';
import { ROUTES } from '../routes';

const { title: PAGE_TITLE, description: PAGE_DESCRIPTION } = ROUTES.find((r) => r.path === '/docs');

function MethodBadge({ method }) {
  return (
    <span style={{ background: 'var(--accent-gold)', color: 'var(--bg-dark)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
      {method}
    </span>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const sectionIds = ['overview', 'ai-prompt', 'states', 'commodities', 'markets', 'prices', 'history', 'errors'];
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sidebar-grid" style={{ padding: '1.5rem 0' }}>
      <Seo title={PAGE_TITLE} description={PAGE_DESCRIPTION} path="/docs" />

      {/* Sticky Navigation Sidebar with ScrollSpy */}
      <aside style={{ position: 'sticky', top: '80px', background: 'var(--bg-recessed)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.6rem', paddingLeft: '0.5rem' }}>
          Documentation Nav
        </h4>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {[
            { id: 'overview', label: 'Overview & Base URL' },
            { id: 'ai-prompt', label: '🤖 Build With AI' },
            { id: 'states', label: 'GET /v1/states' },
            { id: 'commodities', label: 'GET /v1/commodities' },
            { id: 'markets', label: 'GET /v1/markets' },
            { id: 'prices', label: 'GET /v1/prices' },
            { id: 'history', label: 'GET /v1/prices/history' },
            { id: 'errors', label: 'Errors & Limits' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              style={{
                textAlign: 'left',
                padding: '0.4rem 0.65rem',
                fontSize: '0.82rem',
                borderRadius: '6px',
                border: 'none',
                background: activeSection === item.id ? 'rgba(216, 155, 60, 0.15)' : 'transparent',
                color: activeSection === item.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                fontWeight: activeSection === item.id ? 600 : 400,
                transition: 'all 0.15s ease',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Documentation Content */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.3rem' }}>
            API Documentation (v1)
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Complete reference for endpoints, query parameters, response envelopes, and rate limits.
          </p>
        </div>

        {/* Overview & Base URL */}
        <section id="overview" className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>
            Base URL & Authentication
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
            All requests are keyless and free to use. Prefix all routes with <code>/v1</code>. Rate limited to 100 requests per 15 minutes per IP address.
          </p>
          <div className="code-box">
            <div className="code-body" style={{ padding: '0.65rem 1rem' }}>
              <code>Base URL: {API_BASE_URL}/v1</code>
            </div>
          </div>
        </section>

        {/* AI Integration Spec Banner */}
        <section id="ai-prompt">
          <AiSpecButton />
        </section>

        {/* GET /v1/states */}
        <section id="states" className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <MethodBadge method="GET" />
            <code style={{ fontSize: '1rem', fontWeight: 600 }}>/v1/states</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
            Returns a list of the 5 supported Indian states for Mandi prices.
          </p>
          <CodeSnippet path="/v1/states" />
        </section>

        {/* GET /v1/commodities */}
        <section id="commodities" className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <MethodBadge method="GET" />
            <code style={{ fontSize: '1rem', fontWeight: 600 }}>/v1/commodities</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
            Returns a list of distinct commodities/crops. Optionally scoped to a specific state or market.
          </p>

          <table style={{ width: '100%', margin: '0.75rem 0', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.4rem 0' }}>Parameter</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.4rem 0', fontFamily: 'var(--font-mono)', color: 'var(--accent-rust)' }}>state</td>
                <td>String</td>
                <td>Optional</td>
                <td>Filter commodities by state name (e.g. Maharashtra)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.4rem 0', fontFamily: 'var(--font-mono)', color: 'var(--accent-rust)' }}>market</td>
                <td>String</td>
                <td>Optional</td>
                <td>Filter commodities by specific APMC market (e.g. Katol APMC)</td>
              </tr>
            </tbody>
          </table>

          <CodeSnippet path="/v1/commodities?state=Maharashtra" />
        </section>

        {/* GET /v1/markets */}
        <section id="markets" className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <MethodBadge method="GET" />
            <code style={{ fontSize: '1rem', fontWeight: 600 }}>/v1/markets</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
            Returns list of all active mandis/markets in a state.
          </p>

          <table style={{ width: '100%', margin: '0.75rem 0', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.4rem 0' }}>Parameter</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.4rem 0', fontFamily: 'var(--font-mono)', color: 'var(--accent-rust)' }}>state</td>
                <td>String</td>
                <td>Yes</td>
                <td>Required state name (e.g. Uttar Pradesh)</td>
              </tr>
            </tbody>
          </table>

          <CodeSnippet path="/v1/markets?state=Uttar Pradesh" />
        </section>

        {/* GET /v1/prices */}
        <section id="prices" className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <MethodBadge method="GET" />
            <code style={{ fontSize: '1rem', fontWeight: 600 }}>/v1/prices</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
            Query daily mandi prices. Requires either <code>state</code> OR <code>commodity</code>.
          </p>
          <CodeSnippet path="/v1/prices?state=Maharashtra&commodity=Onion" />
        </section>

        {/* GET /v1/prices/history */}
        <section id="history" className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <MethodBadge method="GET" />
            <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>/v1/prices/history</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
            Retrieve price history trends over date ranges. If <code>market</code> is omitted, returns average state-wide modal prices per date.
          </p>
          <CodeSnippet path="/v1/prices/history?state=Maharashtra&commodity=Onion" />
        </section>

        {/* Errors & Rate Limits */}
        <section id="errors" className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--status-offline)' }}>
            Errors & Rate Limits
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
            The API uses standard HTTP response codes and a uniform error envelope format.
          </p>
          <JsonViewer data={{
            success: false,
            error: {
              code: "MISSING_PARAM",
              message: "At least one of query parameters 'state' or 'commodity' is required."
            }
          }} />
        </section>
      </main>
    </div>
  );
}
