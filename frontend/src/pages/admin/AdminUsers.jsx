import AdminPage from '../../components/admin/AdminPage';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/ui/Badge';
import { adminApi } from '../../api/adminApi';
import { useFetch } from '../../hooks/useFetch';
import { useToast } from '../../context/ToastContext';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminUsers() {
  usePageMeta('Users | DemoTest Admin');
  const { push } = useToast();
  const reload = useFetch(() => adminApi.users.list(), []);

  const toggleStatus = async (u) => {
    const next = u.status === 'active' ? 'inactive' : 'active';
    try {
      await adminApi.users.setStatus(u.id, next);
      push(`${u.first_name} ${u.last_name} → ${next}`);
      reload.refetch?.();
    } catch (err) {
      push(err.userMessage || 'Update failed', 'error');
    }
  };

  return (
    <AdminPage title="Users" subtitle="Staff accounts and roles. Status changes require permission."
      loading={reload.loading} error={reload.error}>
      <DataTable
        columns={[
          { key: 'name', label: 'Name', render: (r) => (
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 font-semibold text-brand">{r.first_name?.[0]}{r.last_name?.[0]}</span>
              {r.first_name} {r.last_name}
            </div>
          ) },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role', render: (r) => <Badge tone="gold">{r.role}</Badge> },
          { key: 'store', label: 'Store', render: (r) => r.store?.name || '—' },
          { key: 'status', label: 'Status', tone: 'badge' },
        ]}
        rows={reload.data?.users || []}
        actions={(r) => (
          <button
            type="button"
            onClick={() => toggleStatus(r)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
              r.status === 'active'
                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {r.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        )}
      />
    </AdminPage>
  );
}