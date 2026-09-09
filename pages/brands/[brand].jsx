import Head from 'next/head';
import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import { SITE_NAME, SITE_URL } from '../../lib/site';

function decodeBrand(value) {
  return decodeURIComponent(String(value || '')).replace(/\s+/g, ' ').trim();
}

export default function BrandPage({ brand, products, total }) {
  const title = `${brand} — ${SITE_NAME}`;
  const description = `Shop ${brand} products at ${SITE_NAME}. Browse available ${brand} styles, footwear, clothing, accessories and more.`;
  const canonical = `${SITE_URL}/brands/${encodeURIComponent(brand.toLowerCase().replace(/\s+/g, '-'))}`;
  const items = products.slice(0, 100).map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${SITE_URL}/product/${product.slug || product._id}`,
    name: product.name,
  }));

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonical}#brand`,
        url: canonical,
        name: title,
        description,
        isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Shop', item: `${SITE_URL}/shop` },
          { '@type': 'ListItem', position: 2, name: brand, item: canonical },
        ],
      },
      {
        '@type': 'ItemList',
        name: `${brand} products`,
        url: canonical,
        numberOfItems: items.length,
        itemListElement: items,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-20">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-brand-gray">
          <Link href="/shop" className="hover:text-brand-light">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-pink">{brand}</span>
        </nav>

        <header className="border-b border-white/10 pb-10 mb-10">
          <p className="label-tag text-brand-pink mb-3">Brand Collection</p>
          <h1 className="section-title">{brand}</h1>
          <p className="font-body text-brand-gray max-w-2xl mt-4 leading-relaxed">{description}</p>
          <p className="font-body text-sm text-brand-gray mt-4">{total} {total === 1 ? 'product' : 'products'}</p>
        </header>

        {products.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="font-display text-3xl text-brand-light mb-4">No products found for this brand</h2>
            <Link href="/shop" className="btn-primary inline-block">Browse all products</Link>
          </div>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps({ params, res }) {
  const brand = decodeBrand(params.brand);
  if (!brand) return { notFound: true };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return { props: { brand, products: [], total: 0 } };

  try {
    const response = await fetch(`${apiUrl}/products?brand=${encodeURIComponent(brand)}&limit=100`);
    if (!response.ok) throw new Error(`Product API returned ${response.status}`);
    const payload = await response.json();
    const products = Array.isArray(payload) ? payload : payload.products || [];
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
    return { props: { brand, products, total: payload.total ?? products.length } };
  } catch (error) {
    console.error('Brand page product fetch failed:', error.message);
    return { props: { brand, products: [], total: 0 } };
  }
}
