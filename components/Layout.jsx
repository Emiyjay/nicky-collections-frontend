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
        <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

        <main className="pt-16">
          <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}>
              {children}
              {relatedProductId && <RelatedProducts productId={relatedProductId} category={relatedCategory} />}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />

        <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-400 hover:scale-110 transition-all duration-300 animate-pulse-glow">
          <FaWhatsapp size={26} color="white" />
        </a>

        <Toaster position="top-right" toastOptions={{
          style: { background: '#111111', color: '#F5F5F0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0', fontFamily: 'Outfit, sans-serif', fontSize: '14px' },
          success: { iconTheme: { primary: '#FF1F6D', secondary: 'white' } }
        }} />
      </div>
    </div>
  );
}
