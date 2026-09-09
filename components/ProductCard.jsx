import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiHeart, FiEye, FiStar } from 'react-icons/fi';
import { usersAPI } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0 }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const { user } = useAuth();

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to save items'); return; }
    try {
      const res = await usersAPI.toggleWishlist(product._id);
      setWishlisted(res.data.added);
      toast.success(res.data.added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { toast.error('Something went wrong'); }
  };

  const mainImage = product.images?.[imgIdx]?.url || '/placeholder.jpg';
  const secondImage = product.images?.[1]?.url;
  const productPath = '/product/' + encodeURIComponent(product.slug || product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="card-product group"
    >
      <Link href={productPath}>
        <div className="relative overflow-hidden bg-brand-muted aspect-[3/4] img-zoom">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700"
            onMouseEnter={() => secondImage && setImgIdx(1)}
            onMouseLeave={() => setImgIdx(0)}
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNewArrival && (
              <span className="bg-brand-pink text-white text-[10px] tracking-widest uppercase px-2 py-1 font-body font-semibold">New</span>
            )}
            {product.isFeatured && (
              <span className="bg-brand-gold text-brand-dark text-[10px] tracking-widest uppercase px-2 py-1 font-body font-semibold">Featured</span>
            )}
          </div>
          <button
            onClick={handleWishlist}
            className={'absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-brand-dark/70 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-brand-pink ' + (wishlisted ? 'text-brand-pink' : 'text-brand-gray')}
          >
            <FiHeart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="w-full bg-brand-dark/90 backdrop-blur-sm text-white text-xs tracking-widest uppercase font-body font-semibold py-3 flex items-center justify-center gap-2 border-t border-white/10">
              <FiEye size={14} />
              View & Order
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="label-tag text-brand-pink mb-1">{product.brand || product.category}</p>
          <h3 className="font-body text-sm text-brand-light font-medium leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
            {product.name}
          </h3>
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={10}
                  fill={i < Math.round(product.rating) ? '#D4A843' : 'none'}
                  className={i < Math.round(product.rating) ? 'text-brand-gold' : 'text-brand-gray'}
                />
              ))}
              <span className="text-[10px] text-brand-gray ml-1">({product.numReviews})</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-body font-semibold text-brand-light">${product.price.toFixed(2)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="font-body text-xs text-brand-gray line-through">${product.comparePrice.toFixed(2)}</span>
              )}
            </div>
            <span className="font-body text-xs text-brand-pink tracking-widest uppercase">Order →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
