import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiShare2, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { productsAPI, usersAPI } from '../../lib/api';
import { orderOnWhatsApp, TIKTOK_URL } from '../../lib/whatsapp';
import { useAuth } from '../../lib/AuthContext';
import ProductStructuredData from '../../components/ProductStructuredData';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (!id) return;
    productsAPI.getOne(id).then(res => {
      setProduct(res.data);
      if (res.data.colors?.length > 0) setSelectedColor(res.data.colors[0]);
      if (res.data.sizes?.length > 0) setSelectedSize(res.data.sizes[0]);
    }).catch(() => router.push('/shop')).finally(() => setLoading(false));
  }, [id]);

  const handleOrder = () => {
    if (!product) return;
    orderOnWhatsApp({ productName: product.name, price: product.price, userName: user?.name || null, color: selectedColor || null, size: selectedSize || null });
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      const res = await usersAPI.toggleWishlist(product._id);
      setWishlisted(res.data.added);
      toast.success(res.data.added ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    } catch { toast.error('Something went wrong'); }
  };

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: product.name, url: window.location.href });
    else { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    if (!reviewComment.trim()) { toast.error('Please write a comment'); return; }
    setSubmittingReview(true);
    try {
      await productsAPI.addReview(product._id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      const res = await productsAPI.getOne(product._id);
      setProduct(res.data);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review'); }
    finally { setSubmittingReview(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return null;

  const discount = product.comparePrice && product.comparePrice > product.price ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : null;

  return (
    <>
      <Head>
        <title>{product.name} — Nicky Collections</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
      </Head>
      <ProductStructuredData product={product} />

      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-20">
        <div className="flex items-center gap-2 mb-10">
          <Link href="/shop" className="label-tag hover:text-brand-light transition-colors flex items-center gap-1"><FiArrowLeft size={12} />Shop</Link>
          <span className="text-brand-gray/40">/</span><span className="label-tag text-brand-gray">{product.category}</span>
          <span className="text-brand-gray/40">/</span><span className="label-tag text-brand-pink line-clamp-1 max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-4">
            <motion.div className="relative aspect-square overflow-hidden bg-brand-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {product.images?.[selectedImage] ? <Image src={product.images[selectedImage].url} alt={product.name} fill className="object-cover" priority /> : <div className="w-full h-full flex items-center justify-center text-brand-gray"><span className="text-6xl">👟</span></div>}
              {discount && <div className="absolute top-4 left-4 bg-brand-pink text-white font-body font-bold text-xs px-3 py-1 tracking-widest uppercase">-{discount}%</div>}
            </motion.div>
            {product.images?.length > 1 && <div className="flex gap-3 overflow-x-auto pb-2">{product.images.map((img, i) => <button key={i} onClick={() => setSelectedImage(i)} className={`relative w-20 h-20 shrink-0 overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-brand-pink' : 'border-white/10 hover:border-white/30'}`}><Image src={img.url} alt="" fill className="object-cover" /></button>)}</div>}
            {product.videos?.length > 0 && <div className="space-y-3">{product.videos.map((video, i) => <video key={i} src={video.url} controls className="w-full bg-brand-card" />)}</div>}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">{product.brand && <span className="label-tag text-brand-pink">{product.brand}</span>}<span className="label-tag">/ {product.category}</span>{product.isNewArrival && <span className="bg-brand-pink text-white text-[10px] tracking-widest uppercase px-2 py-1 font-body">New</span>}</div>
            <h1 className="font-display text-3xl md:text-4xl font-light text-brand-light leading-tight mb-4">{product.name}</h1>

            {product.numReviews > 0 && <div className="flex items-center gap-2 mb-6"><div className="flex gap-1">{[...Array(5)].map((_, i) => <FiStar key={i} size={14} fill={i < Math.round(product.rating) ? '#D4A843' : 'none'} className={i < Math.round(product.rating) ? 'text-brand-gold' : 'text-brand-gray'} />)}</div><span className="font-body text-sm text-brand-gray">({product.numReviews} reviews)</span></div>}

            <div className="flex items-baseline gap-4 mb-8"><span className="font-display text-4xl font-medium text-brand-light">${product.price.toFixed(2)}</span>{product.comparePrice && product.comparePrice > product.price && <span className="font-body text-lg text-brand-gray line-through">${product.comparePrice.toFixed(2)}</span>}</div>

            {product.colors?.length > 0 && <div className="mb-6"><p className="label-tag text-brand-light mb-3">Color: <span className="text-brand-gray">{selectedColor}</span></p><div className="flex flex-wrap gap-2">{product.colors.map(color => <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 font-body text-xs tracking-widest uppercase border transition-all ${selectedColor === color ? 'border-brand-pink text-brand-pink bg-brand-pink/10' : 'border-white/10 text-brand-gray hover:border-white/30'}`}>{color}</button>)}</div></div>}

            {product.sizes?.length > 0 && <div className="mb-8"><p className="label-tag text-brand-light mb-3">Size: <span className="text-brand-gray">{selectedSize}</span></p><div className="flex flex-wrap gap-2">{product.sizes.map(size => <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 font-body text-sm border transition-all ${selectedSize === size ? 'border-brand-pink text-brand-pink bg-brand-pink/10' : 'border-white/10 text-brand-gray hover:border-white/30'}`}>{size}</button>)}</div></div>}

            <div className={`flex items-center gap-2 mb-8 ${product.inStock ? 'text-green-400' : 'text-red-400'}`}><FiCheck size={14} /><span className="font-body text-sm tracking-widest uppercase">{product.inStock ? 'In Stock' : 'Out of Stock'}</span></div>

            <div className="space-y-3 mb-8"><button onClick={handleOrder} disabled={!product.inStock} className="w-full bg-green-500 hover:bg-green-400 text-white font-body font-semibold text-sm tracking-widest uppercase py-4 flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><FaWhatsapp size={18} />Order on WhatsApp</button><div className="flex gap-3"><button onClick={handleWishlist} className={`flex-1 btn-outline flex items-center justify-center gap-2 ${wishlisted ? 'border-brand-pink text-brand-pink' : ''}`}><FiHeart size={16} fill={wishlisted ? 'currentColor' : 'none'} />{wishlisted ? 'Saved' : 'Wishlist'}</button><button onClick={handleShare} className="btn-outline flex items-center gap-2 px-4"><FiShare2 size={16} /></button></div></div>

            {product.tiktokLink && <a href={product.tiktokLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-brand-gray hover:text-brand-pink transition-colors mb-8"><FaTiktok size={14} className="text-brand-pink" /><span className="font-body text-xs tracking-widest uppercase">View on TikTok</span></a>}
            {product.tags?.length > 0 && <div className="flex flex-wrap gap-2">{product.tags.map(tag => <span key={tag} className="font-body text-xs text-brand-gray border border-white/10 px-3 py-1">#{tag}</span>)}</div>}
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-12"><div className="flex gap-8 border-b border-white/10 mb-10">{['description', 'reviews'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 font-body text-sm tracking-widest uppercase border-b-2 transition-all -mb-[1px] ${activeTab === tab ? 'border-brand-pink text-brand-light' : 'border-transparent text-brand-gray'}`}>{tab} {tab === 'reviews' && `(${product.numReviews})`}</button>)}</div>
          {activeTab === 'description' && <div className="max-w-3xl"><p className="font-body text-brand-gray leading-relaxed whitespace-pre-line">{product.description}</p></div>}
          {activeTab === 'reviews' && <div className="max-w-3xl space-y-8">{product.reviews?.map(review => <div key={review._id} className="border-b border-white/10 pb-8"><div className="flex items-center justify-between mb-3"><div><p className="font-body text-sm font-semibold text-brand-light">{review.name}</p><div className="flex gap-1 mt-1">{[...Array(5)].map((_, i) => <FiStar key={i} size={11} fill={i < review.rating ? '#D4A843' : 'none'} className={i < review.rating ? 'text-brand-gold' : 'text-brand-gray'} />)}</div></div><span className="font-body text-xs text-brand-gray">{new Date(review.createdAt).toLocaleDateString()}</span></div><p className="font-body text-sm text-brand-gray">{review.comment}</p></div>)}
            {user && <div className="glass-card p-6"><h3 className="label-tag text-brand-light mb-6">Write a Review</h3><form onSubmit={submitReview} className="space-y-4"><div><label className="label-tag mb-2 block">Rating</label><div className="flex gap-2">{[1,2,3,4,5].map(r => <button key={r} type="button" onClick={() => setReviewRating(r)}><FiStar size={22} fill={r <= reviewRating ? '#D4A843' : 'none'} className={r <= reviewRating ? 'text-brand-gold' : 'text-brand-gray hover:text-brand-gold'} /></button>)}</div></div><textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Share your experience..." rows={4} className="input-field resize-none w-full" /><button type="submit" disabled={submittingReview} className="btn-primary">{submittingReview ? 'Submitting...' : 'Submit Review'}</button></form></div>}
          </div>}
        </div>
      </div>
    </>
  );
}
