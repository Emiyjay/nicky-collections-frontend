import Link from 'next/link';
import { FaTiktok, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';
import { TIKTOK_URL, WHATSAPP_LINK, INSTAGRAM_URL, CALL_LINK, SMS_LINK, CONTACT } from '../lib/whatsapp';

export default function Footer() {
  return (
    <footer className="bg-brand-card border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="mb-4">
              <span className="font-display text-3xl font-light tracking-widest text-brand-light block">NICKY</span>
              <span className="font-body text-[9px] tracking-[0.4em] uppercase text-brand-pink">Collections</span>
            </div>
            <p className="font-body text-sm text-brand-gray leading-relaxed mb-6">
              Fashion-forward pieces promoted on TikTok. Order via WhatsApp for fast, personal service.
            </p>
            <div className="flex gap-4">
              <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="Nicky Collections on TikTok"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-brand-gray hover:text-brand-pink hover:border-brand-pink transition-all">
                <FaTiktok size={16} />
              </a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" aria-label="Chat with Nicky Collections on WhatsApp"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-brand-gray hover:text-green-400 hover:border-green-400 transition-all">
                <FaWhatsapp size={16} />
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Nicky Collections on Instagram"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-brand-gray hover:text-pink-400 hover:border-pink-400 transition-all">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="label-tag text-brand-light mb-6">Shop</h4>
            <ul className="space-y-3">
              {[
                ['All Products', '/shop'],
                ['Footwear', '/shop?category=footwear'],
                ['Outerwear', '/shop?category=outerwear'],
                ['Accessories', '/shop?category=accessories'],
                ['New Arrivals', '/shop?sort=newest'],
                ['Featured', '/shop?featured=true'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="font-body text-sm text-brand-gray hover:text-brand-light transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label-tag text-brand-light mb-6">Help</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Order on WhatsApp', href: WHATSAPP_LINK, external: true },
                { label: 'Call Now', href: CALL_LINK, external: true },
                { label: 'Send SMS', href: SMS_LINK, external: true },
                { label: 'TikTok Shop', href: TIKTOK_URL, external: true },
              ].map(item => (
                <li key={item.label}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="font-body text-sm text-brand-gray hover:text-brand-light transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="font-body text-sm text-brand-gray hover:text-brand-light transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label-tag text-brand-light mb-6">Contact Us</h4>
            <div className="space-y-4">
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-brand-gray hover:text-green-400 transition-colors">
                <FaWhatsapp size={16} className="text-green-400" />
                <span>{CONTACT.phone}</span>
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a href={CALL_LINK} className="flex items-center justify-center gap-2 border border-white/10 px-3 py-2 text-xs text-brand-gray hover:border-brand-gold hover:text-brand-light transition-all">
                  <FiPhone size={13} /> Call
                </a>
                <a href={SMS_LINK} className="flex items-center justify-center gap-2 border border-white/10 px-3 py-2 text-xs text-brand-gray hover:border-brand-pink hover:text-brand-light transition-all">
                  <FiMessageSquare size={13} /> SMS
                </a>
              </div>
              <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-brand-gray hover:text-brand-pink transition-colors">
                <FaTiktok size={14} className="text-brand-pink" />
                <span>@shopwithnickycollections</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-brand-gray">
                <FiMail size={14} className="text-brand-gold" />
                <span>{CONTACT.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 md:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-brand-gray tracking-wide">© {new Date().getFullYear()} Nicky Collections. All rights reserved.</p>
          <p className="font-body text-xs text-brand-gray">Designed with <span className="text-brand-pink">♥</span> for fashion lovers</p>
        </div>
      </div>
    </footer>
  );
}
