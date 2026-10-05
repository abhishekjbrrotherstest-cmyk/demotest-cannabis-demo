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
import { SkeletonList } from '../../components/ui/Skeleton';

function BannerEditor({ id }) {
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();
  const { data, loading, error } = useFetch(
    () => (isNew ? Promise.resolve({ data: { banner: {} } }) : adminApi.home.getBanner(id)),
    [id]
  );
  const banner = data?.banner;
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  if (banner && form === null) {
    setForm({
      title: banner.title || '', subtitle: banner.subtitle || '', image_url: banner.image_url || '',
      mobile_image_url: banner.mobile_image_url || '', cta_primary_text: banner.cta_primary_text || '',
      cta_primary_link: banner.cta_primary_link || '', cta_secondary_text: banner.cta_secondary_text || '',
      cta_secondary_link: banner.cta_secondary_link || '', overlay_opacity: Number(banner.overlay_opacity ?? 55),
      display_order: Number(banner.display_order || 1), status: banner.status || 'active',
    });
  }

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await adminApi.home.createBanner(form);
      else await adminApi.home.updateBanner(id, form);
      push(isNew ? 'Banner created' : 'Banner updated');
      navigate('/admin/home');
    } catch (err) {
      push(err.userMessage || 'Save failed', 'error');
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const F = ({ k, label, type = 'text', required, placeholder, span2 }) => (
    <div className={span2 ? 'sm:col-span-2' : ''}>
      <label className="label">{label}</label>
      <input required={required} type={type} className="field" value={form?.[k] || ''} onChange={set(k)} placeholder={placeholder} />
    </div>
  );

  return (
    <AdminPage
      title={isNew ? 'New hero banner' : 'Edit hero banner'}
      loading={loading}
      error={error}
      actions={<Link to="/admin/home" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream"><ArrowLeft className="h-4 w-4" /> Back</Link>}
    >
      <form onSubmit={save} className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        <F k="title" label="Title" required span2 />
        <F k="subtitle" label="Subtitle" span2 />
        <F k="image_url" label="Image URL" required placeholder="https://images.unsplash.com/…" span2 />
        <F k="mobile_image_url" label="Mobile image URL (optional)" span2 />
        <F k="cta_primary_text" label="Primary CTA text" placeholder="Shop the Menu" />
        <F k="cta_primary_link" label="Primary CTA link" placeholder="/shop" />
        <F k="cta_secondary_text" label="Secondary CTA text" placeholder="Find a Store" />
        <F k="cta_secondary_link" label="Secondary CTA link" placeholder="/locations" />
        <F k="overlay_opacity" label="Overlay opacity (0–100)" type="number" />
        <F k="display_order" label="Display order" type="number" />
        <div><label className="label">Status</label><select className="field" value={form?.status || 'active'} onChange={set('status')}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link to="/admin/home" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">Cancel</Link>
          <Button type="submit" disabled={saving}><Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save banner'}</Button>
        </div>
      </form>
    </AdminPage>
  );
}

function SectionEditor({ id }) {
  const isNew = id === 'new';
  const navigate = useNavigate();
  const { push } = useToast();
  const { data, loading, error } = useFetch(
    () => (isNew ? Promise.resolve({ data: { section: {} } }) : adminApi.home.getSection(id)),
    [id]
  );
  const section = data?.section;
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  if (section && form === null) {
    setForm({
      section_key: section.section_key || 'custom', title: section.title || '', subtitle: section.subtitle || '',
      description: section.description || '', image_url: section.image_url || '', cta_text: section.cta_text || '',
      cta_link: section.cta_link || '', background_color: section.background_color || 'cream',
      display_order: Number(section.display_order || 1), status: section.status || 'active',
    });
  }

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await adminApi.home.createSection(form);
      else await adminApi.home.updateSection(id, form);
      push(isNew ? 'Section created' : 'Section updated');
      navigate('/admin/home');
    } catch (err) {
      push(err.userMessage || 'Save failed', 'error');
      setSaving(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const SECTION_TYPES = ['hero', 'trust-badges', 'store-locator', 'medical-card', 'faq-preview', 'rewards', 'community', 'blog-preview', 'newsletter', 'custom'];

  return (
    <AdminPage
      title={isNew ? 'New home section' : 'Edit home section'}
      loading={loading}
      error={error}
      actions={<Link to="/admin/home" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream"><ArrowLeft className="h-4 w-4" /> Back</Link>}
    >
      <form onSubmit={save} className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
        <div><label className="label">Section key</label><select className="field" value={form?.section_key || 'custom'} onChange={set('section_key')}>{SECTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
        <div><label className="label">Display order</label><input type="number" className="field" value={form?.display_order ?? 1} onChange={set('display_order')} /></div>
        <div className="sm:col-span-2"><label className="label">Title</label><input className="field" value={form?.title || ''} onChange={set('title')} /></div>
        <div className="sm:col-span-2"><label className="label">Subtitle</label><input className="field" value={form?.subtitle || ''} onChange={set('subtitle')} /></div>
        <div className="sm:col-span-2"><label className="label">Description</label><textarea rows={3} className="field resize-none" value={form?.description || ''} onChange={set('description')} /></div>
        <div className="sm:col-span-2"><label className="label">Image URL</label><input className="field" value={form?.image_url || ''} onChange={set('image_url')} placeholder="https://images.unsplash.com/…" /></div>
        <div><label className="label">CTA text</label><input className="field" value={form?.cta_text || ''} onChange={set('cta_text')} /></div>
        <div><label className="label">CTA link</label><input className="field" value={form?.cta_link || ''} onChange={set('cta_link')} placeholder="/faq" /></div>
        <div><label className="label">Background</label><select className="field" value={form?.background_color || 'cream'} onChange={set('background_color')}><option value="cream">Cream</option><option value="brand">Brand green</option><option value="alt">Alt (light green)</option><option value="dark">Dark</option></select></div>
        <div><label className="label">Status</label><select className="field" value={form?.status || 'active'} onChange={set('status')}><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        <div className="sm:col-span-2 flex justify-end gap-3">
          <Link to="/admin/home" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">Cancel</Link>
          <Button type="submit" disabled={saving}><Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save section'}</Button>
        </div>
      </form>
    </AdminPage>
  );
}

function HomeList() {
  usePageMeta('Home Page | DemoTest Admin');
  const navigate = useNavigate();
  const { push } = useToast();
  const banners = useFetch(() => adminApi.home.listBanners(), []);
  const sections = useFetch(() => adminApi.home.listSections(), []);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const remove = async () => {
    setDeleting(true);
    try {
      if (pendingDelete.kind === 'section') {
        await adminApi.home.removeSection(pendingDelete.id);
      } else {
        await adminApi.home.removeBanner(pendingDelete.id);
      }
      push(`${pendingDelete.kind === 'section' ? 'Section' : 'Banner'} deleted`);
      setPendingDelete(null);
      banners.refetch();
      sections.refetch();
    } catch (err) {
      push(err.userMessage || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const bannerRows = (banners.data?.banners || []).map((b) => ({
    id: b.id,
    display_order: b.display_order,
    title: b.title,
    cta: [b.cta_primary_link, b.cta_secondary_link].filter(Boolean).join(' · '),
    status: b.status,
  }));
  const sectionRows = (sections.data?.sections || []).map((s) => ({
    id: s.id,
    display_order: s.display_order,
    section_key: s.section_key,
    title: s.title || '(no title)',
    status: s.status,
  }));

  return (
    <AdminPage title="Home Page" subtitle="Hero banners and the sections rendered on the homepage.">
      <div className="mb-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-brand-800">Hero banners</h2>
          <Button size="sm" onClick={() => navigate('/admin/home/banners/new')}><Plus className="h-4 w-4" /> Add banner</Button>
        </div>
        {banners.loading ? (
          <SkeletonList count={3} />
        ) : (
          <DataTable
            columns={[
              { key: 'display_order', label: 'Order' },
              { key: 'title', label: 'Title' },
              { key: 'cta', label: 'CTAs' },
              { key: 'status', label: 'Status', tone: 'badge' },
            ]}
            rows={bannerRows}
            actions={(r) => (
              <>
                <button onClick={() => navigate(`/admin/home/banners/${r.id}`)} aria-label="Edit banner" className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-gold-100"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setPendingDelete({ ...r, kind: 'banner' })} aria-label="Delete banner" className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </>
            )}
          />
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-brand-800">Home sections</h2>
          <Button size="sm" onClick={() => navigate('/admin/home/sections/new')}><Plus className="h-4 w-4" /> Add section</Button>
        </div>
        {sections.loading ? (
          <SkeletonList count={5} />
        ) : (
          <DataTable
            columns={[
              { key: 'display_order', label: 'Order' },
              { key: 'section_key', label: 'Key' },
              { key: 'title', label: 'Title' },
              { key: 'status', label: 'Status', tone: 'badge' },
            ]}
            rows={sectionRows}
            actions={(r) => (
              <>
                <button onClick={() => navigate(`/admin/home/sections/${r.id}`)} aria-label="Edit section" className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-gold-100"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setPendingDelete({ ...r, kind: 'section' })} aria-label="Delete section" className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </>
            )}
          />
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => !deleting && setPendingDelete(null)}
        onConfirm={remove}
        busy={deleting}
        title={pendingDelete?.kind === 'section' ? 'Delete section?' : 'Delete banner?'}
        message={`Delete this ${pendingDelete?.kind === 'section' ? 'home section' : 'hero banner'}? This cannot be undone.`}
      />
    </AdminPage>
  );
}

export default function AdminHome() {
  const params = useParams();
  if (params.id) {
    return window.location.pathname.includes('/home/banners/') ? <BannerEditor id={params.id} /> : <SectionEditor id={params.id} />;
  }
  return <HomeList />;
}