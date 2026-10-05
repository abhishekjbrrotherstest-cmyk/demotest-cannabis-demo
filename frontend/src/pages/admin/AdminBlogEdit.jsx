import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AdminPage from '../../components/admin/AdminPage';
import Button from '../../components/ui/Button';
import { adminApi } from '../../api/adminApi';
import { useFetch } from '../../hooks/useFetch';
import { useToast } from '../../context/ToastContext';
import { usePageMeta } from '../../hooks/usePageMeta';

const EMPTY = {
  title: '', slug: '', author: '', category: 'Education', tags: '',
  publish_date: '', content: '', featured_image: '', seo_title: '', meta_description: '', status: 'published',
};

export default function AdminBlogEdit() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();

  const { data, loading, error } = useFetch(
    () => (isNew ? Promise.resolve({ data: { post: EMPTY } }) : adminApi.blog.get(id)),
    [id]
  );
  const post = data?.post;

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  usePageMeta(`${isNew ? 'New' : 'Edit'} Blog Post | DemoTest Admin`);

  const loaded = form !== null;
  const current = loaded ? form : post;

  const apply = (p) => {
    if (loaded) return;
    setForm({
      title: p.title || '', slug: p.slug || '', author: p.author || '', category: p.category || 'Education',
      tags: p.tags || '', publish_date: (p.publish_date || '').slice(0, 10), content: p.content || '',
      featured_image: p.featured_image || '', seo_title: p.seo_title || '', meta_description: p.meta_description || '',
      status: p.status || 'published',
    });
  };
  if (post && !loaded) apply(post);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await adminApi.blog.create(form);
      else await adminApi.blog.update(id, form);
      push(isNew ? 'Post published' : 'Post updated');
      navigate('/admin/blog');
    } catch (err) {
      push(err.userMessage || 'Save failed', 'error');
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AdminPage
      title={isNew ? 'New blog post' : 'Edit blog post'}
      subtitle={isNew ? 'Write a new patient education article.' : `Editing: ${post?.title || ''}`}
      loading={loading}
      error={error}
      actions={
        <Link to="/admin/blog" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      }
    >
      <form onSubmit={save} className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="label">Title</label><input required className="field" value={current?.title || ''} onChange={set('title')} /></div>
        <div><label className="label">Slug</label><input required className="field" value={current?.slug || ''} onChange={set('slug')} placeholder="intro-to-pa-mmj" /></div>
        <div><label className="label">Author</label><input className="field" value={current?.author || ''} onChange={set('author')} /></div>
        <div><label className="label">Category</label><input className="field" value={current?.category || ''} onChange={set('category')} placeholder="Education" /></div>
        <div><label className="label">Tags (comma separated)</label><input className="field" value={current?.tags || ''} onChange={set('tags')} placeholder="dosing, edibles" /></div>
        <div><label className="label">Publish date</label><input type="date" className="field" value={current?.publish_date || ''} onChange={set('publish_date')} /></div>
        <div><label className="label">Status</label><select className="field" value={current?.status || 'published'} onChange={set('status')}><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div>
        <div className="sm:col-span-2"><label className="label">Featured image URL</label><input className="field" value={current?.featured_image || ''} onChange={set('featured_image')} /></div>
        <div className="sm:col-span-2"><label className="label">Content</label><textarea rows={10} className="field resize-y font-mono text-xs" value={current?.content || ''} onChange={set('content')} /></div>
        <div className="sm:col-span-2"><label className="label">SEO title</label><input className="field" value={current?.seo_title || ''} onChange={set('seo_title')} /></div>
        <div className="sm:col-span-2"><label className="label">Meta description</label><textarea rows={2} className="field resize-none" value={current?.meta_description || ''} onChange={set('meta_description')} /></div>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link to="/admin/blog" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">Cancel</Link>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : isNew ? 'Publish post' : 'Save post'}
          </Button>
        </div>
      </form>
    </AdminPage>
  );
}