import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { productsAPI } from '../lib/api';

export default function RelatedProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!router.isReady || !router.asPath.startsWith('/product/')) return;

    const identifier = router.query.id;
    if (!identifier) return;

    let active = true;
    productsAPI.getRelated(identifier)
      .then((res) => {
        if (active) setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        if (active) setProducts([]);
      });

    return () => { active = false; };
  }, [router.isReady, router.asPath, router.query.id]);

  if (!router.isReady || !router.asPath.startsWith('/product/') || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 pb-20" aria-labelledby="related-products-title">
      <div className="border-t border-white/10 pt-14">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="label-tag text-brand-pink mb-2">You may also like</p>
            <h2 id="related-products-title" className="font-display text-3xl md:text-4xl font-light text-brand-light">
              Complete the collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 label-tag text-brand-gray hover:text-brand-light transition-colors"
          >
            Shop all <FiArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const href = `/product/${product.slug || product._id}`;
            const image = product.images?.[0];
            const hasSale = product.comparePrice && product.comparePrice > product.price;

            return (
              <article key={product._id} className="group min-w-0">
                <Link href={href} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-brand-card mb-4">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt || product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-brand-gray">No image</div>
                    )}
                    {hasSale && (
                      <span className="absolute top-3 left-3 bg-brand-pink text-white px-2 py-1 text-[10px] tracking-widest uppercase">
                        Sale
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {product.brand && <p className="label-tag text-brand-pink truncate">{product.brand}</p>}
                    <h3 className="font-body text-sm text-brand-light line-clamp-2 group-hover:text-brand-pink transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-lg text-brand-light">${Number(product.price).toFixed(2)}</span>
                        {hasSale && <span className="font-body text-xs text-brand-gray line-through">${Number(product.comparePrice).toFixed(2)}</span>}
                      </div>
                      {Number(product.numReviews) > 0 && (
                        <span className="flex items-center gap-1 text-xs text-brand-gray shrink-0" aria-label={`${product.rating} out of 5 stars`}>
                          <FiStar size={11} fill="currentColor" /> {Number(product.rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        <Link href="/shop" className="sm:hidden mt-8 flex items-center justify-center gap-2 btn-outline">
          Shop all <FiArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
