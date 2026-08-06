import React from 'react';
import { Link } from 'react-router-dom';
import CodeSnippet from '../../../components/CodeSnippet';

export default function ApmcMandiPriceDataGuide() {
  return (
    <>
      <p>
        "Mandi price data" and "APMC data" get used interchangeably, but if you're building something with it —
        a dashboard, a farmer advisory tool, a research project — it helps to know exactly what's in the data and
        how it's structured before you start writing queries.
      </p>

      <h2>What is an APMC mandi?</h2>
      <p>
        An <strong>APMC</strong> (Agricultural Produce Market Committee) mandi is a regulated wholesale market where
        farmers sell crops to traders/buyers under state oversight, originally set up so farmers wouldn't be at the
        mercy of unregulated middlemen. Each state runs its own network of these markets — Maharashtra alone has
        hundreds. Prices are recorded per market, per commodity, per day.
      </p>

      <h2>How the price data is structured</h2>
      <p>Each daily record is effectively a row of:</p>
      <ul>
        <li><strong>State</strong> and <strong>Market</strong> (the specific mandi, e.g. "Pune" or "Nagpur")</li>
        <li><strong>Commodity</strong> and often a <strong>variety</strong> (e.g. Onion — "Local" vs "Nasik Red")</li>
        <li><strong>Min price, Max price, and Modal price</strong> — the modal price (most frequently traded price
          that day) is usually what people mean by "the price"</li>
        <li><strong>Arrival date</strong> — the date the produce arrived at the mandi, not always the same as when
          it was recorded</li>
      </ul>

      <h2>Where the data comes from</h2>
      <p>
        The authoritative source is the Ministry of Agriculture &amp; Farmers Welfare's{' '}
        <a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer">Agmarknet</a> portal, which is
        also mirrored on{' '}
        <a href="https://www.data.gov.in/catalog/current-daily-price-various-commodities-various-markets-mandi" target="_blank" rel="noopener noreferrer">
          data.gov.in
        </a>. Agmarknet covers over 3,000 regulated markets nationwide across 200+ commodities. Academic platforms
        like <a href="https://agmarknet.ceda.ashoka.edu.in/" target="_blank" rel="noopener noreferrer">CEDA Agri Market Data</a> also
        republish it in analysis-friendly form.
      </p>

      <h2>Querying it programmatically</h2>
      <p>
        Going straight to source means registering for a data.gov.in API key and handling the raw field format.
        For a quicker path — currently scoped to Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh, and Karnataka —{' '}
        <Link to="/">Mandi Price API</Link> gives you the same underlying data as clean, keyless JSON:
      </p>

      <CodeSnippet path="/v1/prices/history?state=Punjab&commodity=Wheat&market=Ludhiana" />

      <h2>Common use cases</h2>
      <ul>
        <li><strong>Price trend dashboards</strong> — charting modal price over time per commodity/market</li>
        <li><strong>Farmer advisory tools</strong> — surfacing the best current market/day to sell a given crop</li>
        <li><strong>Market research &amp; trading</strong> — spotting price divergence between mandis for arbitrage or procurement planning</li>
        <li><strong>Academic &amp; policy research</strong> — studying price volatility, MSP effectiveness, or regional supply patterns</li>
      </ul>

      <p>
        For the specific pain points of the official API (registration, inconsistent fields, pagination) and how a
        keyless alternative sidesteps them, see{' '}
        <Link to="/blog/agmarknet-api-alternative">Agmarknet API Alternative</Link>. For a direct side-by-side with
        real requests, see{' '}
        <Link to="/blog/data-gov-in-vs-mandi-api">data.gov.in vs. a Simpler Alternative</Link>.
      </p>
      <p>
        Full endpoint reference: <Link to="/docs">docs</Link>. Try it live: <Link to="/playground">playground</Link>.
      </p>
    </>
  );
}
