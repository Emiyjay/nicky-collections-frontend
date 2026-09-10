import { SITE_URL } from '../lib/site';

const CATEGORY_PATHS = [
  'footwear',
  'outerwear',
  'accessories',
  'clothing',
  'collectibles',
  'other',
];

const INTENT_PATHS = ['new-arrivals', 'featured', 'sale'];

const staticUrls = [
  '/',
  '/shop',
  '/collections',
  '/contact',
  ...CATEGORY_PATHS.map((category) => `/collections/${category}`),
  ...INTENT_PATHS.map((intent) => `/collections/${intent}`),
];

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const toUrl = (path) => `${SITE_URL}${path}`;

async function buildSitemap() {
  const urls = [...staticUrls.map(toUrl)];
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (apiUrl) {
    try {
      let page = 1;
      let pages = 1;
      const limit = 50;

      do {
        const response = await fetch(`${apiUrl}/products?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error(`Product API returned ${response.status}`);

        const payload = await response.json();
        const products = Array.isArray(payload) ? payload : payload.products || [];
        pages = Math.max(Number(payload.pages) || 1, page);

        for (const product of products) {
          const identifier = product.slug || product._id;
          if (identifier) urls.push(toUrl(`/product/${encodeURIComponent(identifier)}`));
        }

        page += 1;
      } while (page <= pages);
    } catch (error) {
      console.error('Sitemap product fetch failed:', error.message);
    }
  }

  const uniqueUrls = [...new Set(urls)];
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    uniqueUrls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n') +
    `\n</urlset>`;
}

export async function getServerSideProps({ res }) {
  const xml = await buildSitemap();

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.statusCode = 200;
  res.end(xml);

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
