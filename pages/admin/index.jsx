cat > pages/admin/index.jsx << 'ENDOFFILE'
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  FiPackage, FiUsers, FiStar, FiPlus, FiEdit2, FiTrash2,
  FiUpload, FiX, FiCheck, FiLogOut, FiBarChart2, FiImage, FiVideo
} from 'react-icons/fi';
import { useAuth } from '../../lib/AuthContext';
import { adminAPI, productsAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['footwear', 'outerwear', 'accessories', 'clothing', 'collectibles', 'other'];

const emptyForm = {
  name: '', description: '', price: '', comparePrice: '', category: 'footwear',
  brand: '', colors: '', sizes: '', tags: '', inStock: true, stockCount: 0,
  isFeatured: false, isNewArrival: true, tiktokLink: ''
};

export default function AdminDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const imgInputRef = useRef();
  const videoInputRef = useRef();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadStats();
      loadProducts();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const res = await adminAPI.getStats();
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const loadProducts = async () => {
    setLoadingData(true);
    try {
      const res = await productsAPI.getAll({ limit: 100 });
      setProducts(res.data.products);
    } catch (err) { console.error(err); }
    finally { setLoadingData(false); }
  };

  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removePreview = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const openForm = (product = null) => {
    if (product) {
      setEditingId(product._id);
      setForm({
        name: product.name, description: product.description,
        price: product.price, comparePrice: product.comparePrice || '',
        category: product.category, brand: product.brand || '',
        colors: product.colors?.join(', ') || '',
        sizes: product.sizes?.join(', ') || '',
        tags: product.tags?.join(', ') || '',
        inStock: product.inStock, stockCount: product.stockCount || 0,
        isFeatured: product.isFeatured, isNewArrival: product.isNewArrival,
        tiktokLink: product.tiktokLink || ''
      });
    } else {
      setEditingId(null);
      setForm(emptyForm);
    }
    setImageFiles([]);
    setImagePreviews([]);
    setVideoFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'colors' || key === 'sizes' || key === 'tags') {
          const arr = val.split(',').map(s => s.trim()).filter(Boolean);
          fd.append(key, JSON.stringify(arr));
        } else {
          fd.append(key, val);
        }
      });
      imageFiles.forEach(f => fd.append('images', f));
      if (editingId) {
        await adminAPI.updateProduct(editingId, fd);
        toast.success('Product updated! ✅');
      } else {
        await adminAPI.createProduct(fd);
        toast.success('Product created! 🎉');
      }
      if (videoFile && editingId) {
        const vfd = new FormData();
        vfd.append('video', videoFile);
        await adminAPI.addVideo(editingId, vfd);
      }
      setShowForm(false);
      loadProducts();
      loadStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm('Delete "' + name + '"? This cannot be undone.')) return;
    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product deleted');
      loadProducts();
      loadStats();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <>
      <Head><title>Admin Panel — Nicky Collections</title></Head>
      <div className="min-h-screen bg-brand-dark flex">
        <div className="w-64 shrink-0 bg-brand-card border-r border-white/5 flex flex-col fixed h-full z-40">
          <div className="p-6 border-b border-white/10">
            <span className="font-display text-2xl font-light tracking-widest text-brand-light block">NICKY</span>
            <span className="font-body text-xs tracking-widest uppercase text-brand-pink">Admin Panel</span>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: FiBarChart2 },
              { id: 'products', label: 'Products', icon: FiPackage },
              { id: 'users', label: 'Users', icon: FiUsers },
            ].map(tab => (
              <button key={tab.id}
                onClick={() => { setActiveTab(tab.id); if (tab.id === 'users') loadUsers(); }}
                className={'w-full flex items-center gap-3 px-4 py-3 font-body text-sm tracking-wide transition-all text-left ' + (activeTab === tab.id ? 'bg-brand-pink text-white' : 'text-brand-gray hover:text-brand-light hover:bg-white/5')}>
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link href="/" className="w-full flex items-center gap-3 px-4 py-2 font-body text-xs text-brand-gray hover:text-brand-light transition-colors">
              Back to Store
            </Link>
            <button onClick={() => { logout(); router.push('/'); }}
              className="w-full flex items-center gap-3 px-4 py-2 font-body text-xs text-brand-gray hover:text-red-400 transition-colors">
              <FiLogOut size={14} />
              Logout
            </button>
          </div>
        </div>

        <div className="ml-64 flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="font-display text-3xl font-light text-brand-light mb-8">Dashboard</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { label: 'Total Products', value: stats?.totalProducts ?? '0', icon: FiPackage, color: 'text-brand-pink' },
                  { label: 'Featured', value: stats?.featuredProducts ?? '0', icon: FiStar, color: 'text-brand-gold' },
                  { label: 'Out of Stock', value: stats?.outOfStock ?? '0', icon: FiX, color: 'text-red-400' },
                  { label: 'Total Users', value: stats?.totalUsers ?? '0', icon: FiUsers, color: 'text-blue-400' },
                ].map(stat => (
                  <div key={stat.label} className="glass-card p-6">
                    <stat.icon size={20} className={stat.color + ' mb-3'} />
                    <div className="font-display text-3xl font-light text-brand-light">{stat.value}</div>
                    <div className="label-tag mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <h2 className="font-body text-sm tracking-widest uppercase text-brand-gray mb-4">Recent Products</h2>
              <div className="glass-card overflow-hidden">
                <table className="w-full admin-table">
                  <thead>
                    <tr>
                      <th className="text-left px-6">Product</th>
                      <th className="text-left px-6">Category</th>
                      <th className="text-left px-6">Price</th>
                      <th className="text-left px-6">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentProducts?.map(p => (
                      <tr key={p._id}>
                        <td className="px-6">
                          <div className="flex items-center gap-3">
                            {p.images?.[0] && (
                              <div className="w-10 h-10 relative overflow-hidden shrink-0">
                                <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                              </div>
                            )}
                            <span className="line-clamp-1 font-medium">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 capitalize">{p.category}</td>
                        <td className="px-6 text-brand-gold">${p.price}</td>
                        <td className="px-6">{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="font-display text-3xl font-light text-brand-light">Products ({products.length})</h1>
                <button onClick={() => openForm()} className="btn-primary flex items-center gap-2">
                  <FiPlus size={16} />Add Product
                </button>
              </div>
              {loadingData ? (
                <div className="text-center py-20 text-brand-gray">Loading...</div>
              ) : (
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full admin-table">
                      <thead>
                        <tr>
                          <th className="text-left px-6">Product</th>
                          <th className="text-left px-6">Category</th>
                          <th className="text-left px-6">Price</th>
                          <th className="text-left px-6">Stock</th>
                          <th className="text-left px-6">Featured</th>
                          <th className="text-left px-6">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p._id}>
                            <td className="px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 relative overflow-hidden shrink-0 bg-brand-muted">
                                  {p.images?.[0] ? (
                                    <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-brand-gray">
                                      <FiImage size={16} />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-brand-light line-clamp-1 max-w-xs">{p.name}</p>
                                  <p className="text-xs text-brand-gray">{p.brand}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 capitalize text-brand-gray">{p.category}</td>
                            <td className="px-6 text-brand-gold font-semibold">${p.price}</td>
                            <td className="px-6">
                              <span className={'text-xs px-2 py-1 ' + (p.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
                                {p.inStock ? 'In Stock' : 'Out'}
                              </span>
                            </td>
                            <td className="px-6">
                              {p.isFeatured ? <FiStar size={14} className="text-brand-gold" /> : '-'}
                            </td>
                            <td className="px-6">
                              <div className="flex items-center gap-3">
                                <button onClick={() => openForm(p)} className="text-brand-gray hover:text-brand-light transition-colors">
                                  <FiEdit2 size={14} />
                                </button>
                                <button onClick={() => handleDelete(p._id, p.name)} className="text-brand-gray hover:text-red-400 transition-colors">
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h1 className="font-display text-3xl font-light text-brand-light mb-8">Users ({users.length})</h1>
              <div className="glass-card overflow-hidden">
                <table className="w-full admin-table">
                  <thead>
                    <tr>
                      <th className="text-left px-6">Name</th>
                      <th className="text-left px-6">Email</th>
                      <th className="text-left px-6">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td className="px-6 font-medium">{u.name}</td>
                        <td className="px-6 text-brand-gray">{u.email}</td>
                        <td className="px-6 text-brand-gray">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-brand-dark/90 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-3xl mx-auto my-8 px-4">
            <div className="bg-brand-card border border-white/10 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl text-brand-light">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowForm(false)} className="text-brand-gray hover:text-brand-light">
                  <FiX size={22} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="label-tag block mb-2">Product Name *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Nike Mind 001 Black" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="label-tag block mb-2">Price ($) *</label>
                    <input required type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="99.99" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="label-tag block mb-2">Compare Price ($)</label>
                    <input type="number" step="0.01" value={form.comparePrice} onChange={e => setForm({ ...form, comparePrice: e.target.value })} placeholder="Optional" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="label-tag block mb-2">Category *</label>
                    <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field w-full">
                      {CATEGORIES.map(c => (<option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="label-tag block mb-2">Brand</label>
                    <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Nike, Adidas..." className="input-field w-full" />
                  </div>
                  <div>
                    <label className="label-tag block mb-2">Colors (comma separated)</label>
                    <input value={form.colors} onChange={e => setForm({ ...form, colors: e.target.value })} placeholder="Black, White, Red" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="label-tag block mb-2">Sizes (comma separated)</label>
                    <input value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} placeholder="US7, US8, US9" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="label-tag block mb-2">Tags (comma separated)</label>
                    <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="sneakers, limited" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="label-tag block mb-2">Stock Count</label>
                    <input type="number" value={form.stockCount} onChange={e => setForm({ ...form, stockCount: e.target.value })} className="input-field w-full" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-tag block mb-2">TikTok Link</label>
                    <input value={form.tiktokLink} onChange={e => setForm({ ...form, tiktokLink: e.target.value })} placeholder="https://tiktok.com/..." className="input-field w-full" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label-tag block mb-2">Description *</label>
                    <textarea required rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." className="input-field w-full resize-none" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-6">
                  {[{ key: 'inStock', label: 'In Stock' }, { key: 'isFeatured', label: 'Featured' }, { key: 'isNewArrival', label: 'New Arrival' }].map(toggle => (
                    <label key={toggle.key} className="flex items-center gap-3 cursor-pointer">
                      <div onClick={() => setForm({ ...form, [toggle.key]: !form[toggle.key] })}
                        className={'w-10 h-5 rounded-full transition-colors relative ' + (form[toggle.key] ? 'bg-brand-pink' : 'bg-white/10')}>
                        <div className={'absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ' + (form[toggle.key] ? 'translate-x-5' : 'translate-x-0.5')} />
                      </div>
                      <span className="font-body text-sm text-brand-gray">{toggle.label}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="label-tag block mb-3">Product Images</label>
                  <div onClick={() => imgInputRef.current.click()} className="border-2 border-dashed border-white/20 hover:border-brand-pink/50 p-8 text-center cursor-pointer transition-colors">
                    <FiImage size={28} className="text-brand-gray mx-auto mb-3" />
                    <p className="font-body text-sm text-brand-gray">Click to upload images</p>
                    <p className="font-body text-xs text-brand-gray/60 mt-1">JPG, PNG, WebP — Max 10MB each</p>
                  </div>
                  <input ref={imgInputRef} type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative w-20 h-20">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removePreview(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                            <FiX size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="label-tag block mb-3">Product Video</label>
                  <div onClick={() => videoInputRef.current.click()} className="border-2 border-dashed border-white/20 hover:border-brand-pink/50 p-6 text-center cursor-pointer transition-colors">
                    <FiVideo size={24} className="text-brand-gray mx-auto mb-2" />
                    <p className="font-body text-sm text-brand-gray">{videoFile ? videoFile.name : 'Click to upload video'}</p>
                  </div>
                  <input ref={videoInputRef} type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} className="hidden" />
                </div>
                <div className="flex gap-4 pt-4 border-t border-white/10">
                  <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 flex-1 justify-center py-4">
                    {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiCheck size={16} />{editingId ? 'Save Changes' : 'Create Product'}</>}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-8">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

AdminDashboard.noLayout = true;
