import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, ArrowLeft, Save } from 'lucide-react';
import AdminPage from '../../components/admin/AdminPage';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import { adminApi } from '../../api/adminApi';
import { useFetch } from '../../hooks/useFetch';
import { useToast } from '../../context/ToastContext';
import { usePageMeta } from '../../hooks/usePageMeta';

const SECTION_TYPES = ['story', 'mission', 'values', 'team', 'features', 'community', 'cta'];
const hintFor = (t) => (['values', 'team', 'features'].includes(t) ? 'JSON array — e.g. [{"label":"Compassion","text":"…"}] (team items may include "image")' : 'Plain text. For "cta", use a path like /locations.');

function AboutEditor({ id }) {
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();
  const { data, loading, error } = useFetch(
    () => (isNew ? Promise.resolve({ data: { section: {} } }) : adminApi.about.get(id)),
    [id]
  );
  const section = data?.section;
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  if (section && form === null) {
    setForm({
      section_type: section.section_type || 'story', title: section.title || '', subtitle: section.subtitle || '',
      content: section.content || '', image_url: section.image_url || '',
      display_order: Number(section.display_order || 1), status: section.status || 'active',
    });
  }

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await adminApi.about.create(form);
      else await adminApi.about.update(id, form);
      push(isNew ? 'Section created' : 'Section updated');
      navigate('/admin/about');
    } catch (err) {
      push(err.userMessage || 'Save failed', 'error');
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AdminPage
      title={isNew ? 'New about section' : 'Edit about section'}
      loading={loading}
      error={error}
      actions={<Link to="/admin/about" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream"><ArrowLeft className="h-4 w-4" /> Back</Link>}
    >
      <form onSubmit={save} className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        <div><label className="label">Section type</label><select className="field" value={form?.section_type || 'story'} onChange={set('section_type')}>{SECTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
        <div><label className="label">Display order</label><input type="number" className="field" value={form?.display_order ?? 1} onChange={set('display_order')} /></div>
        <div className="sm:col-span-2"><label className="label">Title</label><input className="field" value={form?.title || ''} onChange={set('title')} /></div>
        <div className="sm:col-span-2"><label className="label">Subtitle</label><input className="field" value={form?.subtitle || ''} onChange={set('subtitle')} /></div>
        <div className="sm:col-span-2">
          <label className="label">Content</label>
          <textarea rows={8} className="field resize-y font-mono text-xs" value={form?.content || ''} onChange={set('content')} />
          <p className="mt-1 text-xs text-brand-500">{hintFor(form?.section_type)}</p>
        </div>
        <div className="sm:col-span-2"><label className="label">Image URL</label><input className="field" value={form?.image_url || ''} onChange={set('image_url')} placeholder="https://images.unsplash.com/…" /></div>
        <div><label className="label">Status</label><select className="field" value={form?.status || 'active'} onChange={set('status')}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link to="/admin/about" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">Cancel</Link>
          <Button type="submit" disabled={saving}><Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save section'}</Button>
        </div>
      </form>
    </AdminPage>
  );
}

function AboutList() {
  usePageMeta('About Page | DemoTest Admin');
  const navigate = useNavigate();
  const { push } = useToast();
  const { data, loading, error, refetch } = useFetch(() => adminApi.about.list(), []);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const rows = (data?.sections || []).map((s) => ({
    id: s.id,
    display_order: s.display_order,
    section_type: s.section_type,
    title: s.title || '(no title)',
    status: s.status,
  }));

  const remove = async () => {
    setDeleting(true);
    try {
      await adminApi.about.remove(pendingDelete.id);
      push('Section deleted');
      setPendingDelete(null);
      refetch();
    } catch (err) {
      push(err.userMessage || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminPage
      title="About Page"
      subtitle="The sections that build the /about page, in order."
      loading={loading}
      error={error}
      actions={<Button onClick={() => navigate('/admin/about/new')}><Plus className="h-4 w-4" /> Add section</Button>}
    >
      {!loading && (
        <DataTable
          columns={[
            { key: 'display_order', label: 'Order' },
            { key: 'section_type', label: 'Type' },
            { key: 'title', label: 'Title' },
            { key: 'status', label: 'Status', tone: 'badge' },
          ]}
          rows={rows}
          actions={(r) => (
            <>
              <button onClick={() => navigate(`/admin/about/${r.id}`)} aria-label="Edit section" className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-gold-100"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setPendingDelete(r)} aria-label="Delete section" className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
            </>
          )}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => !deleting && setPendingDelete(null)}
        onConfirm={remove}
        busy={deleting}
        title="Delete section?"
        message={`Delete "${pendingDelete?.title}"? This cannot be undone.`}
      />
    </AdminPage>
  );
}

export default function AdminAbout() {
  const { id } = useParams();
  if (id) return <AboutEditor id={id} />;
  return <AboutList />;
}