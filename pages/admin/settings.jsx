import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import { adminAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const EMPTY = {
  brandName: '', tagline: '', description: '', seoTitle: '', seoDescription: '',
  whatsappNumber: '', phoneNumber: '', email: '', tiktokUrl: '', instagramUrl: '',
  facebookUrl: '', siteUrl: '', logoUrl: '', ogImageUrl: '', announcement: '', announcementEnabled: false,
};

export default function AdminSettings() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.replace('/auth/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    adminAPI.getSiteSettings().then(({ data }) => setForm({ ...EMPTY, ...data })).catch(() => toast.error('Could not load site settings'));
  }, [user]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await adminAPI.updateSiteSettings(form);
      toast.success('Site settings saved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || user.role !== 'admin') return null;

  return (
    <>
      <Head><title>Site Settings — Nicky Collections Admin</title></Head>
      <main className="min-h-screen bg-brand-dark px-6 md:px-10 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="label-tag text-brand-pink mb-3">CMS</p>
            <h1 className="font-display text-4xl text-brand-light">Site Settings</h1>
            <p className="font-body text-brand-gray mt-3">Control brand information, SEO defaults and customer contact channels from one place.</p>
          </div>

          <form onSubmit={save} className="space-y-8">
            <section className="glass-card p-6 md:p-8">
              <h2 className="font-display text-2xl text-brand-light mb-6">Brand & SEO</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  ['brandName', 'Brand name'], ['tagline', 'Tagline'], ['seoTitle', 'SEO title'], ['siteUrl', 'Canonical site URL'],
                  ['logoUrl', 'Logo URL'], ['ogImageUrl', 'Open Graph image URL']
                ].map(([key, label]) => <label key={key} className="block"><span className="label-tag block mb-2">{label}</span><input value={form[key]} onChange={(e) => update(key, e.target.value)} className="input-field w-full" /></label>)}
                <label className="block md:col-span-2"><span className="label-tag block mb-2">Brand description</span><textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} className="input-field w-full resize-none" /></label>
                <label className="block md:col-span-2"><span className="label-tag block mb-2">SEO description</span><textarea value={form.seoDescription} onChange={(e) => update('seoDescription', e.target.value)} rows={4} className="input-field w-full resize-none" /></label>
              </div>
            </section>

            <section className="glass-card p-6 md:p-8">
              <h2 className="font-display text-2xl text-brand-light mb-6">Customer Contact</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  ['whatsappNumber', 'WhatsApp number'], ['phoneNumber', 'Phone number'], ['email', 'Email'],
                  ['tiktokUrl', 'TikTok URL'], ['instagramUrl', 'Instagram URL'], ['facebookUrl', 'Facebook URL']
                ].map(([key, label]) => <label key={key} className="block"><span className="label-tag block mb-2">{label}</span><input value={form[key]} onChange={(e) => update(key, e.target.value)} className="input-field w-full" /></label>)}
              </div>
            </section>

            <section className="glass-card p-6 md:p-8">
              <h2 className="font-display text-2xl text-brand-light mb-6">Announcement Bar</h2>
              <label className="block mb-5"><span className="label-tag block mb-2">Announcement</span><input value={form.announcement} onChange={(e) => update('announcement', e.target.value)} className="input-field w-full" placeholder="New drop this Friday — shop now" /></label>
              <label className="flex items-center gap-3 font-body text-sm text-brand-light"><input type="checkbox" checked={form.announcementEnabled} onChange={(e) => update('announcementEnabled', e.target.checked)} /> Show announcement bar</label>
            </section>

            <div className="flex justify-end"><button disabled={saving} className="btn-primary min-w-40">{saving ? 'Saving...' : 'Save Settings'}</button></div>
          </form>
        </div>
      </main>
    </>
  );
}
