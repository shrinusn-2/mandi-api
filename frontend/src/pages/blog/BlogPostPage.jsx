import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import BlogPostLayout from './BlogPostLayout';
import { BLOG_POSTS } from '../../blogRoutes';
import AgmarknetApiAlternative from './posts/AgmarknetApiAlternative';
import ApmcMandiPriceDataGuide from './posts/ApmcMandiPriceDataGuide';
import DataGovInVsMandiApi from './posts/DataGovInVsMandiApi';

const POST_COMPONENTS = {
  'agmarknet-api-alternative': AgmarknetApiAlternative,
  'apmc-mandi-price-data-guide': ApmcMandiPriceDataGuide,
  'data-gov-in-vs-mandi-api': DataGovInVsMandiApi
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const meta = BLOG_POSTS.find((p) => p.path === `/blog/${slug}`);
  const Content = POST_COMPONENTS[slug];

  if (!meta || !Content) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <BlogPostLayout meta={meta}>
      <Content />
    </BlogPostLayout>
  );
}
