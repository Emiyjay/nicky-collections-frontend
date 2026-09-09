import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../lib/api';
import { TIKTOK_URL, WHATSAPP_LINK } from '../lib/whatsapp';
import { DISPLAY_PHONE_NUMBER } from '../lib/site';

const CATEGORIES = [
  { label: 'Footwear', icon: '👟', href: '/shop?category=footwear' },
  { label: 'Outerwear', icon: '🧥', href: '/shop?category=outerwear' },
  { label: 'Accessories', icon: '🛍️', href: '/shop?category=accessories' },
  { label: 'Collectibles', icon: '🏆', href: '/shop?category=collectibles' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productsAPI.getFeatured(), productsAPI.getAll({ sort: 'newest', limit: 8 })])
      .then(([featRes, newRes]) => { setFeatured(featRes.data); setNewArrivals(newRes.data.products); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head><title>Nicky Collections 🛍️ — Fashion Promoted on TikTok</title><meta name="description" content="Shop the latest fashion drops from Nicky Collections. Shoes, jackets, accessories and more. Order via WhatsApp!" /><meta property="og:title" content="Nicky Collections — TikTok Fashion Store" /></Head>

      <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 pointer-events-none"><div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-pink/5 blur-[120px]" /><div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-gold/5 blur-[100px]" /></div>
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-16 w-full"><div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.p className="label-tag text-brand-pink mb-4 flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}><FaTiktok size={12} /> As seen on TikTok</motion.p>
            <motion.h1 className="font-display font-light text-5xl md:text-7xl lg:text-8xl text-brand-light leading-none mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>Style<br /><span className="italic text-brand-pink">Without</span><br />Limits</motion.h1>
            <motion.p className="font-body text-brand-gray text-lg leading-relaxed mb-10 max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Discover exclusive fashion drops — sneakers, jackets, accessories and more. All hand-picked and promoted on TikTok. Order directly via WhatsApp.</motion.p>
            <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}><Link href="/shop" className="btn-primary flex items-center gap-2">Shop Now <FiArrowRight size={16} /></Link><a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn-outline flex items-center gap-2"><FaWhatsapp size={16} /> Order via WhatsApp</a></motion.div>
            <motion.div className="flex gap-10 mt-12 pt-10 border-t border-white/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>{[{ val: '500+', label: 'Happy Customers' }, { val: '100+', label: 'Products Listed' }, { val: '24/7', label: 'WhatsApp Support' }].map(stat => <div key={stat.label}><div className="font-display text-3xl font-medium text-brand-light">{stat.val}</div><div className="label-tag mt-1">{stat.label}</div></div>)}</motion.div>
          </motion.div>
          <motion.div className="relative hidden lg:block" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}><div className="relative w-full aspect-square max-w-[560px] mx-auto"><div className="absolute inset-0 border border-brand-pink/20 rounded-none" /><div className="absolute inset-4 border border-brand-gold/10 rounded-none" /><div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><div className="font-display text-[10rem] font-light text-brand-light/5 leading-none select-none">NC</div><div className="font-body text-xs tracking-[0.5em] uppercase text-brand-pink mt-4">Collections</div></div></div><motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-8 right-8 glass-card px-4 py-3"><p className="label-tag text-brand-gold">New Drop</p><p className="font-body text-sm font-semibold text-brand-light mt-1">Nike Mind 001</p></motion.div><motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="absolute bottom-12 left-8 glass-card px-4 py-3"><p className="label-tag text-green-400 flex items-center gap-1"><FaWhatsapp size={10} /> Fast Order</p><p className="font-body text-sm font-semibold text-brand-light mt-1">WhatsApp Ready</p></motion.div></div></motion.div>
        </div></div>
        <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 glass-card px-5 py-3 hover:border-brand-pink/30 transition-all"><FaTiktok size={14} className="text-brand-pink" /><span className="font-body text-xs tracking-widest uppercase text-brand-gray">Follow @shopwithnickycollections</span></a>
      </section>

      <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto"><div className="flex items-end justify-between mb-12"><div><p className="label-tag text-brand-pink mb-3">Browse By</p><h2 className="section-title">Categories</h2></div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{CATEGORIES.map((cat, i) => <motion.div key={cat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}><Link href={cat.href} className="block bg-brand-card border border-white/5 hover:border-brand-pink/50 p-8 text-center group transition-all duration-300 hover:-translate-y-1"><div className="text-4xl mb-4">{cat.icon}</div><h3 className="font-body text-sm tracking-widest uppercase text-brand-gray group-hover:text-brand-light transition-colors">{cat.label}</h3></Link></motion.div>)}</div></section>

      {featured.length > 0 && <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto"><div className="flex items-end justify-between mb-12"><div><p className="label-tag text-brand-pink mb-3">Hand-Picked</p><h2 className="section-title">Featured</h2></div><Link href="/shop?featured=true" className="btn-outline text-xs">View All <FiArrowRight className="inline ml-2" size={12} /></Link></div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{featured.slice(0, 4).map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}</div></section>}

      <section className="my-12 mx-6 md:mx-8 max-w-7xl lg:mx-auto bg-brand-pink relative overflow-hidden"><div className="absolute inset-0 opacity-10"><div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/3 -translate-y-1/3" /><div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -translate-x-1/3 translate-y-1/3" /></div><div className="relative px-10 py-16 flex flex-col md:flex-row items-center justify-between gap-8"><div><p className="font-body text-white/70 text-sm tracking-widest uppercase mb-3">Limited Time</p><h2 className="font-display text-4xl md:text-5xl font-light text-white">TikTok Weekly Drops</h2><p className="font-body text-white/80 mt-3 max-w-md">New exclusive pieces every Friday. Follow us on TikTok to never miss a drop.</p></div><div className="flex gap-4 shrink-0"><a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="bg-white text-brand-pink font-body font-semibold text-sm tracking-widest uppercase px-6 py-3 flex items-center gap-2 hover:bg-brand-dark hover:text-white transition-all"><FaTiktok size={14} /> Follow on TikTok</a></div></div></section>

      {newArrivals.length > 0 && <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto"><div className="flex items-end justify-between mb-12"><div><p className="label-tag text-brand-gold mb-3">Just In</p><h2 className="section-title">New Arrivals</h2></div><Link href="/shop?sort=newest" className="btn-outline text-xs">See All <FiArrowRight className="inline ml-2" size={12} /></Link></div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{newArrivals.slice(0, 8).map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}</div></section>}

      {!loading && newArrivals.length === 0 && <section className="py-32 text-center px-6"><div className="max-w-md mx-auto"><div className="text-6xl mb-6">🛍️</div><h2 className="font-display text-4xl text-brand-light mb-4">Coming Soon</h2><p className="font-body text-brand-gray mb-8">We're loading up with amazing products. Check back soon or contact us on WhatsApp!</p><a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2"><FaWhatsapp size={16} /> Chat with Us</a></div></section>}

      <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto"><div className="glass-card p-12 md:p-20 text-center relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" /><FaWhatsapp size={48} className="text-green-400 mx-auto mb-6" /><h2 className="section-title mb-4">Order Directly on WhatsApp</h2><p className="font-body text-brand-gray text-lg max-w-xl mx-auto mb-10">See something you like? Just tap a product and click "Order on WhatsApp" for instant personal service and fast delivery.</p><div className="flex flex-wrap gap-4 justify-center"><a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-400 text-white font-body font-semibold text-sm tracking-widest uppercase px-8 py-4 flex items-center gap-3 transition-colors"><FaWhatsapp size={18} /> {DISPLAY_PHONE_NUMBER}</a><Link href="/shop" className="btn-outline">Browse Products</Link></div></div></section>
    </>
  );
}
