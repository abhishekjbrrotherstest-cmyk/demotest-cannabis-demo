import { useState } from 'react';
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Pencil, X, ChevronDown } from 'lucide-react';
import AdminPage from '../../components/admin/AdminPage';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import { adminApi } from '../../api/adminApi';
import { useFetch } from '../../hooks/useFetch';
import { useToast } from '../../context/ToastContext';
import { usePageMeta } from '../../hooks/usePageMeta';

const emptyItem = { label: '', url: '/', status: 'active' };

export default function AdminMenus() {
  usePageMeta('Menus | DemoTest Admin');
  const { push } = useToast();
  const reload = useFetch(() => adminApi.menus.list(), []);
  const [activeId, setActiveId] = useState(null);

  // Default to the first menu once data loads.
  const menus = reload.data?.menus || [];
  const active = activeId ? menus.find((m) => m.id === activeId) : menus[0];

  // Menu management
  const [menuForm, setMenuForm] = useState({ key_name: '', label: '' });
  const [renaming, setRenaming] = useState(false);
  const [renameForm, setRenameForm] = useState({ key_name: '', label: '', status: 'active' });
  const [pendingDeleteMenu, setPendingDeleteMenu] = useState(false);
  const [busyMenu, setBusyMenu] = useState(null);

  // Item management
  const [itemsOpen, setItemsOpen] = useState(true);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [editingItem, setEditingItem] = useState(null);
  const [itemDraft, setItemDraft] = useState(emptyItem);
  const [pendingDeleteItem, setPendingDeleteItem] = useState(null);
  const [busyItem, setBusyItem] = useState(null);

  const afterMutate = (msg) => {
    push(msg);
    reload.refetch?.();
  };

  const addMenu = async (e) => {
    e.preventDefault();
    if (!menuForm.key_name.trim()) return;
    setBusyMenu('create');
    try {
      const { data } = await adminApi.menus.create(menuForm);
      setMenuForm({ key_name: '', label: '' });
      setActiveId(data.menu.id);
      afterMutate('Menu created');
    } catch (err) {
      push(err.userMessage || 'Create failed', 'error');
    } finally {
      setBusyMenu(null);
    }
  };

  const startRename = () => {
    if (!active) return;
    setRenameForm({ key_name: active.key_name, label: active.label, status: active.status });
    setRenaming(true);
  };

  const saveRename = async (e) => {
    e.preventDefault();
    setBusyMenu('rename');
    try {
      await adminApi.menus.update(active.id, renameForm);
      setRenaming(false);
      afterMutate('Menu updated');
    } catch (err) {
      push(err.userMessage || 'Update failed', 'error');
    } finally {
      setBusyMenu(null);
    }
  };

  const deleteMenu = async () => {
    setBusyMenu('delete');
    try {
      await adminApi.menus.remove(active.id);
      setPendingDeleteMenu(false);
      setActiveId(null);
      afterMutate('Menu deleted');
    } catch (err) {
      push(err.userMessage || 'Delete failed', 'error');
    } finally {
      setBusyMenu(null);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!itemForm.label.trim() || !active) return;
    setBusyItem('create');
    try {
      await adminApi.menus.createItem(active.id, itemForm);
      setItemForm(emptyItem);
      afterMutate('Link added');
    } catch (err) {
      push(err.userMessage || 'Add failed', 'error');
    } finally {
      setBusyItem(null);
    }
  };

  const saveItem = async () => {
    setBusyItem('update');
    try {
      await adminApi.menus.updateItem(editingItem.id, itemDraft);
      setEditingItem(null);
      afterMutate('Link updated');
    } catch (err) {
      push(err.userMessage || 'Update failed', 'error');
    } finally {
      setBusyItem(null);
    }
  };

  const deleteItem = async () => {
    setBusyItem('delete');
    try {
      await adminApi.menus.removeItem(pendingDeleteItem.id);
      setPendingDeleteItem(null);
      afterMutate('Link deleted');
    } catch (err) {
      push(err.userMessage || 'Delete failed', 'error');
    } finally {
      setBusyItem(null);
    }
  };

  const move = async (item, direction) => {
    setBusyItem(`move-${item.id}`);
    try {
      await adminApi.menus.moveItem(item.id, direction);
      afterMutate(`Moved ${direction}`);
    } catch (err) {
      push(err.userMessage || 'Move failed', 'error');
    } finally {
      setBusyItem(null);
    }
  };

  const items = active?.items || [];

  return (
    <AdminPage
      title="Menus"
      subtitle="Navigation for the storefront header, mobile drawer, and footer (served via /api/menus)."
      loading={reload.loading}
      error={reload.error}
      actions={
        <Button
          onClick={() => {
            setActiveId(null);
            setRenaming(false);
            setEditingItem(null);
          }}
        >
          <Plus className="h-4 w-4" /> Add menu
        </Button>
      }
    >
      {/* Menu picker */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {menus.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setActiveId(m.id);
              setRenaming(false);
              setEditingItem(null);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              active?.id === m.id ? 'bg-brand text-cream' : 'border border-brand-200 bg-white text-brand-700 hover:bg-brand-50'
            }`}
          >
            {m.label} <span className="opacity-60">({m.items.length})</span>
          </button>
        ))}
      </div>

      {/* Add menu form (shown via "Add menu") */}
      {!active && (
        <form onSubmit={addMenu} className="card-base grid max-w-md gap-3 p-6 sm:grid-cols-2">
          <div>
            <label className="label">Key</label>
            <input
              className="field"
              value={menuForm.key_name}
              onChange={(e) => setMenuForm((f) => ({ ...f, key_name: e.target.value }))}
              placeholder="header"
            />
          </div>
          <div>
            <label className="label">Label</label>
            <input
              className="field"
              value={menuForm.label}
              onChange={(e) => setMenuForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="Primary"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3">
            <Button type="submit" disabled={busyMenu === 'create'}>
              <Save className="h-4 w-4" /> {busyMenu === 'create' ? 'Creating…' : 'Create menu'}
            </Button>
          </div>
        </form>
      )}

      {active && (
        <>
          {/* Menu metadata */}
          <div className="card-base mb-6 flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-semibold text-brand-800">
                {active.label} <span className="ml-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-600">{active.key_name}</span>
              </p>
              <p className="text-xs text-brand-500">
                Status: <span className="font-semibold">{active.status}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={startRename}>
                <Pencil className="h-4 w-4" /> Rename
              </Button>
              <Button variant="danger" size="sm" onClick={() => setPendingDeleteMenu(true)}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>

          {renaming && (
            <form onSubmit={saveRename} className="card-base mb-6 grid max-w-lg gap-3 p-5 sm:grid-cols-3">
              <div>
                <label className="label">Key</label>
                <input className="field" value={renameForm.key_name} onChange={(e) => setRenameForm((f) => ({ ...f, key_name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Label</label>
                <input className="field" value={renameForm.label} onChange={(e) => setRenameForm((f) => ({ ...f, label: e.target.value }))} />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="field" value={renameForm.status} onChange={(e) => setRenameForm((f) => ({ ...f, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <div className="col-span-full flex justify-end gap-3">
                <Button type="submit" disabled={busyMenu === 'rename'}>
                  <Save className="h-4 w-4" /> {busyMenu === 'rename' ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </form>
          )}

          {/* Items */}
          <div className="card-base mb-4 overflow-hidden">
            <button
              type="button"
              onClick={() => setItemsOpen((o) => !o)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-brand-800">Links ({items.length})</span>
              <ChevronDown className={`h-5 w-5 text-brand-500 transition ${itemsOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {itemsOpen && (
            <DataTable
              columns={[
                { key: 'sort_order', label: 'Order', render: (row) => row._index + 1 },
                { key: 'label', label: 'Label' },
                { key: 'url', label: 'URL' },
                { key: 'status', label: 'Status', tone: 'badge' },
              ]}
              rows={items.map((i, idx) => ({ ...i, _index: idx }))}
              actions={(r) => (
                <>
                  <button onClick={() => move(r, 'up')} disabled={busyItem === `move-${r.id}` || r._index === 0} aria-label="Move up" className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-gold-100 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={() => move(r, 'down')} disabled={busyItem === `move-${r.id}` || r._index === items.length - 1} aria-label="Move down" className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-gold-100 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                  <button
                    onClick={() => {
                      setEditingItem(r);
                      setItemDraft({ label: r.label, url: r.url, status: r.status });
                    }}
                    aria-label="Edit"
                    className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-gold-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setPendingDeleteItem(r)} aria-label="Delete" className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </>
              )}
            />
          )}

          {/* Add item */}
          <form onSubmit={addItem} className="card-base mt-4 grid gap-3 p-5 sm:grid-cols-[1fr_1.6fr_1fr_auto]">
            <div>
              <label className="label">Label</label>
              <input className="field" value={itemForm.label} onChange={(e) => setItemForm((f) => ({ ...f, label: e.target.value }))} placeholder="Rewards" />
            </div>
            <div>
              <label className="label">URL</label>
              <input className="field" value={itemForm.url} onChange={(e) => setItemForm((f) => ({ ...f, url: e.target.value }))} placeholder="/rewards" />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="field" value={itemForm.status} onChange={(e) => setItemForm((f) => ({ ...f, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={busyItem === 'create'}>
                <Plus className="h-4 w-4" /> {busyItem === 'create' ? 'Adding…' : 'Add link'}
              </Button>
            </div>
          </form>

          {/* Edit item */}
          {editingItem && (
            <div className="card-base mt-4 grid gap-3 p-5 sm:grid-cols-[1fr_1.6fr_1fr_auto]">
              <div>
                <label className="label">Label</label>
                <input className="field" value={itemDraft.label} onChange={(e) => setItemDraft((f) => ({ ...f, label: e.target.value }))} />
              </div>
              <div>
                <label className="label">URL</label>
                <input className="field" value={itemDraft.url} onChange={(e) => setItemDraft((f) => ({ ...f, url: e.target.value }))} />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="field" value={itemDraft.status} onChange={(e) => setItemDraft((f) => ({ ...f, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={saveItem} disabled={busyItem === 'update'}>
                  <Save className="h-4 w-4" /> {busyItem === 'update' ? 'Saving…' : 'Save'}
                </Button>
                <Button variant="ghost" onClick={() => setEditingItem(null)}>
                  <X className="h-4 w-4" /> Cancel
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={pendingDeleteMenu}
        onClose={() => !busyMenu && setPendingDeleteMenu(false)}
        onConfirm={deleteMenu}
        busy={busyMenu === 'delete'}
        title="Delete menu?"
        message={`Delete "${active?.label}" and all of its links? This cannot be undone.`}
      />
      <ConfirmDialog
        open={Boolean(pendingDeleteItem)}
        onClose={() => !busyItem && setPendingDeleteItem(null)}
        onConfirm={deleteItem}
        busy={busyItem === 'delete'}
        title="Delete link?"
        message={`Delete "${pendingDeleteItem?.label}" from the menu?`}
      />
    </AdminPage>
  );
}