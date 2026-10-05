import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import AdminPage from '../../components/admin/AdminPage';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import { adminApi } from '../../api/adminApi';
import { storeApi } from '../../api/storeApi';
import { useFetch } from '../../hooks/useFetch';
import { useToast } from '../../context/ToastContext';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminStores() {
  usePageMeta('Stores | DemoTest Admin');
  const navigate = useNavigate();
  const { push } = useToast();
  const reload = useFetch(() => storeApi.getStores(), []);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.stores.remove(pendingDelete.id);
      push('Store deleted');
      setPendingDelete(null);
      reload.refetch?.();
    } catch (err) {
      push(err.userMessage || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminPage
      title="Stores"
      subtitle="Manage the five PA locations."
      loading={reload.loading}
      error={reload.error}
      actions={
        <Button onClick={() => navigate('/admin/stores/new')}>
          <Plus className="h-4 w-4" /> Add store
        </Button>
      }
    >
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'city', label: 'City' },
          { key: 'address', label: 'Address' },
          { key: 'status', label: 'Status', tone: 'badge' },
          {
            key: 'dutchie_menu_url',
            label: 'Dutchie Menu',
            render: (r) => (r.dutchie_menu_url ? <Badge tone="green">Real URL set</Badge> : <Badge tone="red">None</Badge>),
          },
        ]}
        rows={reload.data?.stores || []}
        actions={(r) => (
          <>
            <button onClick={() => navigate(`/admin/stores/${r.id}/edit`)} aria-label={`Edit ${r.name}`} className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-gold-100"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => setPendingDelete(r)} aria-label={`Delete ${r.name}`} className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </>
        )}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => !deleting && setPendingDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
        title="Delete store?"
        message={`Delete "${pendingDelete?.name}"? This cannot be undone.`}
      />
    </AdminPage>
  );
}