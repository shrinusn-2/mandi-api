import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config';

export default function Seo({ title, description, path, structuredData, noindex }) {
  const url = path ? `${SITE_URL}${path}` : SITE_URL;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex" />}
      {structuredData && (
        // JSON.stringify doesn't escape "<", so a value containing
        // "</script>" could break out of this tag — replace it with an
        // equivalent unicode escape that JSON parsers still read correctly.
        <script type="application/ld+json">{JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>
      )}
    </Helmet>
  );
}
