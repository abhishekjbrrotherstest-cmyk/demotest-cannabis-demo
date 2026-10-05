import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import AdminPage from '../../components/admin/AdminPage';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import { adminApi } from '../../api/adminApi';
import { useFetch } from '../../hooks/useFetch';
import { useToast } from '../../context/ToastContext';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminFAQs() {
  usePageMeta('FAQs | DemoTest Admin');
  const navigate = useNavigate();
  const { push } = useToast();
  const reload = useFetch(() => adminApi.faqs.list(), []);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.faqs.remove(pendingDelete.id);
      push('FAQ deleted');
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
      title="FAQs"
      loading={reload.loading}
      error={reload.error}
      actions={
        <Button onClick={() => navigate('/admin/faqs/new')}>
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      }
    >
      <DataTable
        columns={[
          { key: 'question', label: 'Question' },
          { key: 'category', label: 'Category' },
          { key: 'display_order', label: 'Order' },
          { key: 'status', label: 'Status', tone: 'badge' },
        ]}
        rows={reload.data?.faqs || []}
        actions={(r) => (
          <>
            <button onClick={() => navigate(`/admin/faqs/${r.id}/edit`)} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-gold-100"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => setPendingDelete(r)} aria-label="Delete" className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </>
        )}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => !deleting && setPendingDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
        title="Delete FAQ?"
        message={`Delete "${pendingDelete?.question}"? This cannot be undone.`}
      />
    </AdminPage>
  );
}