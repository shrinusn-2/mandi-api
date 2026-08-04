import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 0' }}>
      <Seo title="Page Not Found | Mandi Price API" description="The page you're looking for doesn't exist." noindex />
      <div className="eyebrow" style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        404
      </div>
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '1rem' }}>
        This mandi has no listing here
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
        Back to Overview
      </Link>
    </div>
  );
}
