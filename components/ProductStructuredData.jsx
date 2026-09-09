import { SITE_URL } from '../lib/site';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function ProductStructuredData({ product }) {
  if (!product || !product.name || !Number.isFinite(Number(product.price))) return null;

  const identifier = clean(product.slug) || clean(product._id);
  const image = product.images?.find((item) => clean(item?.url))?.url;
  const url = identifier ? `${SITE_URL}/product/${encodeURIComponent(identifier)}` : SITE_URL;
  const price = Number(product.price).toFixed(2);
  const comparePrice = Number(product.comparePrice);
  const hasSale = Number.isFinite(comparePrice) && comparePrice > Number(product.price);
  const reviews = Number(product.numReviews) || 0;
  const rating = Number(product.rating);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: clean(product.description) || undefined,
    image: image ? [image] : undefined,
    url,
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
      itemCondition: 'https://schema.org/NewCondition',
      ...(hasSale ? { priceValidUntil: undefined } : {}),
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
