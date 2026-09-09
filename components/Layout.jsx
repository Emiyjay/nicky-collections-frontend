import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import RelatedProducts from './RelatedProducts';
import { Toaster } from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';
import { WHATSAPP_LINK } from '../lib/whatsapp';
import { productsAPI } from '../lib/api';

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const [relatedProductId, setRelatedProductId] = useState(null);
  const [relatedCategory, setRelatedCategory] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const identifier = router.isReady && router.pathname.startsWith('/product/') ? router.query.id : null;
    if (!identifier) {
      setRelatedProductId(null);
      setRelatedCategory(null);
      return;
    }

    const loadProduct = identifier.length === 24 && /^[a-f0-9]+$/i.test(identifier)
      ? productsAPI.getOne(identifier)
      : productsAPI.getBySlug(identifier);

    loadProduct
      .then((res) => {
        setRelatedProductId(res.data?._id || null);
        setRelatedCategory(res.data?.category || null);
      })
      .catch(() => {
        setRelatedProductId(null);
        setRelatedCategory(null);
      });
  }, [router.isReady, router.pathname, router.query.id]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-brand-dark text-brand-light">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

        <main id="main-content" tabIndex="-1" className="pt-16 outline-none">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {children}
              {relatedProductId && <RelatedProducts productId={relatedProductId} category={relatedCategory} />}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />

        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with Nicky Collections on WhatsApp"
          className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 group"
        >
          <span className="absolute right-0 bottom-full mb-3 hidden md:block whitespace-nowrap bg-brand-dark border border-white/10 px-3 py-2 text-xs font-body tracking-wide text-brand-light opacity-0 translate-y-1 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
            Chat on WhatsApp
          </span>
          <span className="flex w-14 h-14 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30 hover:bg-green-400 hover:scale-105 transition-transform duration-300">
            <FaWhatsapp size={26} color="white" aria-hidden="true" />
          </span>
        </a>

        <Toaster position="top-right" toastOptions={{
          style: { background: '#111111', color: '#F5F5F0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0', fontFamily: 'Outfit, sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#FF1F6D', secondary: 'white' } }
        }} />
      </div>
    </div>
  );
}
