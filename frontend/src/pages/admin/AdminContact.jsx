import { Trash2, Mail, Phone, MessageSquareText } from 'lucide-react';
import AdminPage from '../../components/admin/AdminPage';
import DataTable from '../../components/admin/DataTable';
import { adminApi } from '../../api/adminApi';
import { useFetch } from '../../hooks/useFetch';
import { useToast } from '../../context/ToastContext';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminContact() {
  usePageMeta('Contact | DemoTest Admin');
  const { push } = useToast();
  const reload = useFetch(() => adminApi.contact.list(), []);

  const remove = async (m) => {
    try {
      await adminApi.contact.remove(m.id);
      push('Message deleted');
      reload.refetch?.();
    } catch (err) {
      push(err.userMessage || 'Delete failed', 'error');
    }
  };

  return (
    <AdminPage title="Contact Messages" subtitle="Messages submitted via the public contact form."
      loading={reload.loading} error={reload.error}>
      <DataTable
        columns={[
          { key: 'name', label: 'Sender', render: (r) => `${r.first_name} ${r.last_name}` },
          { key: 'email', label: 'Email', render: (r) => <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gold-500" />{r.email}</span> },
          { key: 'phone', label: 'Phone', render: (r) => r.phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gold-500" />{r.phone}</span> : '—' },
          { key: 'subject', label: 'Subject' },
          { key: 'created_at', label: 'Received', render: (r) => new Date(r.created_at).toLocaleString() },
        ]}
        rows={reload.data?.messages || []}
        actions={(r) => (
          <button onClick={() => remove(r)} aria-label="Delete message" className="grid h-9 w-9 place-items-center rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
        )}
      />
      {reload.data?.messages?.length > 0 && (
        <div className="card-base mt-6 p-6">
          <h2 className="mb-3 flex items-center gap-2 text-lg text-brand-800"><MessageSquareText className="h-5 w-5 text-gold-600" /> Latest body</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-brand-800/85">
            {reload.data.messages[0]?.message}
          </p>
        </div>
      )}
    </AdminPage>
  );
}