import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiChevronDown, FiMail } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../lib/api';
import { TIKTOK_URL } from '../lib/contact';
import { CONTACT_EMAIL } from '../lib/site';

const CATEGORIES = [
  { label: 'Footwear', eyebrow: 'Step out', href: '/shop?category=footwear', mark: '01' },
  { label: 'Outerwear', eyebrow: 'Layer up', href: '/shop?category=outerwear', mark: '02' },
  { label: 'Accessories', eyebrow: 'Finish the look', href: '/shop?category=accessories', mark: '03' },
  { label: 'Collectibles', eyebrow: 'Own the rare', href: '/shop?category=collectibles', mark: '04' },
];

const reveal = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.55 } } };

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productsAPI.getFeatured(), productsAPI.getAll({ sort: 'newest', limit: 8 })])
      .then(([featuredResponse, arrivalsResponse]) => { setFeatured(featuredResponse.data || []); setNewArrivals(arrivalsResponse.data?.products || []); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const heroProduct = featured[0] || newArrivals[0];
  const heroImage = heroProduct?.images?.[0]?.url;

  return (
    <>
      <Head>
        <title>Nicky Collections — Fashion Without Limits</title>
        <meta name="description" content="Discover fashion-forward footwear, outerwear, accessories and collectibles from Nicky Collections. Shop new arrivals and order directly by email." />
        <meta property="og:title" content="Nicky Collections — Fashion Without Limits" />
        <meta property="og:description" content="Fashion-forward drops, hand-picked for your next look." />
      </Head>
      <main>
        <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-brand-dark border-b border-white/5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,31,109,0.12),transparent_30%),radial-gradient(circle_at_30%_80%,rgba(212,168,67,0.08),transparent_28%)]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-6 py-20 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:py-16">
            <motion.div initial="hidden" animate="show" variants={reveal} className="max-w-2xl">
              <p className="mb-5 flex items-center gap-2 font-body text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-pink"><FaTiktok size={12} /> Curated on TikTok</p>
              <h1 className="font-display text-6xl font-light leading-[0.86] tracking-tight text-brand-light sm:text-7xl md:text-8xl lg:text-[7.5rem]">Style<br /><span className="italic text-brand-pink">without</span><br />limits.</h1>
              <p className="mt-8 max-w-lg font-body text-base leading-7 text-brand-gray md:text-lg">Hand-picked footwear, outerwear, accessories and collectibles for people who want their everyday look to feel anything but ordinary.</p>
              <div className="mt-9 flex flex-wrap gap-3"><Link href="/shop" className="btn-primary inline-flex items-center gap-2">Explore collection <FiArrowRight size={15} /></Link><a href={`mailto:${CONTACT_EMAIL}`} className="btn-outline inline-flex items-center gap-2"><FiMail size={15} /> Order by Email</a></div>
              <div className="mt-12 grid max-w-xl grid-cols-3 border-t border-white/10 pt-7">{[['500+', 'Customers'], ['100+', 'Pieces listed'], ['24/7', 'Direct support']].map(([value, label]) => <div key={label}><div className="font-display text-3xl text-brand-light md:text-4xl">{value}</div><div className="mt-1 font-body text-[9px] uppercase tracking-[0.18em] text-brand-gray">{label}</div></div>)}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.97, x: 25 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="relative mx-auto w-full max-w-[590px]"><div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-brand-card">{heroImage ? <Image src={heroImage} alt={heroProduct?.images?.[0]?.alt || heroProduct?.name || 'Nicky Collections fashion'} fill priority sizes="(max-width: 1023px) 90vw, 48vw" className="object-cover" /> : <div className="absolute inset-0 flex items-center justify-center"><span className="font-display text-[8rem] font-light tracking-tighter text-white/10 md:text-[12rem]">NC</span></div>}<div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-brand-dark/5" /><div className="absolute inset-5 border border-white/15 pointer-events-none" /><div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-5"><div><p className="font-body text-[9px] font-semibold uppercase tracking-[0.22em] text-brand-pink">The edit</p><p className="mt-1 max-w-xs font-display text-2xl leading-none text-white md:text-3xl">{heroProduct?.name || 'Your next statement piece'}</p></div>{heroProduct && <Link href={`/product/${heroProduct.slug || heroProduct._id}`} aria-label={`Shop ${heroProduct.name}`} className="flex h-11 w-11 shrink-0 items-center justify-center bg-white text-brand-dark transition-transform hover:scale-105"><FiArrowUpRight size={18} /></Link>}</div></div><div className="absolute -bottom-4 -left-4 hidden border border-brand-gold/30 bg-brand-dark/90 px-4 py-3 backdrop-blur-md sm:block"><p className="font-body text-[9px] uppercase tracking-[0.2em] text-brand-gold">New drops</p><p className="mt-1 font-body text-xs text-brand-light">Every week on TikTok</p></div></motion.div>
          </div>
          <a href="#discover" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-body text-[9px] uppercase tracking-[0.25em] text-brand-gray md:flex">Scroll to discover <FiChevronDown /></a>
        </section>
        <section id="discover" className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28"><div className="mb-10 flex items-end justify-between gap-6"><div><p className="label-tag text-brand-pink mb-3">Start here</p><h2 className="section-title">Shop by mood.</h2></div><Link href="/shop" className="hidden items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.15em] text-brand-gray sm:flex">View all <FiArrowRight /></Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">{CATEGORIES.map((category, index) => <motion.div key={category.label} initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} transition={{ delay: index * 0.06 }}><Link href={category.href} className="group relative block min-h-[190px] overflow-hidden border border-white/5 bg-brand-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-pink/40 md:min-h-[270px] md:p-7"><span className="font-body text-[9px] tracking-[0.2em] text-brand-gray">{category.mark}</span><div className="absolute inset-x-5 bottom-5 md:inset-x-7 md:bottom-7"><p className="mb-1 font-body text-[9px] uppercase tracking-[0.18em] text-brand-pink">{category.eyebrow}</p><h3 className="font-display text-2xl font-medium text-brand-light md:text-3xl">{category.label}</h3><span className="mt-4 inline-flex h-8 w-8 items-center justify-center border border-white/10 text-brand-gray group-hover:border-brand-pink group-hover:text-brand-pink"><FiArrowUpRight size={13} /></span></div><span className="absolute -right-4 -top-7 font-display text-[9rem] leading-none text-white/[0.025]">{category.mark}</span></Link></motion.div>)}</div></section>
        {featured.length > 0 && <section className="border-y border-white/5 bg-brand-card/40"><div className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28"><div className="mb-10 flex items-end justify-between gap-6"><div><p className="label-tag mb-3 text-brand-pink">The edit</p><h2 className="section-title">Featured pieces.</h2><p className="mt-3 max-w-md font-body text-sm leading-6 text-brand-gray">A tighter selection of pieces worth stopping for.</p></div><Link href="/shop?featured=true" className="btn-outline hidden text-xs sm:inline-flex">View all <FiArrowRight className="ml-2" size={12} /></Link></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">{featured.slice(0, 4).map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}</div></div></section>}
        <section className="mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-20"><div className="relative overflow-hidden bg-brand-pink px-7 py-14 md:px-12 md:py-20"><div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="font-body text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">Stay in the loop</p><h2 className="mt-3 max-w-xl font-display text-4xl font-light leading-none text-white md:text-6xl">The next drop starts here.</h2><p className="mt-5 max-w-md font-body text-sm leading-6 text-white/80">New pieces and styling inspiration land on TikTok first. Follow along and catch the next release.</p></div><a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 bg-white px-6 py-3.5 font-body text-xs font-bold uppercase tracking-[0.16em] text-brand-pink"><FaTiktok size={14} /> Follow on TikTok</a></div></div></section>
        {newArrivals.length > 0 && <section className="mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-28"><div className="mb-10 flex items-end justify-between gap-6"><div><p className="label-tag mb-3 text-brand-gold">Just landed</p><h2 className="section-title">New arrivals.</h2></div><Link href="/shop?sort=newest" className="btn-outline hidden text-xs sm:inline-flex">See all <FiArrowRight className="ml-2" size={12} /></Link></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">{newArrivals.slice(0, 8).map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}</div></section>}
        {!loading && newArrivals.length === 0 && <section className="mx-auto max-w-2xl px-6 py-28 text-center"><div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center border border-white/10 bg-brand-card font-display text-2xl text-brand-pink">NC</div><h2 className="font-display text-4xl text-brand-light">The collection is loading.</h2><p className="mx-auto mt-4 max-w-md font-body text-sm leading-6 text-brand-gray">Check back soon or reach out directly and we&apos;ll help you find your next piece.</p><a href={`mailto:${CONTACT_EMAIL}`} className="btn-primary mt-8 inline-flex items-center gap-2"><FiMail size={16} /> Email Us</a></section>}
        <section className="mx-auto max-w-7xl px-6 pb-24 pt-8 md:px-8 md:pb-32"><div className="glass-card relative overflow-hidden p-8 text-center md:p-14"><div className="relative"><FiMail size={38} className="mx-auto mb-5 text-brand-pink" /><p className="label-tag mb-3 text-brand-pink">Personal service</p><h2 className="section-title">See it. Want it. Order it.</h2><p className="mx-auto mt-4 max-w-xl font-body text-sm leading-6 text-brand-gray md:text-base">Open your email app with the product details, full description and product pictures ready to send.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><a href={`mailto:${CONTACT_EMAIL}`} className="btn-primary inline-flex items-center gap-3"><FiMail size={16} /> Email Nicky Collections</a><Link href="/shop" className="btn-outline">Browse products</Link></div></div></div></section>
      </main>
    </>
  );
}
