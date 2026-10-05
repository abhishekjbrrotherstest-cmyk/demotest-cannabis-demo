import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import AdminPage from '../../components/admin/AdminPage';
import Button from '../../components/ui/Button';
import { adminApi } from '../../api/adminApi';
import { useFetch } from '../../hooks/useFetch';
import { useToast } from '../../context/ToastContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { DUTCHIE_URL } from '../../api/dutchieApi';

const DUTCHIE_EMBED_URL = import.meta.env.VITE_DUTCHIE_EMBED_URL || DUTCHIE_URL;

const EMPTY = {
  slug: '', name: '', address: '', city: '', state: 'PA', zip: '',
  latitude: '', longitude: '', phone: '', email: '', description: '',
  image_url: '', dutchie_menu_id: '', dutchie_menu_url: DUTCHIE_EMBED_URL,
  parking_info: '', accessibility_info: '', status: 'active',
};

export default function AdminStoresEdit() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();
  const { data, loading, error } = useFetch(
    () => (isNew ? Promise.resolve({ data: { store: EMPTY } }) : adminApi.stores.get(id)),
    [id]
  );
  const store = data?.store;
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  usePageMeta(`${isNew ? 'New' : 'Edit'} Store | DemoTest Admin`);

  if (store && form === null) {
    setForm({
      slug: store.slug || '', name: store.name || '', address: store.address || '',
      city: store.city || '', state: store.state || 'PA', zip: store.zip || '',
      latitude: store.latitude ?? '', longitude: store.longitude ?? '', phone: store.phone || '',
      email: store.email || '', description: store.description || '', image_url: store.image_url || '',
      dutchie_menu_id: store.dutchie_menu_id || '', dutchie_menu_url: store.dutchie_menu_url || DUTCHIE_EMBED_URL,
      parking_info: store.parking_info || '', accessibility_info: store.accessibility_info || '', status: store.status || 'active',
    });
  }

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await adminApi.stores.create(form);
      else await adminApi.stores.update(id, form);
      push(isNew ? 'Store created' : 'Store updated');
      navigate('/admin/stores');
    } catch (err) {
      push(err.userMessage || 'Save failed', 'error');
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AdminPage
      title={isNew ? 'Add store' : 'Edit store'}
      subtitle={isNew ? 'Add a new DemoTest location.' : `Editing: ${form?.name || store?.name || ''}`}
      loading={loading}
      error={error}
      actions={
        <Link to="/admin/stores" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      }
    >
      <form onSubmit={save} className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        <div><label className="label">Name</label><input required className="field" value={form?.name || ''} onChange={set('name')} placeholder="DemoTest Pittsburgh" /></div>
        <div><label className="label">Slug</label><input required className="field" value={form?.slug || ''} onChange={set('slug')} placeholder="pittsburgh" /></div>
        <div className="sm:col-span-2"><label className="label">Address</label><input required className="field" value={form?.address || ''} onChange={set('address')} /></div>
        <div><label className="label">City</label><input required className="field" value={form?.city || ''} onChange={set('city')} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">State</label><input className="field" value={form?.state || 'PA'} onChange={set('state')} /></div>
          <div><label className="label">ZIP</label><input required className="field" value={form?.zip || ''} onChange={set('zip')} /></div>
        </div>
        <div><label className="label">Latitude</label><input type="number" step="any" className="field" value={form?.latitude ?? ''} onChange={set('latitude')} /></div>
        <div><label className="label">Longitude</label><input type="number" step="any" className="field" value={form?.longitude ?? ''} onChange={set('longitude')} /></div>
        <div><label className="label">Phone</label><input className="field" value={form?.phone || ''} onChange={set('phone')} /></div>
        <div><label className="label">Email</label><input type="email" className="field" value={form?.email || ''} onChange={set('email')} /></div>
        <div><label className="label">Status</label><select className="field" value={form?.status || 'active'} onChange={set('status')}><option value="active">Active</option><option value="closed">Closed</option></select></div>
        <div><label className="label">Dutchie menu ID</label><input className="field" value={form?.dutchie_menu_id || ''} onChange={set('dutchie_menu_id')} placeholder="demotest-pittsburgh" /></div>
        <div className="sm:col-span-2"><label className="label">Dutchie menu URL</label><input className="field" value={form?.dutchie_menu_url || ''} onChange={set('dutchie_menu_url')} /></div>
        <div className="sm:col-span-2"><label className="label">Image URL</label><input className="field" value={form?.image_url || ''} onChange={set('image_url')} /></div>
        <div className="sm:col-span-2"><label className="label">Description</label><textarea rows={3} className="field resize-none" value={form?.description || ''} onChange={set('description')} /></div>
        <div className="sm:col-span-2"><label className="label">Parking info</label><textarea rows={2} className="field resize-none" value={form?.parking_info || ''} onChange={set('parking_info')} /></div>
        <div className="sm:col-span-2"><label className="label">Accessibility info</label><textarea rows={2} className="field resize-none" value={form?.accessibility_info || ''} onChange={set('accessibility_info')} /></div>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link to="/admin/stores" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">Cancel</Link>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save store'}
          </Button>
        </div>
      </form>
    </AdminPage>
  );
}