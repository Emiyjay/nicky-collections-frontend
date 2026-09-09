import { SITE_URL } from '../lib/site';

const CORE_ROUTES = ['/', '/shop', '/about', '/contact', '/blog', '/collections/footwear', '/collections/outerwear', '/collections/accessories', '/collections/clothing', '/collections/collectibles', '/collections/other'];

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  const urls = CORE_ROUTES.map((route) => `${SITE_URL}${route}`);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (apiUrl) {
    try {
      const productResponse = await fetch(`${apiUrl}/products?limit=1000`);
      if (productResponse.ok) {
        const payload = await productResponse.json();
        const products = Array.isArray(payload) ? payload : payload.products || [];
        products.forEach((product) => {
          const identifier = product?.slug || product?._id;
          if (identifier) urls.push(`${SITE_URL}/product/${encodeURIComponent(identifier)}`);
        });
      }
    } catch (error) {
      console.error('Sitemap product fetch failed:', error.message);
    }

    try {
      const blogResponse = await fetch(`${apiUrl}/blog?limit=1000`);
      if (blogResponse.ok) {
        const posts = await blogResponse.json();
        posts.forEach((post) => {
          if (post?.slug) urls.push(`${SITE_URL}/blog/${encodeURIComponent(post.slug)}`);
        });
      }
    } catch (error) {
      console.error('Sitemap blog fetch failed:', error.message);
    }
  }

  const uniqueUrls = [...new Set(urls)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${uniqueUrls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
}
