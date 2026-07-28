import React, { useState } from 'react';
import CodeSnippet from '../components/CodeSnippet';
import JsonViewer from '../components/JsonViewer';
import { API_BASE_URL } from '../config';

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ padding: '2rem 0', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' }}>
      {/* Sticky Navigation Sidebar */}
      <aside style={{ position: 'sticky', top: '90px', background: '#0d121f', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Documentation Nav
        </h4>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { id: 'overview', label: 'Overview & Base URL' },
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
                padding: '0.45rem 0.75rem',
                fontSize: '0.85rem',
                borderRadius: '6px',
                border: 'none',
                background: activeSection === item.id ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: activeSection === item.id ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                fontWeight: activeSection === item.id ? 600 : 400
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Documentation Content */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            API Documentation (v1)
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Complete reference for endpoints, query parameters, response envelopes, and rate limits.
          </p>
        </div>

        {/* Overview & Base URL */}
        <section id="overview" className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--accent-emerald)' }}>
            Base URL & Authentication
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            All requests are keyless and free to use. Prefix all routes with <code>/v1</code>. Rate limited to 100 requests per 15 minutes per IP address.
          </p>
          <div className="code-box">
            <div className="code-body">
              <code>Base URL: {API_BASE_URL}/v1</code>
            </div>
          </div>
        </section>

        {/* GET /v1/states */}
        <section id="states" className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#10b981', color: '#090d16', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
              GET
            </span>
            <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>/v1/states</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Returns a list of the 5 supported Indian states for Mandi prices.
          </p>
          <CodeSnippet path="/v1/states" />
        </section>

        {/* GET /v1/commodities */}
        <section id="commodities" className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#10b981', color: '#090d16', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
              GET
            </span>
            <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>/v1/commodities</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Returns a list of distinct commodities/crops. Optionally scoped to a specific state.
          </p>

          <table style={{ width: '100%', margin: '1rem 0', fontSize: '0.88rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem 0' }}>Parameter</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.5rem 0', fontFamily: 'var(--font-mono)' }}>state</td>
                <td>String</td>
                <td>Optional</td>
                <td>Filter commodities by state name (e.g. Maharashtra)</td>
              </tr>
            </tbody>
          </table>

          <CodeSnippet path="/v1/commodities?state=Maharashtra" />
        </section>

        {/* GET /v1/markets */}
        <section id="markets" className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#10b981', color: '#090d16', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
              GET
            </span>
            <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>/v1/markets</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Returns list of all active mandis/markets in a state.
          </p>

          <table style={{ width: '100%', margin: '1rem 0', fontSize: '0.88rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.5rem 0' }}>Parameter</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.5rem 0', fontFamily: 'var(--font-mono)' }}>state</td>
                <td>String</td>
                <td>Yes</td>
                <td>Required state name (e.g. Uttar Pradesh)</td>
              </tr>
            </tbody>
          </table>

          <CodeSnippet path="/v1/markets?state=Uttar Pradesh" />
        </section>

        {/* GET /v1/prices */}
        <section id="prices" className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#10b981', color: '#090d16', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
              GET
            </span>
            <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>/v1/prices</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Query latest daily mandi prices. Requires either <code>state</code> OR <code>commodity</code>.
          </p>
          <CodeSnippet path="/v1/prices?state=Maharashtra&commodity=Onion" />
        </section>

        {/* GET /v1/prices/history */}
        <section id="history" className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#10b981', color: '#090d16', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
              GET
            </span>
            <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>/v1/prices/history</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Retrieve price history trends over date ranges. Aggregates average prices across markets if <code>market</code> parameter is omitted.
          </p>
          <CodeSnippet path="/v1/prices/history?state=Maharashtra&commodity=Onion" />
        </section>

        {/* Errors & Rate Limits */}
        <section id="errors" className="glass-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ef4444' }}>
            Errors & Rate Limits
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
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
