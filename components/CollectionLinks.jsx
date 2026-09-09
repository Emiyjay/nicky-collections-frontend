import Link from 'next/link';

const COLLECTIONS = [['Footwear', 'footwear'], ['Outerwear', 'outerwear'], ['Accessories', 'accessories'], ['Clothing', 'clothing'], ['Collectibles', 'collectibles']];

export default function CollectionLinks({ className = '' }) {
  return <nav aria-label="Shop collections" className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>{COLLECTIONS.map(([label, slug]) => <Link key={slug} href={`/collections/${slug}`} className="font-body text-xs uppercase tracking-widest text-brand-gray hover:text-brand-pink transition-colors">{label}</Link>)}</nav>;
}
