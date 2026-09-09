import { SITE_URL } from '../../../lib/site';

const escapeXml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

export default function GoogleProductFeed() {}

export async function getServerSideProps({ res }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  let products = [];

  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/products?limit=1000`);
      if (response.ok) {
        const payload = await response.json();
        products = Array.isArray(payload) ? payload : payload.products || [];
      }
    } catch (error) {
      console.error('Google product feed fetch failed:', error.message);
    }
  }

  const items = products.map((product) => {
    const identifier = product.slug || product._id;
    const productUrl = `${SITE_URL}/product/${encodeURIComponent(identifier)}`;
    const imageUrl = product.images?.[0]?.url;
    if (!identifier || !imageUrl || product.price == null) return '';

    return `<item>` +
      `<g:id>${escapeXml(product._id || identifier)}</g:id>` +
      `<g:title>${escapeXml(product.name)}</g:title>` +
      `<g:description>${escapeXml(product.description || product.name)}</g:description>` +
      `<g:link>${escapeXml(productUrl)}</g:link>` +
      `<g:image_link>${escapeXml(imageUrl)}</g:image_link>` +
      `<g:price>${Number(product.price).toFixed(2)} USD</g:price>` +
      `<g:availability>${product.inStock ? 'in_stock' : 'out_of_stock'}</g:availability>` +
      (product.brand ? `<g:brand>${escapeXml(product.brand)}</g:brand>` : '') +
      (product.category ? `<g:product_type>${escapeXml(product.category)}</g:product_type>` : '') +
      (product.comparePrice && Number(product.comparePrice) > Number(product.price)
        ? `<g:sale_price>${Number(product.price).toFixed(2)} USD</g:sale_price>`
        : '') +
      `</item>`;
  }).filter(Boolean).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>` +
    `<title>Nicky Collections Product Feed</title>` +
    `<link>${escapeXml(SITE_URL)}</link>` +
    `<description>Nicky Collections products</description>` +
    items +
    `</channel></rss>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
  res.write(xml);
  res.end();
  return { props: {} };
}
