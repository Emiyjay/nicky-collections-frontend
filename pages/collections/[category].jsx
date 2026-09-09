import Head from 'next/head';
import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import { SITE_NAME, SITE_URL } from '../../lib/site';

const CATEGORIES = {
  footwear: { title: 'Footwear', description: 'Shop curated footwear from Nicky Collections, including standout sneakers and everyday styles.' },
  outerwear: { title: 'Outerwear', description: 'Explore jackets and outerwear selected by Nicky Collections for distinctive everyday looks.' },
  accessories: { title: 'Accessories', description: 'Discover accessories that complete your Nicky Collections look.' },
  clothing: { title: 'Clothing', description: 'Shop clothing from Nicky Collections, from everyday essentials to standout pieces.' },
  collectibles: { title: 'Collectibles', description: 'Explore collectible pieces and unique finds available from Nicky Collections.' },
  other: { title: 'Other Collections', description: 'Browse additional products and unique finds from Nicky Collections.' },
};

export default function CollectionPage({ category, products, total }) {
  const meta = CATEGORIES[category];
  const title = `${meta.title} — ${SITE_NAME}`;
  const canonical = `${SITE_URL}/collections/${category}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={canonical} />
      </Head>

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-20">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-brand-gray">
          <Link href="/shop" className="hover:text-brand-light">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-pink">{meta.title}</span>
        </nav>

        <header className="border-b border-white/10 pb-10 mb-10">
          <p className="label-tag text-brand-pink mb-3">Nicky Collections</p>
          <h1 className="section-title">{meta.title}</h1>
          <p className="font-body text-brand-gray max-w-2xl mt-4 leading-relaxed">{meta.description}</p>
          <p className="font-body text-sm text-brand-gray mt-4">{total} {total === 1 ? 'product' : 'products'}</p>
        </header>

        {products.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}
          </div>
        ) : (
          <div className="py-24 text-center">
            <h2 className="font-display text-3xl text-brand-light mb-4">No products in this collection yet</h2>
            <Link href="/shop" className="btn-primary inline-block">Browse all products</Link>
          </div>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps({ params, res }) {
  const category = String(params.category || '').toLowerCase();
  if (!CATEGORIES[category]) return { notFound: true };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return { props: { category, products: [], total: 0 } };

  try {
    const response = await fetch(`${apiUrl}/products?category=${encodeURIComponent(category)}&limit=100`);
    if (!response.ok) throw new Error(`Product API returned ${response.status}`);
    const payload = await response.json();
    const products = Array.isArray(payload) ? payload : payload.products || [];
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
    return { props: { category, products, total: payload.total ?? products.length } };
  } catch (error) {
    console.error('Collection page product fetch failed:', error.message);
    return { props: { category, products: [], total: 0 } };
  }
}
