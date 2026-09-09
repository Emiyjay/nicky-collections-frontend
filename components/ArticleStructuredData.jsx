import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '../lib/site';

export default function ArticleStructuredData({ post }) {
  if (!post) return null;
  const url = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  const image = post.coverImage?.url || DEFAULT_OG_IMAGE;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: [image],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: { '@type': 'Organization', name: post.authorName || SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
