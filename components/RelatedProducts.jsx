import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { productsAPI } from '../lib/api';

export default function RelatedProducts({ productId, category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!productId) return;
    productsAPI.getRelated(productId)
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setProducts([]));
  }, [productId]);

  if (!products.length) return null;

  return (
    <section className="mt-20 border-t border-white/10 pt-12" aria-labelledby="related-products-heading">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <p className="label-tag text-brand-pink mb-2">You may also like</p>
          <h2 id="related-products-heading" className="font-display text-3xl font-light text-brand-light">
            More from this collection
          </h2>
        </div>
        {category && (
          <Link href={`/collections/${category}`} className="label-tag text-brand-gray hover:text-brand-light transition-colors shrink-0">
            Shop {category} →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((item, index) => <ProductCard key={item._id} product={item} index={index} />)}
      </div>
    </section>
  );
}
