import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, TIKTOK_URL, INSTAGRAM_URL } from '../lib/site';
import { StructuredData } from './StructuredData';

export default function SiteStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    sameAs: [TIKTOK_URL, INSTAGRAM_URL].filter(Boolean),
  };

  return <StructuredData data={data} />;
}
