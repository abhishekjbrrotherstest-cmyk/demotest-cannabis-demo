import { Users, Store, FileText, HelpCircle, Briefcase, MessagesSquare } from 'lucide-react';
import AdminPage from '../../components/admin/AdminPage';
import StatCard from '../../components/admin/StatCard';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/ui/Badge';
import { adminApi } from '../../api/adminApi';
import { useFetch } from '../../hooks/useFetch';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminDashboard() {
  usePageMeta('Dashboard | DemoTest Admin');
  const { data, loading, error } = useFetch(() => adminApi.dashboard(), []);
  const stats = data?.stats || {};
  const contacts = data?.recentContacts || [];
  const logs = data?.auditLogs || [];

  return (
    <AdminPage title="Dashboard" subtitle="Overview of your demo dispensary." loading={loading} error={error}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Users" value={stats.users ?? 0} icon={Users} accent="brand" />
        <StatCard label="Stores" value={stats.stores ?? 0} icon={Store} accent="gold" />
        <StatCard label="Blog Posts" value={stats.posts ?? 0} icon={FileText} accent="green" />
        <StatCard label="FAQs" value={stats.faqs ?? 0} icon={HelpCircle} accent="amber" />
        <StatCard label="Open Careers" value={stats.careers ?? 0} icon={Briefcase} accent="green" />
        <StatCard label="Contact Messages" value={stats.messages ?? 0} icon={MessagesSquare} accent="gold" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg text-brand-800">Recent Contact Messages</h2>
          <DataTable
            columns={[
              { key: 'name', label: 'Sender', render: (r) => `${r.first_name} ${r.last_name}` },
              { key: 'email', label: 'Email' },
              { key: 'subject', label: 'Subject' },
              { key: 'created_at', label: 'Date', render: (r) => new Date(r.created_at).toLocaleDateString() },
            ]}
            rows={contacts}
          />
        </section>
        <section>
          <h2 className="mb-3 text-lg text-brand-800">Recent Audit Log</h2>
          <DataTable
            columns={[
              { key: 'action', label: 'Action' },
              { key: 'entity', label: 'Entity' },
              { key: 'user_email', label: 'User', render: (r) => r.user_email || <Badge tone="gray">system</Badge> },
              { key: 'created_at', label: 'When', render: (r) => new Date(r.created_at).toLocaleString() },
            ]}
            rows={logs}
          />
        </section>
      </div>
    </AdminPage>
  );
}