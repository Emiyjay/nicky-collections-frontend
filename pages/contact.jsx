import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaTiktok, FaInstagram } from 'react-icons/fa';
import { FiMail, FiMessageCircle, FiPhone } from 'react-icons/fi';
import { TIKTOK_URL, WHATSAPP_LINK, PHONE_LINK, SMS_LINK, contactOnWhatsApp } from '../lib/whatsapp';
import { CONTACT_EMAIL, DISPLAY_PHONE_NUMBER } from '../lib/site';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const subject = `${data.get('name')} — ${data.get('subject')}`;
    contactOnWhatsApp(subject);
  };

  return (
    <>
      <Head>
        <title>Contact Nicky Collections</title>
        <meta name="description" content="Contact Nicky Collections by WhatsApp, phone, SMS, email or social media for product questions and orders." />
      </Head>

      <section className="pt-32 pb-20 px-6 md:px-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="label-tag text-brand-pink mb-4">Get In Touch</p>
          <h1 className="section-title">Contact Us</h1>
          <p className="font-body text-brand-gray max-w-2xl mt-5 leading-relaxed">
            Ready to order, ask about availability, or discuss a product? Reach us through the channel that works best for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-2xl text-brand-light mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-tag block mb-2">Your Name</label>
                <input name="name" required placeholder="John Doe" className="input-field w-full" />
              </div>
              <div>
                <label className="label-tag block mb-2">Email</label>
                <input name="email" type="email" required placeholder="your@email.com" className="input-field w-full" />
              </div>
              <div>
                <label className="label-tag block mb-2">Subject</label>
                <input name="subject" required placeholder="Order inquiry, question..." className="input-field w-full" />
              </div>
              <div>
                <label className="label-tag block mb-2">Message</label>
                <textarea name="message" required rows={5} placeholder="How can we help?" className="input-field w-full resize-none" />
              </div>
              <button type="submit" className="bg-green-500 hover:bg-green-400 text-white font-body font-semibold text-sm tracking-widest uppercase px-8 py-4 flex items-center gap-3 transition-colors">
                <FaWhatsapp size={18} />
                Send via WhatsApp
              </button>
              <p className="font-body text-xs text-brand-gray">
                Your message will open in WhatsApp with the contact subject prepared for you.
              </p>
            </form>
          </div>

          <div className="space-y-5">
            <h2 className="font-display text-2xl text-brand-light mb-8">Choose How to Reach Us</h2>

            {[
              { icon: FaWhatsapp, iconClass: 'text-green-400', label: 'WhatsApp', value: DISPLAY_PHONE_NUMBER, href: WHATSAPP_LINK, desc: 'Fastest way to order or ask questions', external: true },
              { icon: FiPhone, iconClass: 'text-brand-gold', label: 'Call', value: DISPLAY_PHONE_NUMBER, href: PHONE_LINK, desc: 'Speak directly with us' },
              { icon: FiMessageCircle, iconClass: 'text-brand-gold', label: 'SMS', value: DISPLAY_PHONE_NUMBER, href: SMS_LINK, desc: 'Send a quick text message' },
              { icon: FaTiktok, iconClass: 'text-brand-pink', label: 'TikTok', value: '@shopwithnickycollections', href: TIKTOK_URL, desc: 'Weekly drops and product showcases', external: true },
              { icon: FaInstagram, iconClass: 'text-pink-400', label: 'Instagram', value: '@nickycollections', href: 'https://instagram.com/nickycollections', desc: 'Follow our latest looks', external: true },
              { icon: FiMail, iconClass: 'text-brand-gold', label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, desc: 'For business inquiries' },
            ].map(contact => {
              const Icon = contact.icon;
              return (
                <a key={contact.label} href={contact.href} {...(contact.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="flex gap-5 glass-card p-6 hover:border-brand-pink/30 transition-all group">
                  <Icon size={24} className={`${contact.iconClass} mt-1 shrink-0`} />
                  <div>
                    <p className="label-tag text-brand-light mb-1">{contact.label}</p>
                    <p className="font-body text-brand-light font-medium group-hover:text-brand-pink transition-colors">{contact.value}</p>
                    <p className="font-body text-xs text-brand-gray mt-1">{contact.desc}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
