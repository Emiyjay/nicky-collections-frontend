import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaTiktok, FaInstagram } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { TIKTOK_URL } from '../lib/whatsapp';
import { CONTACT_EMAIL } from '../lib/site';
import { contactOnEmail } from '../lib/whatsapp';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    contactOnEmail({
      name: data.get('name'),
      email: data.get('email'),
      subject: data.get('subject'),
      message: data.get('message'),
    });
  };

  return (
    <>
      <Head>
        <title>Contact — Nicky Collections</title>
      </Head>

      <section className="pt-32 pb-20 px-6 md:px-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <p className="label-tag text-brand-pink mb-4">Get In Touch</p>
          <h1 className="section-title">Contact Us</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-2xl text-brand-light mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="label-tag block mb-2">Your Name</label>
                <input id="contact-name" name="name" required placeholder="John Doe" className="input-field w-full" />
              </div>
              <div>
                <label htmlFor="contact-email" className="label-tag block mb-2">Email</label>
                <input id="contact-email" name="email" type="email" required placeholder="your@email.com" className="input-field w-full" />
              </div>
              <div>
                <label htmlFor="contact-subject" className="label-tag block mb-2">Subject</label>
                <input id="contact-subject" name="subject" required placeholder="Order inquiry, question..." className="input-field w-full" />
              </div>
              <div>
                <label htmlFor="contact-message" className="label-tag block mb-2">Message</label>
                <textarea id="contact-message" name="message" required rows={5} placeholder="How can we help?" className="input-field w-full resize-none" />
              </div>
              <button type="submit" className="bg-brand-pink hover:bg-brand-pink/90 text-white font-body font-semibold text-sm tracking-widest uppercase px-8 py-4 flex items-center gap-3 transition-colors">
                <FiMail size={18} />
                Open Email
              </button>
              <p className="font-body text-xs text-brand-gray">
                Your email app will open with the details already prepared for Nicky Collections.
              </p>
            </form>
          </div>

          <div className="space-y-8">
            <h2 className="font-display text-2xl text-brand-light">Find Us On</h2>

            {[
              {
                icon: FaTiktok,
                iconClass: 'text-brand-pink',
                label: 'TikTok',
                value: '@shopwithnickycollections',
                href: TIKTOK_URL,
                desc: 'Weekly drops and product showcases'
              },
              {
                icon: FiMail,
                iconClass: 'text-brand-gold',
                label: 'Email',
                value: CONTACT_EMAIL,
                href: `mailto:${CONTACT_EMAIL}`,
                desc: 'Orders, support and business inquiries'
              },
            ].map(contact => (
              <a key={contact.label} href={contact.href} target={contact.label === 'Email' ? undefined : '_blank'} rel={contact.label === 'Email' ? undefined : 'noreferrer'} className="flex gap-5 glass-card p-6 hover:border-brand-pink/30 transition-all group">
                <contact.icon size={24} className={`${contact.iconClass} mt-1 shrink-0`} />
                <div>
                  <p className="label-tag text-brand-light mb-1">{contact.label}</p>
                  <p className="font-body text-brand-light font-medium group-hover:text-brand-pink transition-colors">{contact.value}</p>
                  <p className="font-body text-xs text-brand-gray mt-1">{contact.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
