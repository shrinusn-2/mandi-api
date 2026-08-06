import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Seo from '../../components/Seo';
import { BLOG_INDEX_ROUTE, BLOG_POSTS } from '../../blogRoutes';

export default function BlogIndexPage() {
  return (
    <div style={{ padding: '2rem 0', maxWidth: '850px', margin: '0 auto' }}>
      <Seo title={BLOG_INDEX_ROUTE.title} description={BLOG_INDEX_ROUTE.description} path={BLOG_INDEX_ROUTE.path} />

      <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', marginBottom: '0.6rem' }}>Blog</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
        Guides on Indian mandi/APMC price data, Agmarknet, and data.gov.in — for developers building with agricultural market data.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {BLOG_POSTS.map((post) => (
          <Link key={post.path} to={post.path} className="glass-card" style={{ display: 'block', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {post.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '0.75rem' }}>
              {post.description}
            </p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
              Read more <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
