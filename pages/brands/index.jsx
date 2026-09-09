import Head from 'next/head';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '../../lib/site';

export default function BrandsPage({ brands }) {
  const title = `Brands — ${SITE_NAME}`;
  const description = `Browse brands available at ${SITE_NAME} and explore products by brand.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/brands`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${SITE_URL}/brands`} />
      </Head>
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-20">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-brand-gray">
          <Link href="/shop" className="hover:text-brand-light">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-pink">Brands</span>
        </nav>
        <header className="border-b border-white/10 pb-10 mb-10">
          <p className="label-tag text-brand-pink mb-3">Shop By Brand</p>
          <h1 className="section-title">Brands</h1>
          <p className="font-body text-brand-gray max-w-2xl mt-4 leading-relaxed">{description}</p>
        </header>
        {brands.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/brands/${encodeURIComponent(brand)}`}
                className="block bg-brand-card border border-white/5 hover:border-brand-pink/50 p-8 group transition-all duration-300 hover:-translate-y-1"
              >
                <span className="label-tag text-brand-pink">Brand</span>
                <h2 className="font-display text-2xl text-brand-light mt-3 group-hover:text-brand-pink transition-colors">{brand}</h2>
              </Link>
            ))}
          </div>
        ) : (
          <p className="font-body text-brand-gray">No brands are available yet.</p>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps({ res }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return { props: { brands: [] } };

  try {
    const response = await fetch(`${apiUrl}/products?limit=100`);
    if (!response.ok) throw new Error(`Product API returned ${response.status}`);
    const payload = await response.json();
    const products = Array.isArray(payload) ? payload : payload.products || [];
    const brands = [...new Set(products.map((product) => product.brand).filter(Boolean).map(String))]
      .sort((a, b) => a.localeCompare(b));
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=86400');
    return { props: { brands } };
  } catch (error) {
    console.error('Brands directory fetch failed:', error.message);
    return { props: { brands: [] } };
  }
}
