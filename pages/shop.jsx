import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown, FiSearch, FiSliders, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../lib/api';

const CATEGORIES = ['all', 'footwear', 'outerwear', 'accessories', 'clothing', 'collectibles', 'other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const categoryLabel = (value) => value === 'all' ? 'All Products' : value.charAt(0).toUpperCase() + value.slice(1);

function SkeletonCard() {
  return <div className="overflow-hidden border border-white/5 bg-brand-card" aria-hidden="true">
    <div className="aspect-[4/5] bg-brand-muted animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-2 w-1/3 bg-brand-muted animate-pulse" />
      <div className="h-4 w-3/4 bg-brand-muted animate-pulse" />
      <div className="h-3 w-1/2 bg-brand-muted animate-pulse" />
    </div>
  </div>;
}

export default function Shop() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');
  const [searchDraft, setSearchDraft] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query;
    setCategory(CATEGORIES.includes(q.category) ? q.category : 'all');
    setSearch(typeof q.search === 'string' ? q.search : '');
    setSearchDraft(typeof q.search === 'string' ? q.search : '');
    setSort(SORT_OPTIONS.some((item) => item.value === q.sort) ? q.sort : 'newest');
    setPage(Number(q.page) > 0 ? Number(q.page) : 1);
    setMinPrice(typeof q.minPrice === 'string' ? q.minPrice : '');
    setMaxPrice(typeof q.maxPrice === 'string' ? q.maxPrice : '');
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!router.isReady) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    const params = { page, limit: 12, sort };
    if (category !== 'all') params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (search.trim()) params.search = search.trim();

    productsAPI.getAll(params)
      .then((res) => {
        if (cancelled) return;
        setProducts(Array.isArray(res.data?.products) ? res.data.products : []);
        setTotal(Number(res.data?.total) || 0);
        setPages(Math.max(1, Number(res.data?.pages) || 1));
      })
      .catch(() => { if (!cancelled) { setProducts([]); setTotal(0); setPages(1); setError(true); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [router.isReady, category, sort, minPrice, maxPrice, search, page]);

  const updateUrl = (updates = {}) => {
    const next = { category, sort, minPrice, maxPrice, search, page, ...updates };
    const query = {};
    if (next.category !== 'all') query.category = next.category;
    if (next.sort !== 'newest') query.sort = next.sort;
    if (next.minPrice) query.minPrice = next.minPrice;
    if (next.maxPrice) query.maxPrice = next.maxPrice;
    if (next.search.trim()) query.search = next.search.trim();
    if (next.page > 1) query.page = String(next.page);
    router.push({ pathname: '/shop', query }, undefined, { shallow: true, scroll: false });
  };

  const clearFilters = () => {
    setCategory('all'); setSort('newest'); setMinPrice(''); setMaxPrice(''); setSearch(''); setSearchDraft(''); setPage(1);
    router.push('/shop', undefined, { shallow: true });
  };

  const applySearch = (e) => {
    e.preventDefault();
    setPage(1); setSearch(searchDraft.trim());
    updateUrl({ search: searchDraft.trim(), page: 1 });
  };

  const activeFilters = useMemo(() => [
    category !== 'all' && categoryLabel(category),
    search && `“${search}”`,
    minPrice && `From $${minPrice}`,
    maxPrice && `To $${maxPrice}`,
  ].filter(Boolean), [category, search, minPrice, maxPrice]);

  const setFilter = (name, value) => {
    setPage(1);
    const update = { [name]: value, page: 1 };
    if (name === 'category') setCategory(value);
    if (name === 'sort') setSort(value);
    if (name === 'minPrice') setMinPrice(value);
    if (name === 'maxPrice') setMaxPrice(value);
    updateUrl(update);
  };

  const pageNumbers = useMemo(() => {
    const result = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);
    for (let i = start; i <= end; i += 1) result.push(i);
    return result;
  }, [page, pages]);

  return <>
    <Head>
      <title>{category === 'all' ? 'Shop' : `${categoryLabel(category)} — Shop`} — Nicky Collections</title>
      <meta name="description" content="Explore footwear, outerwear, accessories, clothing and collectibles from Nicky Collections." />
    </Head>

    <header className="pt-20 pb-8 px-6 md:px-8 max-w-7xl mx-auto">
      <p className="label-tag text-brand-pink mb-3">The Collection</p>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div><h1 className="section-title">{categoryLabel(category)}</h1><p className="font-body text-brand-gray mt-3 max-w-xl">Discover pieces selected for everyday rotation, standout moments and the next drop.</p></div>
        <span className="font-body text-sm text-brand-gray">{loading ? 'Updating…' : `${total} ${total === 1 ? 'product' : 'products'}`}</span>
      </div>
    </header>

    <div className="max-w-7xl mx-auto px-6 md:px-8 pb-24">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`lg:w-64 shrink-0 ${filterOpen ? 'block' : 'hidden lg:block'}`} aria-label="Product filters">
          <div className="lg:sticky lg:top-28 border border-white/10 bg-brand-card p-5 space-y-7">
            <div className="flex items-center justify-between"><h2 className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-brand-light">Filter</h2><button className="lg:hidden text-brand-gray" onClick={() => setFilterOpen(false)} aria-label="Close filters"><FiX size={18} /></button></div>
            <form onSubmit={applySearch}>
              <label htmlFor="shop-search" className="label-tag text-brand-light mb-3 block">Search</label>
              <div className="relative"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray" size={15} /><input id="shop-search" type="search" value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)} placeholder="Search products" className="input-field text-sm w-full pl-9 pr-3" /></div>
            </form>

            <div><h3 className="label-tag text-brand-light mb-3">Category</h3><div className="space-y-1">{CATEGORIES.map((cat) => <button key={cat} type="button" onClick={() => setFilter('category', cat)} aria-pressed={category === cat} className={`w-full text-left font-body text-sm py-2.5 px-3 transition-colors ${category === cat ? 'bg-brand-pink text-white' : 'text-brand-gray hover:bg-white/5 hover:text-brand-light'}`}>{categoryLabel(cat)}</button>)}</div></div>

            <div><h3 className="label-tag text-brand-light mb-3">Price range</h3><div className="grid grid-cols-2 gap-2"><label className="sr-only" htmlFor="min-price">Minimum price</label><input id="min-price" type="number" min="0" inputMode="decimal" value={minPrice} onChange={(e) => setFilter('minPrice', e.target.value)} placeholder="Min $" className="input-field text-sm w-full" /><label className="sr-only" htmlFor="max-price">Maximum price</label><input id="max-price" type="number" min="0" inputMode="decimal" value={maxPrice} onChange={(e) => setFilter('maxPrice', e.target.value)} placeholder="Max $" className="input-field text-sm w-full" /></div></div>

            <div><label htmlFor="sort-filter" className="label-tag text-brand-light mb-3 block">Sort by</label><div className="relative"><select id="sort-filter" value={sort} onChange={(e) => setFilter('sort', e.target.value)} className="input-field text-sm w-full appearance-none cursor-pointer pr-9">{SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select><FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray pointer-events-none" size={16} /></div></div>

            <button type="button" onClick={clearFilters} className="btn-outline w-full text-xs flex items-center justify-center gap-2"><FiX size={14} /> Reset all</button>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2" aria-live="polite"><span className="label-tag text-brand-gray">Showing</span>{activeFilters.map((filter) => <span key={filter} className="font-body text-xs border border-white/10 px-2.5 py-1.5 text-brand-light">{filter}</span>)}</div>
            <button type="button" onClick={() => setFilterOpen(true)} className="lg:hidden btn-outline text-xs flex items-center gap-2"><FiSliders size={14} /> Filters</button>
          </div>

          <AnimatePresence mode="wait">
            {error ? <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-brand-pink/20 bg-brand-pink/5 p-12 text-center"><h2 className="font-display text-3xl text-brand-light mb-3">We couldn’t load the collection</h2><p className="font-body text-brand-gray mb-6">Check your connection and try again.</p><button onClick={() => setPage((current) => current)} className="btn-primary">Retry</button></motion.div>
              : loading ? <div key="loading" className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">{Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}</div>
              : products.length === 0 ? <motion.div key="empty" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="border border-white/10 p-12 md:p-20 text-center"><FiSearch size={30} className="mx-auto mb-5 text-brand-gray" /><h2 className="font-display text-3xl text-brand-light mb-3">Nothing matched your search</h2><p className="font-body text-brand-gray mb-7">Try a different term, category or price range.</p><button onClick={clearFilters} className="btn-primary">Clear filters</button></motion.div>
              : <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">{products.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}</motion.div>}
          </AnimatePresence>

          {!loading && !error && products.length > 0 && pages > 1 && <nav className="flex flex-wrap items-center justify-center gap-2 mt-14" aria-label="Product pages">
            <button disabled={page === 1} onClick={() => { const next = page - 1; setPage(next); updateUrl({ page: next }); }} className="btn-outline text-xs px-4 py-2 disabled:opacity-30">Previous</button>
            {page > 3 && <><button onClick={() => { setPage(1); updateUrl({ page: 1 }); }} className="w-9 h-9 border border-white/10 text-brand-gray hover:text-brand-light">1</button><span className="text-brand-gray">…</span></>}
            {pageNumbers.map((number) => <button key={number} aria-current={page === number ? 'page' : undefined} onClick={() => { setPage(number); updateUrl({ page: number }); }} className={`w-9 h-9 text-sm font-body transition-colors ${page === number ? 'bg-brand-pink text-white' : 'border border-white/10 text-brand-gray hover:text-brand-light'}`}>{number}</button>)}
            {page < pages - 2 && <><span className="text-brand-gray">…</span><button onClick={() => { setPage(pages); updateUrl({ page: pages }); }} className="w-9 h-9 border border-white/10 text-brand-gray hover:text-brand-light">{pages}</button></>}
            <button disabled={page === pages} onClick={() => { const next = page + 1; setPage(next); updateUrl({ page: next }); }} className="btn-outline text-xs px-4 py-2 disabled:opacity-30">Next</button>
          </nav>}

          <div className="mt-8 flex justify-center"><a href="#main-content" className="font-body text-xs tracking-widest uppercase text-brand-gray hover:text-brand-pink transition-colors flex items-center gap-2">Back to top <FiArrowRight size={12} className="-rotate-90" /></a></div>
        </main>
      </div>
    </div>
  </>;
}
