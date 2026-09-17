import { CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL, TIKTOK_URL, INSTAGRAM_URL } from '../lib/site';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function SiteStructuredData() {
  const sameAs = [TIKTOK_URL, INSTAGRAM_URL].map(clean).filter(Boolean);

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        email: `mailto:${CONTACT_EMAIL}`,
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: { '@id': `${SITE_URL}#organization` },
      },
    ],
  };

  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
