import React from 'react';
import CodeSnippet from '../components/CodeSnippet';

export default function DocsPage() {
  return (
    <div style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        API Documentation (v1)
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Complete reference for endpoints, query parameters, response envelopes, and rate limits.
      </p>

      {/* Overview & Base URL */}
      <section className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--accent-emerald)' }}>
          Base URL & Authentication
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          All requests are keyless and free to use. Prefix all routes with <code>/v1</code>. Rate limited to 100 requests per 15 minutes per IP address.
        </p>
        <div className="code-box">
          <div className="code-body">
            <code>Base URL: https://your-backend.render.com/v1</code>
          </div>
        </div>
      </section>

      {/* Endpoints List */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* GET /v1/states */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#10b981', color: '#090d16', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
              GET
            </span>
            <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>/v1/states</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            List all 5 supported Indian states for Mandi prices.
          </p>
          <CodeSnippet url="/v1/states" />
        </div>

        {/* GET /v1/commodities */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#10b981', color: '#090d16', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
              GET
            </span>
            <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>/v1/commodities</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            List distinct commodities. Optionally filter by <code>state</code>.
          </p>
          <CodeSnippet url="/v1/commodities?state=Maharashtra" />
        </div>

        {/* GET /v1/markets */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#10b981', color: '#090d16', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
              GET
            </span>
            <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>/v1/markets</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            List all active mandis/markets for a required state.
          </p>
          <CodeSnippet url="/v1/markets?state=Uttar Pradesh" />
        </div>

        {/* GET /v1/prices */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#10b981', color: '#090d16', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
              GET
            </span>
            <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>/v1/prices</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Query daily mandi prices. Requires either <code>state</code> OR <code>commodity</code>.
          </p>
          <CodeSnippet url="/v1/prices?state=Maharashtra&commodity=Onion" />
        </div>

        {/* GET /v1/prices/history */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ background: '#10b981', color: '#090d16', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
              GET
            </span>
            <code style={{ fontSize: '1.1rem', fontWeight: 600 }}>/v1/prices/history</code>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Retrieve price history over date ranges. If <code>market</code> is omitted, returns average state-wide modal prices per date.
          </p>
          <CodeSnippet url="/v1/prices/history?state=Maharashtra&commodity=Onion" />
        </div>
      </section>
    </div>
  );
}
