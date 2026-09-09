import { SITE_NAME, SITE_URL } from '../lib/site';

export default function CollectionStructuredData({ category, title, description, products = [] }) {
  const canonical = `${SITE_URL}/collections/${category}`;
  const itemList = products.slice(0, 100).map((product, index) => {
    const identifier = product.slug || product._id;
    return {
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/product/${identifier}`,
      name: product.name,
    };
  });

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#collection`,
        url: canonical,
        name: title,
        description,
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Shop', item: `${SITE_URL}/shop` },
          { '@type': 'ListItem', position: 2, name: title, item: canonical },
        ],
      },
      {
        '@type': 'ItemList',
        name: `${title} products`,
        url: canonical,
        numberOfItems: itemList.length,
        itemListElement: itemList,
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
