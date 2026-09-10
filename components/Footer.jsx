import Link from 'next/link';
import { FaTiktok, FaInstagram } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { TIKTOK_URL } from '../lib/whatsapp';
import { CONTACT_EMAIL } from '../lib/site';

export default function Footer() {
  return (
    <footer className="bg-brand-card border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="mb-4"><span className="font-display text-3xl font-light tracking-widest text-brand-light block">NICKY</span><span className="font-body text-[9px] tracking-[0.4em] uppercase text-brand-pink">Collections</span></div>
            <p className="font-body text-sm text-brand-gray leading-relaxed mb-6">Fashion-forward pieces promoted on TikTok. Place your order by email for a clear, detailed order brief.</p>
            <div className="flex gap-4"><a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="Nicky Collections on TikTok" className="w-10 h-10 border border-white/10 flex items-center justify-center text-brand-gray hover:text-brand-pink hover:border-brand-pink transition-all"><FaTiktok size={16} /></a><a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email Nicky Collections" className="w-10 h-10 border border-white/10 flex items-center justify-center text-brand-gray hover:text-brand-pink hover:border-brand-pink transition-all"><FiMail size={16} /></a><a href="https://instagram.com/nickycollections" target="_blank" rel="noreferrer" aria-label="Nicky Collections on Instagram" className="w-10 h-10 border border-white/10 flex items-center justify-center text-brand-gray hover:text-pink-400 hover:border-pink-400 transition-all"><FaInstagram size={16} /></a></div>
          </div>

          <div><h4 className="label-tag text-brand-light mb-6">Shop</h4><ul className="space-y-3">
            {[{ label: 'All Products', href: '/shop' }, { label: 'Footwear', href: '/collections/footwear' }, { label: 'Outerwear', href: '/collections/outerwear' }, { label: 'Accessories', href: '/collections/accessories' }, { label: 'New Arrivals', href: '/collections/new-arrivals' }, { label: 'Featured', href: '/collections/featured' }, { label: 'Sale', href: '/collections/sale' }, { label: 'Brands', href: '/brands' }].map(item => <li key={item.label}><Link href={item.href} className="font-body text-sm text-brand-gray hover:text-brand-light transition-colors">{item.label}</Link></li>)}
          </ul></div>

          <div><h4 className="label-tag text-brand-light mb-6">Help</h4><ul className="space-y-3">
            {[{ label: 'About Us', href: '/about' }, { label: 'Contact', href: '/contact' }, { label: 'Email Us', href: `mailto:${CONTACT_EMAIL}`, external: true }, { label: 'TikTok Shop', href: TIKTOK_URL, external: true }].map(item => <li key={item.label}>{item.external ? <a href={item.href} target={item.href.startsWith('mailto:') ? undefined : '_blank'} rel={item.href.startsWith('mailto:') ? undefined : 'noreferrer'} className="font-body text-sm text-brand-gray hover:text-brand-light transition-colors">{item.label}</a> : <Link href={item.href} className="font-body text-sm text-brand-gray hover:text-brand-light transition-colors">{item.label}</Link>}</li>)}
          </ul></div>

          <div><h4 className="label-tag text-brand-light mb-6">Contact Us</h4><div className="space-y-4">
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 text-sm text-brand-gray hover:text-brand-pink transition-colors"><FiMail size={16} className="text-brand-gold" /><span>{CONTACT_EMAIL}</span></a>
            <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-brand-gray hover:text-brand-pink transition-colors"><FaTiktok size={14} className="text-brand-pink" /><span>@shopwithnickycollections</span></a>
          </div></div>
        </div>
      </div>
      <div className="border-t border-white/5 px-6 md:px-8 py-5"><div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3"><p className="font-body text-xs text-brand-gray tracking-wide">© {new Date().getFullYear()} Nicky Collections. All rights reserved.</p><p className="font-body text-xs text-brand-gray">Designed with <span className="text-brand-pink">♥</span> for fashion lovers</p></div></div>
    </footer>
  );
}
