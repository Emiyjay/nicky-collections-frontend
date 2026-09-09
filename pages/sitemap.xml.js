import { SITE_URL } from '../lib/seo';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function getServerSideProps({ res }) {
  const staticPaths = ['/', '/shop', '/about', '/contact'];
  let productPaths = [];

  try {
    const response = await fetch(`${API_URL}/products?limit=1000`);
    if (response.ok) {
      const data = await response.json();
      const products = data.products || data || [];
      productPaths = products
        .map((product) => product?._id)
        .filter(Boolean)
        .map((id) => `/product/${id}`);
    }
  } catch (error) {
    console.error('Sitemap product fetch failed:', error.message);
  }

  const urls = [...staticPaths, ...productPaths];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((path) => `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc></url>`)
    .join('\n')}\n</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.write(xml);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
