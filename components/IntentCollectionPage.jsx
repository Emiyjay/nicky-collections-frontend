import Head from 'next/head';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { SITE_NAME, SITE_URL } from '../lib/site';

export default function IntentCollectionPage({ title, description, path, eyebrow, products = [], emptyMessage }) {
  const canonical = `${SITE_URL}${path}`;
  const itemList = products.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${SITE_URL}/product/${product.slug || product._id}`,
    name: product.name,
  }));

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${canonical}#collection`, name: title, description, url: canonical },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: title, item: canonical },
      ] },
      { '@type': 'ItemList', name: title, numberOfItems: itemList.length, itemList: itemList.slice(0, 100) },
    ],
  };

  return (
    <>
      <Head>
        <title>{title} — {SITE_NAME}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${title} — ${SITE_NAME}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <main className="pt-32 pb-20 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="label-tag text-brand-pink mb-3">{eyebrow}</p>
          <h1 className="section-title">{title}</h1>
          <p className="font-body text-brand-gray max-w-2xl mt-5 leading-relaxed">{description}</p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <h2 className="font-display text-3xl text-brand-light mb-3">Nothing here yet</h2>
            <p className="font-body text-brand-gray mb-6">{emptyMessage}</p>
            <Link href="/shop" className="btn-primary inline-flex">Browse All Products</Link>
          </div>
        )}
      </main>
    </>
  );
}
