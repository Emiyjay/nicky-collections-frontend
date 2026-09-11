import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiHeart, FiEye, FiStar, FiArrowUpRight } from 'react-icons/fi';
import { usersAPI } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, index = 0, priority = false }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const { user } = useAuth();

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to save items');
      return;
    }
    if (wishlistBusy) return;

    setWishlistBusy(true);
    try {
      const res = await usersAPI.toggleWishlist(product._id);
      setWishlisted(res.data.added);
      toast.success(res.data.added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setWishlistBusy(false);
    }
  };

  const mainImage = product.images?.[0]?.url || '/placeholder.jpg';
  const secondImage = product.images?.[1]?.url;
  const productPath = `/product/${product.slug || product._id}`;
  const price = Number(product.price) || 0;
  const comparePrice = Number(product.comparePrice) || 0;
  const hasSale = comparePrice > price;
  const rating = Number(product.rating) || 0;
  const reviews = Number(product.numReviews) || 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 7) * 0.06, duration: 0.45 }}
      className="group relative"
    >
      <div className="relative overflow-hidden bg-brand-muted border border-white/5 transition-all duration-300 group-hover:border-white/15 group-hover:-translate-y-0.5">
        <Link href={productPath} aria-label={`View ${product.name}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={mainImage}
              alt={product.images?.[0]?.alt || product.name}
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
              priority={priority}
            />
            {secondImage && (
              <Image
                src={secondImage}
                alt=""
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
            )}
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 pointer-events-none">
              <div className="flex flex-col items-start gap-1.5">
                {hasSale && (
                  <span className="bg-brand-light text-brand-dark px-2.5 py-1 text-[9px] font-body font-bold tracking-[0.16em] uppercase">
                    Sale
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="bg-brand-pink text-white px-2.5 py-1 text-[9px] font-body font-bold tracking-[0.16em] uppercase">
                    New
                  </span>
                )}
                {product.isFeatured && !hasSale && (
                  <span className="bg-brand-gold text-brand-dark px-2.5 py-1 text-[9px] font-body font-bold tracking-[0.16em] uppercase">
                    Featured
                  </span>
                )}
              </div>
              {hasSale && (
                <span className="bg-brand-dark/80 backdrop-blur-sm text-white px-2.5 py-1 text-[9px] font-body font-semibold tracking-[0.12em]">
                  -{Math.round(((comparePrice - price) / comparePrice) * 100)}%
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleWishlist}
              disabled={wishlistBusy}
              aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
              aria-pressed={wishlisted}
              className={`absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center border backdrop-blur-md transition-all duration-300 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink ${
                wishlisted
                  ? 'border-brand-pink/50 bg-brand-dark/90 text-brand-pink'
                  : 'border-white/15 bg-brand-dark/65 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:border-brand-pink/60'
              }`}
            >
              <FiHeart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 pointer-events-none">
              <div className="flex items-center justify-center gap-2 bg-brand-dark/90 px-4 py-3 text-[10px] font-body font-semibold tracking-[0.2em] uppercase text-white backdrop-blur-md">
                <FiEye size={13} /> Quick view
              </div>
            </div>
          </div>
        </Link>

        <div className="border-t border-white/5 bg-brand-card p-4 md:p-5">
          <Link href={productPath} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2 focus-visible:ring-offset-brand-card">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="label-tag text-brand-pink truncate">{product.brand || product.category || 'Collection'}</p>
              {product.inStock === false && <span className="text-[9px] font-body uppercase tracking-wider text-brand-gray">Sold out</span>}
            </div>
            <h3 className="min-h-[2.6rem] font-body text-sm font-medium leading-snug text-brand-light line-clamp-2 transition-colors group-hover:text-white">
              {product.name}
            </h3>
            {reviews > 0 && (
              <div className="mt-2 flex items-center gap-1" aria-label={`${rating.toFixed(1)} out of 5 stars from ${reviews} reviews`}>
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={10} fill={i < Math.round(rating) ? 'currentColor' : 'none'} className={i < Math.round(rating) ? 'text-brand-gold' : 'text-brand-gray'} />
                ))}
                <span className="ml-1 text-[10px] text-brand-gray">({reviews})</span>
              </div>
            )}
            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="font-body text-base font-semibold text-brand-light">${price.toFixed(2)}</span>
                {hasSale && <span className="font-body text-xs text-brand-gray line-through">${comparePrice.toFixed(2)}</span>}
              </div>
              <span className="flex items-center gap-1 text-[9px] font-body font-semibold uppercase tracking-[0.16em] text-brand-pink">
                Shop <FiArrowUpRight size={11} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
