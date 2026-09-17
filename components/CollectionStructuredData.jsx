import { SITE_NAME, SITE_URL } from '../lib/site';

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function CollectionStructuredData({ category, title, description, products = [] }) {
  const safeCategory = clean(category);
  const canonical = `${SITE_URL}/collections/${encodeURIComponent(safeCategory)}`;
  const itemList = products.slice(0, 100).flatMap((product, index) => {
    const identifier = clean(product?.slug) || clean(product?._id);
    if (!identifier || !clean(product?.name)) return [];

    return [{
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/product/${encodeURIComponent(identifier)}`,
      name: clean(product.name),
    }];
  });

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#collection`,
        url: canonical,
        name: clean(title),
        description: clean(description) || undefined,
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Shop', item: `${SITE_URL}/shop` },
          { '@type': 'ListItem', position: 2, name: clean(title), item: canonical },
        ],
      },
      {
        '@type': 'ItemList',
        name: `${clean(title)} products`,
        url: canonical,
        numberOfItems: itemList.length,
        itemListElement: itemList,
      },
    ],
  };

  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
