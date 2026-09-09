import { SITE_URL } from '../lib/site';

const CATEGORY_SLUGS = ['footwear', 'outerwear', 'accessories', 'clothing', 'collectibles', 'other'];

function xmlEscape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export default function Sitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  const urls = new Map();
  const add = (path, priority = '0.7') => urls.set(path, priority);

  add('/', '1.0');
  add('/shop', '0.9');
  add('/collections', '0.8');
  add('/brands', '0.8');
  add('/about', '0.5');
  add('/contact', '0.6');
  add('/blog', '0.7');
  CATEGORY_SLUGS.forEach((category) => add(`/collections/${category}`, '0.8'));

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/products?limit=100`);
      if (response.ok) {
        const payload = await response.json();
        const products = Array.isArray(payload) ? payload : payload.products || [];
        products.forEach((product) => {
          const identifier = product.slug || product._id;
          if (identifier) add(`/product/${encodeURIComponent(identifier)}`, '0.8');
          if (product.brand) add(`/brands/${encodeURIComponent(String(product.brand))}`, '0.7');
        });
      }
    } catch (error) {
      console.error('Product sitemap fetch failed:', error.message);
    }

    try {
      const response = await fetch(`${apiUrl}/blog`);
      if (response.ok) {
        const payload = await response.json();
        const posts = Array.isArray(payload) ? payload : payload.posts || payload.blogPosts || [];
        posts.forEach((post) => {
          if (post.slug) add(`/blog/${encodeURIComponent(post.slug)}`, '0.6');
        });
      }
    } catch (error) {
      console.error('Blog sitemap fetch failed:', error.message);
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...urls.entries()].map(([path, priority]) => `<url><loc>${xmlEscape(`${SITE_URL}${path}`)}</loc><changefreq>daily</changefreq><priority>${priority}</priority></url>`).join('')}</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
  res.write(body);
  res.end();

  return { props: {} };
}
