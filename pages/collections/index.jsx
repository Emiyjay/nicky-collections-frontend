import Head from 'next/head';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '../../lib/site';

const COLLECTIONS = [
  { slug: 'footwear', title: 'Footwear', description: 'Sneakers and standout footwear for everyday style.' },
  { slug: 'outerwear', title: 'Outerwear', description: 'Jackets and outerwear selected for distinctive looks.' },
  { slug: 'accessories', title: 'Accessories', description: 'Finishing pieces to complete your look.' },
  { slug: 'clothing', title: 'Clothing', description: 'Everyday essentials and standout fashion pieces.' },
  { slug: 'collectibles', title: 'Collectibles', description: 'Unique collectible pieces and special finds.' },
  { slug: 'other', title: 'Other Collections', description: 'Additional products and unique finds.' },
];

export default function CollectionsIndex() {
  const title = `Collections — ${SITE_NAME}`;
  const description = 'Explore Nicky Collections by category: footwear, outerwear, accessories, clothing and collectibles.';
  const canonical = `${SITE_URL}/collections`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
      </Head>
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-24">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-brand-gray">
          <Link href="/shop" className="hover:text-brand-light">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-pink">Collections</span>
        </nav>
        <header className="max-w-3xl mb-12">
          <p className="label-tag text-brand-pink mb-3">Browse by category</p>
          <h1 className="section-title">Collections</h1>
          <p className="font-body text-brand-gray leading-relaxed mt-4">Explore curated Nicky Collections categories and discover products matched to your style.</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {COLLECTIONS.map((collection) => (
            <Link key={collection.slug} href={`/collections/${collection.slug}`} className="group bg-brand-card border border-white/5 hover:border-brand-pink/40 p-8 min-h-48 transition-all duration-300 hover:-translate-y-1">
              <p className="label-tag text-brand-pink mb-4">Collection</p>
              <h2 className="font-display text-3xl font-light text-brand-light group-hover:text-brand-pink transition-colors">{collection.title}</h2>
              <p className="font-body text-sm text-brand-gray leading-relaxed mt-3">{collection.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
