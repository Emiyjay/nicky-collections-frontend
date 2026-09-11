import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTiktok, FaInstagram } from 'react-icons/fa';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import { TIKTOK_URL } from '../lib/contact';
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from '../lib/site';

export default function About() {
  return (
    <>
      <Head>
        <title>About — {SITE_NAME}</title>
        <meta name="description" content="Learn about Nicky Collections, a fashion store focused on exclusive drops and carefully curated pieces." />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`About — ${SITE_NAME}`} />
        <meta property="og:description" content="Discover the story and curated fashion approach behind Nicky Collections." />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`About — ${SITE_NAME}`} />
        <meta name="twitter:description" content="Discover the story and curated fashion approach behind Nicky Collections." />
      </Head>

      <section className="pt-32 pb-20 px-6 md:px-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p className="label-tag text-brand-pink mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-brand-light leading-none mb-8">
            Fashion<br /><span className="italic text-brand-pink">Curated</span><br />For You
          </h1>
          <p className="font-body text-brand-gray text-xl leading-relaxed max-w-2xl">
            Nicky Collections was born from a passion for exclusive fashion drops and the power of TikTok culture. We hand-pick the most exciting pieces — from limited-edition sneakers to statement jackets and lifestyle accessories — and bring them directly to you.
          </p>
        </motion.div>
      </section>

      <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '01', title: 'Curated Selection', desc: 'Every product is hand-picked and reviewed before it reaches the shop. No filler — only pieces worth discovering.' },
            { icon: '02', title: 'Personal Service', desc: 'Order directly by email with a clear product brief, selected options and product pictures for a simple, human shopping experience.' },
            { icon: '03', title: 'TikTok-First', desc: 'We spot trends on TikTok and bring them to the store. Follow us to discover new drops as they arrive.' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass-card p-8">
              <div className="font-body text-xs tracking-[0.2em] text-brand-pink mb-5">{item.icon}</div>
              <h3 className="font-display text-2xl text-brand-light mb-3">{item.title}</h3>
              <p className="font-body text-brand-gray leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-8 max-w-4xl mx-auto text-center">
        <h2 className="section-title mb-6">Let&apos;s Connect</h2>
        <p className="font-body text-brand-gray text-lg mb-10 max-w-xl mx-auto">
          Follow us on TikTok for weekly drops, or email us when you want to order an item or ask a question.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="btn-primary flex items-center gap-2">
            <FaTiktok size={14} /> Follow on TikTok
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn-outline flex items-center gap-2">
            <FiMail size={16} /> Email Us
          </a>
          <Link href="/shop" className="btn-outline flex items-center gap-2">
            Browse Shop <FiArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
