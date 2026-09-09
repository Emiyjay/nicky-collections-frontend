import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiMessageSquare } from 'react-icons/fi';
import { WHATSAPP_LINK, CALL_LINK, SMS_LINK } from '../lib/whatsapp';

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-brand-dark text-brand-light">
        <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

        <main className="pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />

        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          <a href={CALL_LINK} aria-label="Call Nicky Collections"
            className="w-11 h-11 bg-brand-gold rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
          >
            <FiPhone size={19} color="white" />
          </a>
          <a href={SMS_LINK} aria-label="Send SMS to Nicky Collections"
            className="w-11 h-11 bg-brand-pink rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
          >
            <FiMessageSquare size={18} color="white" />
          </a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" aria-label="Chat with Nicky Collections on WhatsApp"
            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-400 hover:scale-110 transition-all duration-300 animate-pulse-glow"
          >
            <FaWhatsapp size={26} color="white" />
          </a>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#F5F5F0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#FF1F6D', secondary: 'white' } }
          }}
        />
      </div>
    </div>
  );
}
