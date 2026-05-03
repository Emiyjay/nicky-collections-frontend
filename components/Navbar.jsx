import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShoppingBag, FiUser, FiHeart, FiSun, FiMoon, FiSearch } from 'react-icons/fi';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../lib/AuthContext';
import { TIKTOK_URL, WHATSAPP_LINK } from '../lib/whatsapp';

export default function Navbar({ darkMode, toggleDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top ticker */}
      <div className="bg-brand-pink py-2 overflow-hidden">
        <div className="ticker-content text-white text-xs tracking-widest uppercase font-body font-medium">
          {Array(6).fill('✦ Free Shipping on Orders $100+ ✦ New Arrivals Weekly ✦ Order via WhatsApp ✦ TikTok Drops Every Friday ✦').map((t, i) => (
            <span key={i} className="px-8">{t}</span>
          ))}
        </div>
      </div>

      {/* Main navbar */}
      <nav className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-brand-dark/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex flex-col leading-none">
              <span className="font-display text-2xl font-light tracking-widest text-brand-light">
                NICKY
              </span>
              <span className="font-body text-[9px] tracking-[0.4em] uppercase text-brand-pink">
                Collections
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${router.pathname === link.href ? 'text-brand-light border-b border-brand-pink' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              <button onClick={() => setSearchOpen(true)} className="text-brand-gray hover:text-brand-light transition-colors">
                <FiSearch size={18} />
              </button>

              <a href={TIKTOK_URL} target="_blank" rel="noreferrer"
                className="text-brand-gray hover:text-brand-pink transition-colors hidden md:block">
                <FaTiktok size={16} />
              </a>

              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer"
                className="text-brand-gray hover:text-green-400 transition-colors hidden md:block">
                <FaWhatsapp size={18} />
              </a>

              {user ? (
                <>
                  <Link href="/dashboard" className="text-brand-gray hover:text-brand-light transition-colors">
                    <FiHeart size={18} />
                  </Link>
                  <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="text-brand-gray hover:text-brand-light transition-colors">
                    <FiUser size={18} />
                  </Link>
                </>
              ) : (
                <Link href="/auth/login" className="text-brand-gray hover:text-brand-light transition-colors">
                  <FiUser size={18} />
                </Link>
              )}

              <button onClick={toggleDarkMode} className="text-brand-gray hover:text-brand-gold transition-colors hidden md:block">
                {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
              </button>

              {/* Mobile menu toggle */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-brand-light">
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-brand-dark border-t border-white/10 px-6 py-6 space-y-4"
            >
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-body text-sm tracking-widest uppercase text-brand-gray hover:text-brand-light py-2 border-b border-white/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-6 pt-4">
                <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="text-brand-gray hover:text-brand-pink">
                  <FaTiktok size={20} />
                </a>
                <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="text-brand-gray hover:text-green-400">
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-brand-dark/95 backdrop-blur-md flex items-center justify-center px-6"
          >
            <button onClick={() => setSearchOpen(false)} className="absolute top-8 right-8 text-brand-gray hover:text-brand-light">
              <FiX size={28} />
            </button>
            <div className="w-full max-w-2xl">
              <p className="label-tag text-center mb-6">Search Products</p>
              <form onSubmit={handleSearch} className="flex">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for shoes, jackets, accessories..."
                  className="input-field text-lg flex-1"
                />
                <button type="submit" className="btn-primary px-8">
                  <FiSearch size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
