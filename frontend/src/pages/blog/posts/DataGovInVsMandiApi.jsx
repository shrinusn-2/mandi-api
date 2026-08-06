import React from 'react';
import { Link } from 'react-router-dom';
import CodeSnippet from '../../../components/CodeSnippet';

const tableCell = { padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'top' };

export default function DataGovInVsMandiApi() {
  return (
    <>
      <p>
        There are two practical ways to get Indian mandi wholesale price data into your app right now: the official{' '}
        <a href="https://www.data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi" target="_blank" rel="noopener noreferrer">
          data.gov.in
        </a>{' '}
        OGD API, or a keyless wrapper like <Link to="/">Mandi Price API</Link>. Here's what each actually looks like
        to integrate.
      </p>

      <h2>Option 1: data.gov.in's official API</h2>
      <p>Steps before your first request:</p>
      <ul>
        <li>Create a free account at data.gov.in</li>
        <li>Generate an API key from your account dashboard</li>
        <li>Find the correct resource ID for the mandi price dataset</li>
        <li>Pass the key and resource ID as query params, and handle pagination (<code>limit</code>/<code>offset</code>) yourself for anything beyond the default page size</li>
      </ul>
      <p>
        A request typically looks like <code>https://api.data.gov.in/resource/&lt;resource-id&gt;?api-key=&lt;your-key&gt;&format=json&limit=100</code>,
        and the response field names are the raw government schema (not always intuitive — e.g. commodity is sometimes
        under a different key than variety).
      </p>

      <h2>Option 2: Mandi Price API (keyless)</h2>
      <p>No account, no key, no resource ID lookup — for the 5 supported states:</p>
      <CodeSnippet path="/v1/prices?state=Karnataka&commodity=Tomato" />

      <h2>Side by side</h2>
      <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
          <thead>
            <tr>
              <th style={{ ...tableCell, color: 'var(--text-primary)', textAlign: 'left' }}>&nbsp;</th>
              <th style={{ ...tableCell, color: 'var(--text-primary)', textAlign: 'left' }}>data.gov.in</th>
              <th style={{ ...tableCell, color: 'var(--text-primary)', textAlign: 'left' }}>Mandi Price API</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableCell}><strong>Auth</strong></td>
              <td style={tableCell}>API key required (free signup)</td>
              <td style={tableCell}>None — fully keyless</td>
            </tr>
            <tr>
              <td style={tableCell}><strong>State coverage</strong></td>
              <td style={tableCell}>Nationwide, 3,000+ markets</td>
              <td style={tableCell}>Maharashtra, UP, Punjab, MP, Karnataka</td>
            </tr>
            <tr>
              <td style={tableCell}><strong>Field naming</strong></td>
              <td style={tableCell}>Raw government schema</td>
              <td style={tableCell}>Normalized JSON envelope</td>
            </tr>
            <tr>
              <td style={tableCell}><strong>History endpoint</strong></td>
              <td style={tableCell}>Manual multi-request stitching</td>
              <td style={tableCell}>Built-in <code>/v1/prices/history</code></td>
            </tr>
            <tr>
              <td style={tableCell}><strong>Rate limit</strong></td>
              <td style={tableCell}>Varies by key tier</td>
              <td style={tableCell}>100 req / 15 min per IP</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Which one should you use?</h2>
      <p>
        Building something nationwide, or need a commodity/state outside the five listed above? Go straight to
        data.gov.in/Agmarknet — it's the authoritative source and nothing beats its coverage. Prototyping, building
        a demo, or your use case is scoped to those five states? Mandi Price API gets you a working integration
        without the signup step.
      </p>

      <p>
        See the full breakdown of what mandi/APMC data actually contains in{' '}
        <Link to="/blog/apmc-mandi-price-data-guide">APMC Mandi Price Data: A Developer's Guide</Link>, or jump
        straight to the <Link to="/docs">docs</Link> and <Link to="/playground">playground</Link>.
      </p>
    </>
  );
}
