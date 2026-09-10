import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiShare2, FiArrowLeft, FiCheck, FiShield, FiTruck, FiMessageCircle, FiMail } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import { productsAPI, usersAPI } from '../../lib/api';
import { orderOnEmail, TIKTOK_URL } from '../../lib/whatsapp';
import { useAuth } from '../../lib/AuthContext';
import ProductStructuredData from '../../components/ProductStructuredData';
import { SITE_NAME, SITE_URL } from '../../lib/site';
import toast from 'react-hot-toast';

export default function ProductDetail({ initialProduct }) {
  const { user } = useAuth();
  const [product, setProduct] = useState(initialProduct);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(initialProduct.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(initialProduct.sizes?.[0] || '');
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const handleOrder = () => {
    orderOnEmail({ product, productName: product.name, price: product.price, userName: user?.name || null, color: selectedColor || null, size: selectedSize || null });
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      const res = await usersAPI.toggleWishlist(product._id);
      setWishlisted(res.data.added);
      toast.success(res.data.added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { toast.error('Something went wrong'); }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Product link copied');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') toast.error('Unable to share this product');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    if (!reviewComment.trim()) { toast.error('Please write a comment'); return; }
    setSubmittingReview(true);
    try {
      await productsAPI.addReview(product._id, { rating: reviewRating, comment: reviewComment });
      const res = await productsAPI.getOne(product._id);
      setProduct(res.data);
      toast.success('Review submitted');
      setReviewComment('');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review'); }
    finally { setSubmittingReview(false); }
  };

  const discount = product.comparePrice && product.comparePrice > product.price ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : null;
  const hasImages = product.images?.length > 0;
  const selectedImageUrl = product.images?.[selectedImage]?.url;
  const rating = Math.round(Number(product.rating) || 0);
  const identifier = product.slug || product._id;
  const canonicalUrl = `${SITE_URL}/product/${encodeURIComponent(identifier)}`;
  const description = product.description?.slice(0, 160) || `Shop ${product.name} from ${SITE_NAME}.`;

  return (
    <>
      <Head>
        <title>{product.name} — {SITE_NAME}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.name} — ${SITE_NAME}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        {selectedImageUrl && <meta property="og:image" content={selectedImageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} — ${SITE_NAME}`} />
        <meta name="twitter:description" content={description} />
        {selectedImageUrl && <meta name="twitter:image" content={selectedImageUrl} />}
      </Head>
      <ProductStructuredData product={product} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SITE_URL}/shop` },
          ...(product.category ? [{ '@type': 'ListItem', position: 3, name: product.category, item: `${SITE_URL}/shop?category=${encodeURIComponent(product.category)}` }] : []),
          { '@type': 'ListItem', position: product.category ? 4 : 3, name: product.name, item: canonicalUrl },
        ],
      }).replace(/</g, '\\u003c') }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-20 pb-28 lg:pb-20">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 overflow-hidden">
          <Link href="/shop" className="label-tag hover:text-brand-light transition-colors flex items-center gap-1 shrink-0"><FiArrowLeft size={12} /> Shop</Link>
          <span className="text-brand-gray/40" aria-hidden="true">/</span>
          <Link href={`/shop?category=${encodeURIComponent(product.category || '')}`} className="label-tag text-brand-gray hover:text-brand-light transition-colors shrink-0">{product.category}</Link>
          <span className="text-brand-gray/40" aria-hidden="true">/</span>
          <span className="label-tag text-brand-pink truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)] gap-10 xl:gap-16 items-start">
          <div className="space-y-4">
            <motion.div className="relative aspect-[4/5] overflow-hidden bg-brand-card border border-white/5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              {hasImages ? <Image src={selectedImageUrl} alt={product.images[selectedImage]?.alt || product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 58vw" /> : <div className="w-full h-full flex items-center justify-center text-brand-gray"><span className="text-6xl" aria-hidden="true">◌</span><span className="sr-only">No product image available</span></div>}
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 pointer-events-none">
                {discount ? <span className="bg-brand-pink text-white font-body font-bold text-xs px-3 py-1.5 tracking-widest uppercase">-{discount}%</span> : <span />}
                {product.isNewArrival && <span className="bg-brand-light text-brand-dark font-body font-semibold text-xs px-3 py-1.5 tracking-widest uppercase">New arrival</span>}
              </div>
            </motion.div>

            {hasImages && <div className="flex gap-3 overflow-x-auto pb-2" role="list" aria-label="Product images">{product.images.map((img, i) => <button key={i} type="button" onClick={() => setSelectedImage(i)} aria-label={`View product image ${i + 1}`} aria-current={selectedImage === i ? 'true' : undefined} className={`relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink ${selectedImage === i ? 'border-brand-pink' : 'border-white/10 hover:border-white/30'}`}><Image src={img.url} alt="" fill sizes="96px" className="object-cover" /></button>)}</div>}

            {product.videos?.length > 0 && <div className="space-y-3 pt-2"><p className="label-tag">Product video</p>{product.videos.map((video, i) => <video key={i} src={video.url} controls preload="metadata" className="w-full bg-brand-card border border-white/5" aria-label={`${product.name} video ${i + 1}`} />)}</div>}
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="glass-card p-5 sm:p-7 md:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">{product.brand && <span className="label-tag text-brand-pink">{product.brand}</span>}<span className="label-tag text-brand-gray">/ {product.category}</span>{product.isFeatured && <span className="label-tag text-brand-gold">Featured</span>}</div>
              <h1 className="font-display text-4xl md:text-5xl font-light text-brand-light leading-[0.95] mb-5">{product.name}</h1>

              {product.numReviews > 0 && <a href="#reviews" onClick={() => setActiveTab('reviews')} className="inline-flex items-center gap-2 mb-6 group"><span className="flex gap-1" aria-label={`${product.rating} out of 5 stars`}>{[...Array(5)].map((_, i) => <FiStar key={i} size={14} fill={i < rating ? 'currentColor' : 'none'} className={i < rating ? 'text-brand-gold' : 'text-brand-gray'} />)}</span><span className="font-body text-sm text-brand-gray group-hover:text-brand-light transition-colors">{product.rating?.toFixed?.(1) || product.rating} · {product.numReviews} reviews</span></a>}

              <div className="flex items-baseline gap-4 mb-7"><span className="font-display text-4xl md:text-5xl font-medium text-brand-light">${Number(product.price).toFixed(2)}</span>{product.comparePrice && product.comparePrice > product.price && <span className="font-body text-base text-brand-gray line-through">${Number(product.comparePrice).toFixed(2)}</span>}{discount && <span className="label-tag text-brand-pink">Save {discount}%</span>}</div>

              <div className="h-px bg-white/10 mb-7" />

              {product.colors?.length > 0 && <fieldset className="mb-6"><legend className="label-tag text-brand-light mb-3">Color: <span className="text-brand-gray normal-case tracking-normal">{selectedColor}</span></legend><div className="flex flex-wrap gap-2">{product.colors.map(color => <button key={color} type="button" onClick={() => setSelectedColor(color)} aria-pressed={selectedColor === color} className={`px-4 py-2.5 font-body text-xs tracking-widest uppercase border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink ${selectedColor === color ? 'border-brand-pink text-brand-pink bg-brand-pink/10' : 'border-white/10 text-brand-gray hover:border-white/30'}`}>{color}</button>)}</div></fieldset>}

              {product.sizes?.length > 0 && <fieldset className="mb-7"><legend className="label-tag text-brand-light mb-3">Size: <span className="text-brand-gray normal-case tracking-normal">{selectedSize}</span></legend><div className="flex flex-wrap gap-2">{product.sizes.map(size => <button key={size} type="button" onClick={() => setSelectedSize(size)} aria-pressed={selectedSize === size} className={`min-w-12 h-12 px-3 font-body text-sm border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink ${selectedSize === size ? 'border-brand-pink text-brand-pink bg-brand-pink/10' : 'border-white/10 text-brand-gray hover:border-white/30'}`}>{size}</button>)}</div></fieldset>}

              <div className={`flex items-center justify-between gap-3 mb-7 p-3 border ${product.inStock ? 'border-green-400/20 bg-green-400/5 text-green-400' : 'border-red-400/20 bg-red-400/5 text-red-400'}`}><span className="flex items-center gap-2"><FiCheck size={14} /><span className="font-body text-xs tracking-widest uppercase">{product.inStock ? 'In stock' : 'Currently unavailable'}</span></span>{product.stockCount > 0 && product.stockCount <= 5 && <span className="font-body text-xs text-brand-gray">Only {product.stockCount} left</span>}</div>

              <div className="space-y-3">
                <button onClick={handleOrder} disabled={!product.inStock} className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-body font-semibold text-sm tracking-widest uppercase py-4 flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"><FiMail size={18} /> Order by Email</button>
                <p className="font-body text-xs leading-5 text-brand-gray">Your email will be pre-filled with the product name, price, description, product image links and page link so we can confirm your order.</p>
                <div className="grid grid-cols-[1fr_auto] gap-3"><button onClick={handleWishlist} className={`btn-outline flex items-center justify-center gap-2 ${wishlisted ? 'border-brand-pink text-brand-pink' : ''}`} aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}><FiHeart size={16} fill={wishlisted ? 'currentColor' : 'none'} />{wishlisted ? 'Saved' : 'Wishlist'}</button><button onClick={handleShare} className="btn-outline px-4" aria-label="Share product"><FiShare2 size={16} /></button></div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-7 pt-7 border-t border-white/10">
                <div className="text-center"><FiMessageCircle className="mx-auto mb-2 text-brand-pink" size={17} /><p className="font-body text-[10px] text-brand-gray uppercase tracking-wider">Direct email</p></div>
                <div className="text-center"><FiShield className="mx-auto mb-2 text-brand-gold" size={17} /><p className="font-body text-[10px] text-brand-gray uppercase tracking-wider">Personal service</p></div>
                <div className="text-center"><FiTruck className="mx-auto mb-2 text-brand-light" size={17} /><p className="font-body text-[10px] text-brand-gray uppercase tracking-wider">Order support</p></div>
              </div>
            </div>

            {product.tiktokLink && <a href={product.tiktokLink} target="_blank" rel="noreferrer" className="flex items-center justify-between mt-4 px-5 py-4 border border-white/10 hover:border-brand-pink/40 transition-colors"><span className="flex items-center gap-2 text-brand-gray"><FaTiktok size={14} className="text-brand-pink" /><span className="font-body text-xs tracking-widest uppercase">See this product on TikTok</span></span><span className="text-brand-gray">↗</span></a>}
            {!product.tiktokLink && <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className="flex items-center justify-between mt-4 px-5 py-4 border border-white/10 hover:border-brand-pink/40 transition-colors"><span className="flex items-center gap-2 text-brand-gray"><FaTiktok size={14} className="text-brand-pink" /><span className="font-body text-xs tracking-widest uppercase">Follow the latest drops</span></span><span className="text-brand-gray">↗</span></a>}
          </div>
        </div>

        {product.tags?.length > 0 && <div className="mt-8 flex flex-wrap gap-2">{product.tags.map(tag => <span key={tag} className="font-body text-xs text-brand-gray border border-white/10 px-3 py-1.5">#{tag}</span>)}</div>}

        <section className="mt-16 md:mt-24 border-t border-white/10 pt-10 md:pt-12" id="reviews">
          <div className="flex gap-8 border-b border-white/10 mb-10 overflow-x-auto" role="tablist" aria-label="Product information">
            {['description', 'reviews'].map(tab => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={`pb-4 whitespace-nowrap font-body text-sm tracking-widest uppercase border-b-2 transition-all -mb-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink ${activeTab === tab ? 'border-brand-pink text-brand-light' : 'border-transparent text-brand-gray hover:text-brand-light'}`}>{tab} {tab === 'reviews' && `(${product.numReviews})`}</button>)}
          </div>
          {activeTab === 'description' && <div className="max-w-3xl"><p className="font-body text-brand-gray leading-8 whitespace-pre-line">{product.description || 'No description is available for this product yet.'}</p></div>}
          {activeTab === 'reviews' && <div className="max-w-3xl space-y-8">{product.reviews?.length > 0 ? product.reviews.map(review => <article key={review._id} className="border-b border-white/10 pb-8"><div className="flex items-center justify-between gap-4 mb-3"><div><p className="font-body text-sm font-semibold text-brand-light">{review.name}</p><div className="flex gap-1 mt-1" aria-label={`${review.rating} out of 5 stars`}>{[...Array(5)].map((_, i) => <FiStar key={i} size={11} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? 'text-brand-gold' : 'text-brand-gray'} />)}</div></div><time dateTime={review.createdAt} className="font-body text-xs text-brand-gray">{new Date(review.createdAt).toLocaleDateString()}</time></div><p className="font-body text-sm text-brand-gray leading-7">{review.comment}</p></article>) : <p className="font-body text-brand-gray">No reviews yet. Be the first to share your experience.</p>}
            {user && <div className="glass-card p-6 md:p-8"><h3 className="label-tag text-brand-light mb-6">Write a review</h3><form onSubmit={submitReview} className="space-y-5"><div><label className="label-tag mb-3 block">Rating</label><div className="flex gap-2">{[1,2,3,4,5].map(r => <button key={r} type="button" onClick={() => setReviewRating(r)} aria-label={`${r} star${r > 1 ? 's' : ''}`} aria-pressed={r === reviewRating}><FiStar size={22} fill={r <= reviewRating ? 'currentColor' : 'none'} className={r <= reviewRating ? 'text-brand-gold' : 'text-brand-gray hover:text-brand-gold'} /></button>)}</div></div><textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Share your experience..." rows={5} maxLength={1000} className="input-field resize-none w-full" aria-label="Review comment" /><div className="flex items-center justify-between gap-4"><span className="font-body text-xs text-brand-gray">{reviewComment.length}/1000</span><button type="submit" disabled={submittingReview} className="btn-primary">{submittingReview ? 'Submitting...' : 'Submit review'}</button></div></form></div>}
          </div>}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 p-3 bg-brand-dark/95 backdrop-blur-xl border-t border-white/10 lg:hidden safe-area-bottom" aria-label="Mobile purchase actions">
        <div className="max-w-7xl mx-auto grid grid-cols-[1fr_auto] gap-2"><button onClick={handleOrder} disabled={!product.inStock} className="bg-brand-pink hover:bg-brand-pink/90 text-white font-body font-semibold text-xs tracking-widest uppercase py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><FiMail size={17} /> Order by Email</button><button onClick={handleWishlist} className="w-12 border border-white/10 flex items-center justify-center text-brand-light" aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}><FiHeart size={18} fill={wishlisted ? 'currentColor' : 'none'} className={wishlisted ? 'text-brand-pink' : ''} /></button></div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const identifier = Array.isArray(context.params?.id) ? context.params.id[0] : context.params?.id;
  if (!identifier) return { notFound: true };

  try {
    const response = await productsAPI.getOne(identifier);
    if (!response.data) return { notFound: true };
    return { props: { initialProduct: response.data } };
  } catch (error) {
    if (error.response?.status === 404) return { notFound: true };
    return { notFound: true };
  }
}
