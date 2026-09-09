export function StructuredData({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationStructuredData({ siteUrl, name, logo, sameAs = [] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: siteUrl,
    ...(logo ? { logo } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return <StructuredData data={data} />;
}

export function ProductStructuredData({ product, url }) {
  if (!product) return null;

  const images = (product.images || []).map((image) => image.url).filter(Boolean);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    ...(images.length ? { image: images } : {}),
    ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand } } : {}),
    ...(product.category ? { category: product.category } : {}),
    ...(product.colors?.length ? { color: product.colors.join(', ') } : {}),
    ...(product.sizes?.length ? { size: product.sizes.join(', ') } : {}),
    ...(product._id ? { sku: String(product._id) } : {}),
    offers: {
      '@type': 'Offer',
      url,
      price: Number(product.price).toFixed(2),
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.numReviews > 0 && product.rating > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(product.rating).toFixed(1),
            reviewCount: Number(product.numReviews),
          },
        }
      : {}),
  };

  return <StructuredData data={data} />;
}

export function BreadcrumbStructuredData({ items }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };

  return <StructuredData data={data} />;
}
