import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../lib/api';

const CATEGORIES = ['all', 'footwear', 'outerwear', 'accessories', 'clothing', 'collectibles', 'other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Shop() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (router.query.category) setCategory(router.query.category);
    if (router.query.search) setSearch(router.query.search);
    if (router.query.sort) setSort(router.query.sort);
  }, [router.query]);

  useEffect(() => {
    fetchProducts();
  }, [category, sort, minPrice, maxPrice, search, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (category && category !== 'all') params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (search) params.search = search;

      const res = await productsAPI.getAll(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setCategory('all');
    setSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
    setPage(1);
  };

  return (
    <>
      <Head>
        <title>Shop — Nicky Collections</title>
        <meta name="description" content="Shop all products from Nicky Collections. Shoes, jackets, accessories and more." />
      </Head>

      {/* Header */}
      <div className="pt-16 pb-10 px-6 md:px-8 max-w-7xl mx-auto border-b border-white/5">
        <p className="label-tag text-brand-pink mb-3">Nicky Collections</p>
        <div className="flex items-end justify-between">
          <h1 className="section-title">Shop</h1>
          <span className="font-body text-sm text-brand-gray">{total} products</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 shrink-0 ${filterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-8">
              {/* Search */}
              <div>
                <h3 className="label-tag text-brand-light mb-4">Search</h3>
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search products..."
                  className="input-field text-sm w-full"
                />
              </div>

              {/* Category */}
              <div>
                <h3 className="label-tag text-brand-light mb-4">Category</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setCategory(cat); setPage(1); }}
                      className={`block w-full text-left font-body text-sm py-2 px-3 transition-all
                        ${category === cat
                          ? 'bg-brand-pink text-white'
                          : 'text-brand-gray hover:text-brand-light hover:bg-white/5'
                        }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <h3 className="label-tag text-brand-light mb-4">Price Range</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={e => { setMinPrice(e.target.value); setPage(1); }}
                    placeholder="Min $"
                    className="input-field text-sm w-full"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
                    placeholder="Max $"
                    className="input-field text-sm w-full"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="label-tag text-brand-light mb-4">Sort By</h3>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => { setSort(e.target.value); setPage(1); }}
                    className="input-field text-sm w-full appearance-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" size={16} />
                </div>
              </div>

              <button onClick={clearFilters} className="btn-outline w-full text-xs flex items-center justify-center gap-2">
                <FiX size={14} />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products grid */}
          <div className="flex-1">
            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="btn-outline text-xs flex items-center gap-2"
              >
                <FiFilter size={14} />
                {filterOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-brand-card animate-pulse">
                    <div className="aspect-[3/4] bg-brand-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-brand-muted w-1/3 rounded" />
                      <div className="h-4 bg-brand-muted w-3/4 rounded" />
                      <div className="h-4 bg-brand-muted w-1/2 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32">
                <div className="text-5xl mb-6">🔍</div>
                <h3 className="font-display text-3xl text-brand-light mb-3">No Products Found</h3>
                <p className="font-body text-brand-gray mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product, i) => (
                    <ProductCard key={product._id} product={product} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="btn-outline text-xs px-4 py-2 disabled:opacity-30"
                    >
                      Prev
                    </button>
                    {[...Array(pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-9 h-9 text-sm font-body ${
                          page === i + 1
                            ? 'bg-brand-pink text-white'
                            : 'border border-white/10 text-brand-gray hover:text-brand-light'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={page === pages}
                      onClick={() => setPage(p => p + 1)}
                      className="btn-outline text-xs px-4 py-2 disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
