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
  title: '', location: '', employment_type: 'Full-time',
  description: '', requirements: '', responsibilities: '', status: 'open',
};

export default function AdminCareerEdit() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();
  const { data, loading, error } = useFetch(
    () => (isNew ? Promise.resolve({ data: { career: EMPTY } }) : adminApi.careers.get(id)),
    [id]
  );
  const career = data?.career;
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  usePageMeta(`${isNew ? 'New' : 'Edit'} Job | DemoTest Admin`);

  if (career && form === null) {
    setForm({
      title: career.title || '', location: career.location || '', employment_type: career.employment_type || 'Full-time',
      description: career.description || '', requirements: career.requirements || '',
      responsibilities: career.responsibilities || '', status: career.status || 'open',
    });
  }

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await adminApi.careers.create(form);
      else await adminApi.careers.update(id, form);
      push(isNew ? 'Job created' : 'Job updated');
      navigate('/admin/careers');
    } catch (err) {
      push(err.userMessage || 'Save failed', 'error');
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AdminPage
      title={isNew ? 'New job' : 'Edit job'}
      subtitle={isNew ? 'Post a new open position.' : `Editing: ${form?.title || career?.title || ''}`}
      loading={loading}
      error={error}
      actions={
        <Link to="/admin/careers" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      }
    >
      <form onSubmit={save} className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="label">Title</label><input required className="field" value={form?.title || ''} onChange={set('title')} /></div>
        <div><label className="label">Location</label><input className="field" value={form?.location || ''} onChange={set('location')} placeholder="Pittsburgh, PA" /></div>
        <div><label className="label">Employment type</label><select className="field" value={form?.employment_type || 'Full-time'} onChange={set('employment_type')}><option>Full-time</option><option>Part-time</option><option>Contract</option></select></div>
        <div className="sm:col-span-2"><label className="label">Description</label><textarea rows={3} className="field resize-y" value={form?.description || ''} onChange={set('description')} /></div>
        <div className="sm:col-span-2"><label className="label">Requirements (one per line or sentence)</label><textarea rows={4} className="field resize-y" value={form?.requirements || ''} onChange={set('requirements')} /></div>
        <div className="sm:col-span-2"><label className="label">Responsibilities (one per line or sentence)</label><textarea rows={4} className="field resize-y" value={form?.responsibilities || ''} onChange={set('responsibilities')} /></div>
        <div className="sm:col-span-2"><label className="label">Status</label><select className="field" value={form?.status || 'open'} onChange={set('status')}><option value="open">Open</option><option value="closed">Closed</option></select></div>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link to="/admin/careers" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">Cancel</Link>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save job'}
          </Button>
        </div>
      </form>
    </AdminPage>
  );
}