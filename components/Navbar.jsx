import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHeart, FiSun, FiMoon, FiSearch, FiMail } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import { useAuth } from '../lib/AuthContext';
import { TIKTOK_URL } from '../lib/contact';
import { CONTACT_EMAIL } from '../lib/site';

export default function Navbar({ darkMode, toggleDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!searchOpen && !menuOpen) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') { setSearchOpen(false); setMenuOpen(false); } };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, menuOpen]);
  const handleSearch = (e) => { e.preventDefault(); if (searchQuery.trim()) { router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`); setSearchOpen(false); setSearchQuery(''); } };
  const navLinks = [{ href: '/', label: 'Home' }, { href: '/shop', label: 'Shop' }, { href: '/about', label: 'About' }, { href: '/contact', label: 'Contact' }];
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="bg-brand-pink py-2 overflow-hidden" aria-label="Store announcements"><div className="ticker-content text-white text-xs tracking-widest uppercase font-body font-medium" aria-hidden="true">{Array(6).fill('✦ Free Shipping on Orders $100+ ✦ New Arrivals Weekly ✦ Order via Email ✦ TikTok Drops Every Friday ✦').map((t, i) => <span key={i} className="px-8">{t}</span>)}</div></div>
      <nav aria-label="Primary navigation" className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-brand-dark/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8"><div className="flex items-center justify-between h-16">
          <Link href="/" className="flex flex-col leading-none" aria-label="Nicky Collections home"><span className="font-display text-2xl font-light tracking-widest text-brand-light">NICKY</span><span className="font-body text-[9px] tracking-[0.4em] uppercase text-brand-pink">Collections</span></Link>
          <div className="hidden md:flex items-center gap-8">{navLinks.map(link => <Link key={link.href} href={link.href} aria-current={router.pathname === link.href ? 'page' : undefined} className={`nav-link ${router.pathname === link.href ? 'text-brand-light border-b border-brand-pink' : ''}`}>{link.label}</Link>)}</div>
          <div className="flex items-center gap-3 md:gap-4">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search products" aria-haspopup="dialog" className="p-2 text-brand-gray hover:text-brand-light transition-colors"><FiSearch size={18} aria-hidden="true" /></button>
            <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="Nicky Collections on TikTok" className="p-2 text-brand-gray hover:text-brand-pink transition-colors hidden md:block"><FaTiktok size={16} aria-hidden="true" /></a>
            <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email Nicky Collections" className="p-2 text-brand-gray hover:text-brand-pink transition-colors hidden md:block"><FiMail size={18} aria-hidden="true" /></a>
            {user ? <><Link href="/dashboard" aria-label="Wishlist and dashboard" className="p-2 text-brand-gray hover:text-brand-light transition-colors"><FiHeart size={18} aria-hidden="true" /></Link><Link href={user.role === 'admin' ? '/admin' : '/dashboard'} aria-label="Account" className="p-2 text-brand-gray hover:text-brand-light transition-colors"><span className="font-body text-xs tracking-widest uppercase">Account</span></Link></> : <Link href="/auth/login" aria-label="Log in" className="p-2 text-brand-gray hover:text-brand-light transition-colors"><span className="font-body text-xs tracking-widest uppercase">Log in</span></Link>}
            <button type="button" onClick={toggleDarkMode} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} className="p-2 text-brand-gray hover:text-brand-gold transition-colors hidden md:block">{darkMode ? <FiSun size={16} aria-hidden="true" /> : <FiMoon size={16} aria-hidden="true" />}</button>
            <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} className="p-2 md:hidden text-brand-light">{menuOpen ? <FiX size={22} aria-hidden="true" /> : <FiMenu size={22} aria-hidden="true" />}</button>
          </div>
        </div></div>
        <AnimatePresence>{menuOpen && <motion.div id="mobile-navigation" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden bg-brand-dark border-t border-white/10 px-6 py-6 space-y-4">{navLinks.map(link => <Link key={link.href} href={link.href} onClick={closeMenu} aria-current={router.pathname === link.href ? 'page' : undefined} className="block font-body text-sm tracking-widest uppercase text-brand-gray hover:text-brand-light py-3 border-b border-white/5">{link.label}</Link>)}<div className="flex gap-4 pt-4"><a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="Nicky Collections on TikTok" className="p-2 text-brand-gray hover:text-brand-pink"><FaTiktok size={20} aria-hidden="true" /></a><a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email Nicky Collections" className="p-2 text-brand-gray hover:text-brand-pink"><FiMail size={20} aria-hidden="true" /></a></div></motion.div>}</AnimatePresence>
      </nav>
      <AnimatePresence>{searchOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="product-search-title" className="fixed inset-0 z-[60] bg-brand-dark/95 backdrop-blur-md flex items-center justify-center px-6"><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close product search" className="absolute top-6 right-6 md:top-8 md:right-8 p-2 text-brand-gray hover:text-brand-light"><FiX size={28} aria-hidden="true" /></button><div className="w-full max-w-2xl"><p id="product-search-title" className="label-tag text-center mb-6">Search Products</p><form onSubmit={handleSearch} role="search" className="flex gap-2"><label htmlFor="global-product-search" className="sr-only">Search products</label><input id="global-product-search" autoFocus type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search shoes, jackets, accessories..." autoComplete="off" className="input-field text-lg flex-1" /><button type="submit" className="btn-primary px-6" aria-label="Submit product search"><FiSearch size={20} aria-hidden="true" /></button></form></div></motion.div>}</AnimatePresence>
    </>
  );
}
