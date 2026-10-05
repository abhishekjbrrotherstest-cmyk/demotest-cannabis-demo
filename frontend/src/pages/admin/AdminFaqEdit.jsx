import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AdminPage from '../../components/admin/AdminPage';
import Button from '../../components/ui/Button';
import { adminApi } from '../../api/adminApi';
import { useFetch } from '../../hooks/useFetch';
import { useToast } from '../../context/ToastContext';
import { usePageMeta } from '../../hooks/usePageMeta';

const EMPTY = { question: '', answer: '', category: 'General', display_order: 0, status: 'active' };

export default function AdminFaqEdit() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();
  const { data, loading, error } = useFetch(
    () => (isNew ? Promise.resolve({ data: { faq: EMPTY } }) : adminApi.faqs.get(id)),
    [id]
  );
  const faq = data?.faq;
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  usePageMeta(`${isNew ? 'New' : 'Edit'} FAQ | DemoTest Admin`);

  if (faq && form === null) {
    setForm({
      question: faq.question || '', answer: faq.answer || '', category: faq.category || 'General',
      display_order: Number(faq.display_order || 0), status: faq.status || 'active',
    });
  }

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await adminApi.faqs.create(form);
      else await adminApi.faqs.update(id, form);
      push(isNew ? 'FAQ created' : 'FAQ updated');
      navigate('/admin/faqs');
    } catch (err) {
      push(err.userMessage || 'Save failed', 'error');
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AdminPage
      title={isNew ? 'New FAQ' : 'Edit FAQ'}
      subtitle={isNew ? 'Add a question patients ask.' : `Editing: ${form?.question || faq?.question || ''}`}
      loading={loading}
      error={error}
      actions={
        <Link to="/admin/faqs" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      }
    >
      <form onSubmit={save} className="mx-auto grid max-w-2xl gap-4">
        <div><label className="label">Question</label><input required className="field" value={form?.question || ''} onChange={set('question')} /></div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><label className="label">Category</label><input className="field" value={form?.category || ''} onChange={set('category')} placeholder="General" /></div>
          <div><label className="label">Display order</label><input type="number" className="field" value={form?.display_order ?? 0} onChange={set('display_order')} /></div>
          <div><label className="label">Status</label><select className="field" value={form?.status || 'active'} onChange={set('status')}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        </div>
        <div><label className="label">Answer</label><textarea rows={6} className="field resize-y" value={form?.answer || ''} onChange={set('answer')} /></div>
        <div className="flex justify-end gap-3">
          <Link to="/admin/faqs" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">Cancel</Link>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save FAQ'}
          </Button>
        </div>
      </form>
    </AdminPage>
  );
}