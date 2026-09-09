import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { blogAPI } from '../../lib/api';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '../../lib/site';

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    blogAPI.getPosts({ limit: 24 }).then(res => setPosts(res.data)).catch(() => setPosts([]));
  }, []);

  return (
    <>
      <Head>
        <title>Style Journal — {SITE_NAME}</title>
        <meta name="description" content={`Style guides, buying guides and fashion insights from ${SITE_NAME}.`} />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
      </Head>
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-20">
        <header className="max-w-3xl mb-14">
          <p className="label-tag text-brand-pink mb-4">THE JOURNAL</p>
          <h1 className="font-display text-5xl md:text-6xl text-brand-light font-light">Style, drops & culture.</h1>
          <p className="font-body text-brand-gray mt-5 leading-relaxed">Original guides and stories to help you shop smarter, style better and stay ahead of the next drop.</p>
        </header>
        {posts.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post._id} href={`/blog/${post.slug}`} className="glass-card overflow-hidden group">
                <div className="relative aspect-[16/10] bg-brand-card">
                  {post.coverImage?.url ? <Image src={post.coverImage.url} alt={post.coverImage.alt || post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : null}
                </div>
                <div className="p-6">
                  <p className="label-tag text-brand-pink">{post.category}</p>
                  <h2 className="font-display text-2xl text-brand-light mt-3 group-hover:text-brand-pink transition-colors">{post.title}</h2>
                  {post.excerpt && <p className="font-body text-sm text-brand-gray mt-3 line-clamp-3">{post.excerpt}</p>}
                  <p className="font-body text-xs text-brand-gray mt-5">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card p-10 text-center font-body text-brand-gray">The journal is being prepared. Check back soon.</div>
        )}
      </main>
    </>
  );
}
