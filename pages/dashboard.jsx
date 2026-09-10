import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHeart, FiUser, FiLogOut, FiEdit2, FiMail } from 'react-icons/fi';
import { useAuth } from '../lib/AuthContext';
import { usersAPI } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { CONTACT_EMAIL } from '../lib/site';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('wishlist');
  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!loading && !user) router.push('/auth/login'); }, [user, loading]);
  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, phone: user.phone || '' });
      usersAPI.getWishlist().then(res => setWishlist(res.data)).catch(console.error);
    }
  }, [user]);
  const handleLogout = () => { logout(); toast.success('Logged out successfully'); router.push('/'); };
  const handleSaveProfile = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await usersAPI.updateProfile(profile); toast.success('Profile updated!'); setEditing(false); }
    catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };
  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <>
      <Head><title>My Account — Nicky Collections</title></Head>
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-24 pb-20">
        <div className="flex items-start justify-between mb-12 pb-8 border-b border-white/10">
          <div><p className="label-tag text-brand-pink mb-2">My Account</p><h1 className="font-display text-4xl font-light text-brand-light">Hey, {user.name.split(' ')[0]}</h1><p className="font-body text-brand-gray text-sm mt-2">{user.email}</p></div>
          <button onClick={handleLogout} className="btn-outline text-xs flex items-center gap-2"><FiLogOut size={14} /> Logout</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 space-y-2">
            {[{ id: 'wishlist', label: 'Wishlist', icon: FiHeart, count: wishlist.length }, { id: 'profile', label: 'Profile', icon: FiUser }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 font-body text-sm tracking-wide transition-all ${activeTab === tab.id ? 'bg-brand-pink text-white' : 'text-brand-gray hover:text-brand-light hover:bg-white/5'}`}>
                <tab.icon size={16} />{tab.label}{tab.count !== undefined && <span className={`ml-auto text-xs font-bold ${activeTab === tab.id ? 'text-white/70' : 'text-brand-pink'}`}>{tab.count}</span>}
              </button>
            ))}
            <a href={`mailto:${CONTACT_EMAIL}`} className="w-full flex items-center gap-3 px-4 py-3 font-body text-sm text-brand-gray hover:text-brand-pink transition-colors"><FiMail size={16} /> Email Nicky Collections</a>
          </div>
          <div className="lg:col-span-3">
            {activeTab === 'wishlist' && <div><h2 className="font-display text-2xl text-brand-light mb-8">Saved Items ({wishlist.length})</h2>{wishlist.length === 0 ? <div className="text-center py-20 glass-card"><FiHeart size={40} className="text-brand-gray mx-auto mb-4" /><p className="font-display text-2xl text-brand-light mb-3">No saved items yet</p><p className="font-body text-brand-gray mb-6">Save products you love to find them easily later</p><Link href="/shop" className="btn-primary">Browse Products</Link></div> : <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{wishlist.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}</div>}</div>}
            {activeTab === 'profile' && <div className="max-w-lg"><div className="flex items-center justify-between mb-8"><h2 className="font-display text-2xl text-brand-light">Profile</h2><button onClick={() => setEditing(!editing)} className="btn-outline text-xs flex items-center gap-2"><FiEdit2 size={12} />{editing ? 'Cancel' : 'Edit'}</button></div><form onSubmit={handleSaveProfile} className="space-y-5"><div><label className="label-tag block mb-2">Full Name</label><input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} disabled={!editing} className="input-field w-full disabled:opacity-50 disabled:cursor-not-allowed" /></div><div><label className="label-tag block mb-2">Email</label><input type="email" value={user.email} disabled className="input-field w-full opacity-50 cursor-not-allowed" /></div><div><label className="label-tag block mb-2">Phone</label><input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="Your phone number" disabled={!editing} className="input-field w-full disabled:opacity-50 disabled:cursor-not-allowed" /></div>{editing && <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>}</form></div>}
          </div>
        </div>
      </div>
    </>
  );
}
