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

export default function AdminBlog() {
  usePageMeta('Blog Posts | DemoTest Admin');
  const navigate = useNavigate();
  const { push } = useToast();
  const reload = useFetch(() => adminApi.blog.list(), []);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.blog.remove(pendingDelete.id);
      push('Post deleted');
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
      title="Blog Posts"
      loading={reload.loading}
      error={reload.error}
      actions={
        <Button onClick={() => navigate('/admin/blog/new')}>
          <Plus className="h-4 w-4" /> New post
        </Button>
      }
    >
      <DataTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'author', label: 'Author' },
          { key: 'status', label: 'Status', tone: 'badge' },
          { key: 'created_at', label: 'Posted', render: (r) => new Date(r.created_at).toLocaleDateString() },
        ]}
        rows={reload.data?.posts || []}
        actions={(r) => (
          <>
            <button onClick={() => navigate(`/admin/blog/${r.id}/edit`)} aria-label={`Edit ${r.title}`} className="grid h-9 w-9 place-items-center rounded-lg text-brand-600 hover:bg-gold-100"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => setPendingDelete(r)} aria-label={`Delete ${r.title}`} className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
          </>
        )}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => !deleting && setPendingDelete(null)}
        onConfirm={confirmDelete}
        busy={deleting}
        title="Delete post?"
        message={`Delete "${pendingDelete?.title}"? This cannot be undone.`}
      />
    </AdminPage>
  );
}