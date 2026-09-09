import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { blogAPI } from '../../lib/api';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '../../lib/site';
import ArticleStructuredData from '../../components/ArticleStructuredData';

export default function BlogArticle() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    blogAPI.getPost(slug).then(res => setPost(res.data)).catch(() => router.replace('/blog')).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <main className="min-h-screen flex items-center justify-center font-body text-brand-gray">Loading article...</main>;
  if (!post) return null;

  const title = post.seoTitle || `${post.title} — ${SITE_NAME}`;
  const description = post.seoDescription || post.excerpt || SITE_DESCRIPTION;
  const url = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description.slice(0, 160)} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {post.coverImage?.url && <meta property="og:image" content={post.coverImage.url} />}
      </Head>
      <ArticleStructuredData post={post} />
      <main className="max-w-4xl mx-auto px-6 md:px-8 pt-28 pb-24">
        <Link href="/blog" className="label-tag text-brand-pink hover:text-brand-light transition-colors">← Back to journal</Link>
        <article className="mt-10">
          <p className="label-tag text-brand-pink">{post.category}</p>
          <h1 className="font-display text-5xl md:text-6xl text-brand-light font-light leading-tight mt-4">{post.title}</h1>
          <div className="flex flex-wrap gap-4 font-body text-xs text-brand-gray mt-6">
            <span>By {post.authorName || SITE_NAME}</span>
            {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString()}</span>}
          </div>
          {post.coverImage?.url && (
            <div className="relative aspect-[16/9] mt-10 overflow-hidden bg-brand-card">
              <Image src={post.coverImage.url} alt={post.coverImage.alt || post.title} fill className="object-cover" priority />
            </div>
          )}
          {post.excerpt && <p className="font-body text-lg text-brand-gray leading-relaxed mt-10">{post.excerpt}</p>}
          <div className="mt-10 font-body text-brand-light leading-8 whitespace-pre-line">{post.content}</div>
          {post.tags?.length > 0 && <div className="flex flex-wrap gap-2 mt-12">{post.tags.map(tag => <span key={tag} className="text-xs text-brand-gray border border-white/10 px-3 py-1">#{tag}</span>)}</div>}
        </article>
      </main>
    </>
  );
}
