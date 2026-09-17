import { SITE_URL } from '../lib/site';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function firstValidImage(images = []) {
  return images.find((item) => clean(item?.url))?.url || '';
}

function optionalIdentifier(product, keys) {
  for (const key of keys) {
    const value = clean(product?.[key]);
    if (value) return value;
  }
  return undefined;
}

export default function ProductStructuredData({ product }) {
  if (!product || !product.name || !Number.isFinite(Number(product.price))) return null;

  const identifier = clean(product.slug) || clean(product._id);
  const image = firstValidImage(product.images);
  const url = identifier ? `${SITE_URL}/product/${encodeURIComponent(identifier)}` : SITE_URL;
  const price = Number(product.price).toFixed(2);
  const reviews = Number(product.numReviews) || 0;
  const rating = Number(product.rating);
  const sku = optionalIdentifier(product, ['sku', 'SKU', 'productCode', 'code']);
  const gtin = optionalIdentifier(product, ['gtin', 'GTIN', 'gtin13', 'gtin12', 'gtin14']);
  const mpn = optionalIdentifier(product, ['mpn', 'MPN', 'modelNumber']);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: clean(product.name),
    description: clean(product.description) || undefined,
    image: image ? [image] : undefined,
    url,
    ...(sku ? { sku } : {}),
    ...(gtin ? { gtin } : {}),
    ...(mpn ? { mpn } : {}),
    brand: clean(product.brand) ? { '@type': 'Brand', name: clean(product.brand) } : undefined,
    category: clean(product.category) || undefined,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      ...(product.condition
        ? { itemCondition: `https://schema.org/${clean(product.condition)}` }
        : {}),
      seller: {
        '@type': 'Organization',
        name: 'Nicky Collections',
        url: SITE_URL,
      },
    },
    ...(reviews > 0 && Number.isFinite(rating) && rating > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Math.min(5, Math.max(1, rating)).toFixed(1),
            reviewCount: reviews,
          },
        }
      : {}),
  };

  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
