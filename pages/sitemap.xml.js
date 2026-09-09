import { SITE_URL } from '../lib/site';

const CORE_ROUTES = ['/', '/shop', '/about', '/contact'];

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  const urls = CORE_ROUTES.map((route) => `${SITE_URL}${route}`);

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      const response = await fetch(`${apiUrl}/products?limit=1000`);
      if (response.ok) {
        const payload = await response.json();
        const products = Array.isArray(payload) ? payload : payload.products || [];
        products.forEach((product) => {
          if (product?._id) urls.push(`${SITE_URL}/product/${encodeURIComponent(product._id)}`);
        });
      }
    }
  } catch (error) {
    console.error('Sitemap product fetch failed:', error.message);
  }

  const uniqueUrls = [...new Set(urls)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${uniqueUrls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
}
