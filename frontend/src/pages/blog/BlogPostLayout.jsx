import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Seo from '../../components/Seo';
import { SITE_URL } from '../../config';

export default function BlogPostLayout({ meta, children }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    url: `${SITE_URL}${meta.path}`,
    author: { '@type': 'Organization', name: 'Mandi Price API' },
    publisher: {
      '@type': 'Organization',
      name: 'Mandi Price API',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${meta.path}` }
  };

  return (
    <article style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 0 4rem' }}>
      <Seo title={meta.title} description={meta.description} path={meta.path} structuredData={structuredData} />

      <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        <ArrowLeft size={14} /> Back to Blog
      </Link>

      <h1 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)', lineHeight: 1.2, marginBottom: '0.6rem' }}>
        {meta.title}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
        {new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · Mandi Price API Team
      </p>

      <div className="article-body">
        {children}
      </div>
    </article>
  );
}
