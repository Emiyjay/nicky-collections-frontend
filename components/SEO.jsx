import Head from 'next/head';
import { SITE_CONFIG } from '../lib/siteConfig';

export default function SEO({
  title,
  description = SITE_CONFIG.description,
  canonical,
  image,
  type = 'website',
  noindex = false,
}) {
  const pageTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.name;
  const canonicalUrl = canonical || SITE_CONFIG.url;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}
