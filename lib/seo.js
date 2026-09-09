export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const SITE_NAME = 'Nicky Collections';
export const DEFAULT_DESCRIPTION = 'Shop fashion-forward shoes, jackets, accessories and exclusive drops from Nicky Collections.';

export const absoluteUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
};

export const toJsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl('/icon-512.png'),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+1 (350) 220-8962',
  },
  sameAs: [
    process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/@shopwithnickycollections',
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/nickycollections',
  ],
});

export const breadcrumbSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    ...(item.url ? { item: absoluteUrl(item.url) } : {}),
  })),
});

export const productSchema = (product, path) => {
  if (!product) return null;

  const images = (product.images || []).map((image) => image?.url).filter(Boolean);
  const offers = {
    '@type': 'Offer',
    url: absoluteUrl(path),
    priceCurrency: 'USD',
    price: Number(product.price || 0).toFixed(2),
    availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images,
    sku: String(product._id),
    ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
    offers,
  };

  if (product.numReviews > 0 && product.rating > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(product.rating).toFixed(1),
      reviewCount: Number(product.numReviews),
    };
  }

  return schema;
};
