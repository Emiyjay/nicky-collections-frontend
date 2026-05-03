import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTiktok, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { TIKTOK_URL, WHATSAPP_LINK } from '../lib/whatsapp';

export default function About() {
  return (
    <>
      <Head>
        <title>About — Nicky Collections</title>
        <meta name="description" content="Learn about Nicky Collections, your go-to fashion store for TikTok-promoted exclusive drops." />
      </Head>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="label-tag text-brand-pink mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-brand-light leading-none mb-8">
            Fashion<br />
            <span className="italic text-brand-pink">Curated</span><br />
            For You
          </h1>
          <p className="font-body text-brand-gray text-xl leading-relaxed max-w-2xl">
            Nicky Collections was born from a passion for exclusive fashion drops and the power of 
            TikTok culture. We hand-pick the most exciting pieces — from limited-edition sneakers 
            to statement jackets and lifestyle accessories — and bring them directly to you.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🎯',
              title: 'Curated Selection',
              desc: 'Every product is hand-picked and personally reviewed before it hits the shop. No filler — only fire pieces.'
            },
            {
              icon: '💬',
              title: 'Personal Service',
              desc: 'Order directly via WhatsApp for a personal, fast, and human shopping experience. No bots, no wait queues.'
            },
            {
              icon: '🔥',
              title: 'TikTok-First',
              desc: 'We spot trends on TikTok first and bring them to our store. Follow us to never miss a drop.'
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8"
            >
              <div className="text-4xl mb-5">{item.icon}</div>
              <h3 className="font-display text-2xl text-brand-light mb-3">{item.title}</h3>
              <p className="font-body text-brand-gray leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-8 max-w-4xl mx-auto text-center">
        <h2 className="section-title mb-6">Let's Connect</h2>
        <p className="font-body text-brand-gray text-lg mb-10 max-w-xl mx-auto">
          Follow us on TikTok for weekly drops, or reach out on WhatsApp to order any item directly.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href={TIKTOK_URL} target="_blank" rel="noreferrer"
            className="btn-primary flex items-center gap-2">
            <FaTiktok size={14} />
            Follow on TikTok
          </a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer"
            className="bg-green-500 hover:bg-green-400 text-white font-body font-semibold text-sm tracking-widest uppercase px-6 py-3 flex items-center gap-2 transition-colors">
            <FaWhatsapp size={16} />
            WhatsApp Us
          </a>
          <Link href="/shop" className="btn-outline flex items-center gap-2">
            Browse Shop <FiArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
