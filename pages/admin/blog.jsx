import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import { adminAPI } from '../../lib/api';
import toast from 'react-hot-toast';

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '', category: 'Style Guide', tags: '',
  authorName: 'Nicky Collections', coverImage: { url: '', alt: '' }, seoTitle: '', seoDescription: '', published: false
};

export default function AdminBlog() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { setPosts((await adminAPI.getBlogPosts()).data); }
    catch { toast.error('Could not load articles'); }
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.replace('/auth/login');
  }, [loading, user, router]);

  useEffect(() => { if (user?.role === 'admin') load(); }, [user]);

  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));

  const reset = () => { setForm(EMPTY); setEditingId(null); };

  const edit = (post) => setForm({
    ...post,
    tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
    coverImage: post.coverImage || { url: '', alt: '' }
  }) || setEditingId(post._id);

  const save = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content are required');
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean) };
    try {
      if (editingId) await adminAPI.updateBlogPost(editingId, payload);
      else await adminAPI.createBlogPost(payload);
      toast.success(editingId ? 'Article updated' : 'Article created');
      reset();
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save article');
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try { await adminAPI.deleteBlogPost(id); toast.success('Article deleted'); await load(); }
    catch { toast.error('Could not delete article'); }
  };

  if (loading || !user || user.role !== 'admin') return null;

  return (
    <>
      <Head><title>Blog CMS — Nicky Collections Admin</title></Head>
      <main className="min-h-screen bg-brand-dark px-6 md:px-10 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="label-tag text-brand-pink mb-3">CMS / CONTENT</p>
            <h1 className="font-display text-4xl text-brand-light">Editorial Studio</h1>
            <p className="font-body text-brand-gray mt-3">Publish original style guides, buying guides and trend content designed to bring qualified search traffic to the store.</p>
          </div>

          <div className="grid xl:grid-cols-[1.3fr_0.7fr] gap-8">
            <form onSubmit={save} className="glass-card p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-brand-light">{editingId ? 'Edit article' : 'New article'}</h2>
                {editingId && <button type="button" onClick={reset} className="btn-outline">Cancel</button>}
              </div>

              <label className="block"><span className="label-tag block mb-2">Title</span><input value={form.title} onChange={e => update('title', e.target.value)} className="input-field w-full" required /></label>
              <div className="grid md:grid-cols-2 gap-5">
                <label className="block"><span className="label-tag block mb-2">Slug</span><input value={form.slug} onChange={e => update('slug', e.target.value)} className="input-field w-full" placeholder="Leave empty to generate" /></label>
                <label className="block"><span className="label-tag block mb-2">Category</span><input value={form.category} onChange={e => update('category', e.target.value)} className="input-field w-full" /></label>
              </div>
              <label className="block"><span className="label-tag block mb-2">Excerpt</span><textarea value={form.excerpt} onChange={e => update('excerpt', e.target.value)} rows={3} className="input-field w-full resize-none" /></label>
              <label className="block"><span className="label-tag block mb-2">Article content</span><textarea value={form.content} onChange={e => update('content', e.target.value)} rows={18} className="input-field w-full resize-y font-mono text-sm" required /></label>
              <div className="grid md:grid-cols-2 gap-5">
                <label className="block"><span className="label-tag block mb-2">Tags</span><input value={form.tags} onChange={e => update('tags', e.target.value)} className="input-field w-full" placeholder="sneakers, streetwear, style" /></label>
                <label className="block"><span className="label-tag block mb-2">Author</span><input value={form.authorName} onChange={e => update('authorName', e.target.value)} className="input-field w-full" /></label>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <label className="block"><span className="label-tag block mb-2">Cover image URL</span><input value={form.coverImage.url} onChange={e => update('coverImage', { ...form.coverImage, url: e.target.value })} className="input-field w-full" /></label>
                <label className="block"><span className="label-tag block mb-2">Image alt text</span><input value={form.coverImage.alt} onChange={e => update('coverImage', { ...form.coverImage, alt: e.target.value })} className="input-field w-full" /></label>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <label className="block"><span className="label-tag block mb-2">SEO title</span><input value={form.seoTitle} onChange={e => update('seoTitle', e.target.value)} className="input-field w-full" /></label>
                <label className="block"><span className="label-tag block mb-2">SEO description</span><textarea value={form.seoDescription} onChange={e => update('seoDescription', e.target.value)} rows={3} className="input-field w-full resize-none" /></label>
              </div>
              <label className="flex items-center gap-3 font-body text-sm text-brand-light"><input type="checkbox" checked={form.published} onChange={e => update('published', e.target.checked)} /> Publish article</label>
              <button disabled={saving} className="btn-primary w-full">{saving ? 'Saving...' : editingId ? 'Update Article' : 'Create Article'}</button>
            </form>

            <section className="space-y-4">
              <h2 className="font-display text-2xl text-brand-light">Content library</h2>
              {posts.map(post => (
                <article key={post._id} className="glass-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="label-tag text-brand-pink">{post.published ? 'Published' : 'Draft'}</p>
                      <h3 className="font-display text-xl text-brand-light mt-2">{post.title}</h3>
                      <p className="font-body text-xs text-brand-gray mt-2">/{post.slug}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5">
                    <button onClick={() => { setForm({ ...post, tags: (post.tags || []).join(', '), coverImage: post.coverImage || { url: '', alt: '' } }); setEditingId(post._id); }} className="btn-outline flex-1">Edit</button>
                    <button onClick={() => remove(post._id)} className="btn-outline text-red-400 border-red-400/30">Delete</button>
                  </div>
                </article>
              ))}
              {!posts.length && <div className="glass-card p-6 font-body text-sm text-brand-gray">No articles yet.</div>}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
