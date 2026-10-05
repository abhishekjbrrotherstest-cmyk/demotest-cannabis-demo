import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, ArrowLeft, Save, Globe } from 'lucide-react';
import AdminPage from '../../components/admin/AdminPage';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import { adminApi } from '../../api/adminApi';
import { useFetch } from '../../hooks/useFetch';
import { useToast } from '../../context/ToastContext';
import { usePageMeta } from '../../hooks/usePageMeta';

function PageEditor({ id }) {
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();
  const { data, loading, error } = useFetch(
    () => (isNew ? Promise.resolve({ data: { page: {} } }) : adminApi.pages.get(id)),
    [id]
  );
  const page = data?.page;
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  if (page && form === null) {
    setForm({
      title: page.title || '', slug: page.slug || '', content: page.content || '',
      hero_image_url: page.hero_image_url || '', seo_title: page.seo_title || '',
      meta_description: page.meta_description || '', og_image: page.og_image || '',
      status: page.status || 'draft',
    });
  }

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await adminApi.pages.create(form);
      else await adminApi.pages.update(id, form);
      push(isNew ? 'Page created' : 'Page updated');
      navigate('/admin/pages');
    } catch (err) {
      push(err.userMessage || 'Save failed', 'error');
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AdminPage
      title={isNew ? 'New page' : 'Edit page'}
      loading={loading}
      error={error}
      actions={<Link to="/admin/pages" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream"><ArrowLeft className="h-4 w-4" /> Back</Link>}
    >
      <form onSubmit={save} className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        <div><label className="label">Title</label><input className="field" value={form?.title || ''} onChange={set('title')} placeholder="Careers" /></div>
        <div><label className="label">Slug</label><input className="field" value={form?.slug || ''} onChange={set('slug')} placeholder="careers" /></div>
        <div className="sm:col-span-2">
          <label className="label">Content (HTML)</label>
          <textarea rows={14} className="field resize-y font-mono text-xs" value={form?.content || ''} onChange={set('content')} placeholder="<h2>Join our team</h2><p>…</p>" />
        </div>
        <div className="sm:col-span-2"><label className="label">Hero image URL</label><input className="field" value={form?.hero_image_url || ''} onChange={set('hero_image_url')} placeholder="https://images.unsplash.com/…" /></div>
        <div className="sm:col-span-2"><label className="label">SEO title</label><input className="field" value={form?.seo_title || ''} onChange={set('seo_title')} /></div>
        <div className="sm:col-span-2"><label className="label">Meta description</label><input className="field" value={form?.meta_description || ''} onChange={set('meta_description')} /></div>
        <div><label className="label">OG image URL</label><input className="field" value={form?.og_image || ''} onChange={set('og_image')} placeholder="https://images.unsplash.com/…" /></div>
        <div><label className="label">Status</label><select className="field" value={form?.status || 'draft'} onChange={set('status')}><option value="draft">Draft</option><option value="published">Published</option></select></div>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link to="/admin/pages" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">Cancel</Link>
          <Button type="submit" disabled={saving}><Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save page'}</Button>
        </div>
      </form>
    </AdminPage>
  );
}

function PageList() {
  usePageMeta('Pages | DemoTest Admin');
  const navigate = useNavigate();
  const { push } = useToast();
  const { data, loading, error, refetch } = useFetch(() => adminApi.pages.list(), []);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const rows = (data?.pages || []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    status: p.status,
  }));

  const remove = async () => {
    setDeleting(true);
    try {
      await adminApi.pages.remove(pendingDelete.id);
      push('Page deleted');
      setPendingDelete(null);
      refetch();
    } catch (err) {
      push(err.userMessage || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const publish = async (r) => {
    try {
      await adminApi.pages.publish(r.id, r.status === 'published' ? 'draft' : 'published');
      push(r.status === 'published' ? 'Page unpublished' : 'Page published');
      refetch();
    } catch (err) {
      push(err.userMessage || 'Action failed', 'error');
    }
  };

  return (
    <AdminPage
      title="Pages"
      subtitle="CMS pages rendered at /pages/:slug."
      loading={loading}
      error={error}
      actions={<Button onClick={() => navigate('/admin/pages/new')}><Plus className="h-4 w-4" /> New page</Button>}
    >
      {!loading && (
        <DataTable
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'slug', label: 'Slug', render: (r) => <code className="text-xs text-brand-600">/pages/{r.slug}</code> },
            { key: 'status', label: 'Status', tone: 'badge' },
          ]}
          rows={rows}
          actions={(r) => (
            <>
              <button onClick={() => publish(r)} aria-label="Publish or unpublish" title={r.status === 'published' ? 'Unpublish' : 'Publish'} className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-gold-100"><Globe className="h-4 w-4" /></button>
              <button onClick={() => navigate(`/admin/pages/${r.id}`)} aria-label="Edit page" className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-gold-100"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setPendingDelete(r)} aria-label="Delete page" className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
            </>
          )}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => !deleting && setPendingDelete(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete page?"
        message={`Delete "/pages/${pendingDelete?.slug}"? This cannot be undone.`}
      />
    </AdminPage>
  );
}

export default function AdminPages() {
  const { id } = useParams();
  if (id) return <PageEditor id={id} />;
  return <PageList />;
}