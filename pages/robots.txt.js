import { SITE_URL } from '../lib/seo';

export async function getServerSideProps({ res }) {
  const body = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /login\nDisallow: /register\nDisallow: /profile\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.write(body);
  res.end();

  return { props: {} };
}

export default function Robots() {
  return null;
}
