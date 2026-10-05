import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminLogin() {
  usePageMeta('Admin Login | DemoTest Cannabis Co.');
  const { user, login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@demotest.test');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const u = await login(email, password);
      push(`Welcome back, ${u.first_name}!`);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.userMessage || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const quickFill = async (em) => {
    setEmail(em);
    setPassword(em.includes('admin') ? 'Admin123!' : em.includes('subadmin') ? 'SubAdmin123!' : em.includes('manager') ? 'Manager123!' : 'Market123!');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-800 p-4">
      <div className="card-base w-full max-w-md overflow-hidden">
        <div className="border-b border-brand-100 bg-brand-50/60 p-7">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-cream">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-2xl text-brand-800">Admin Login</h1>
          <p className="mt-1 text-sm text-brand-600">
            Use the demo accounts from the README. All actions are audit-logged.
          </p>
          <div className="mt-3">
            <Badge tone="gold">Demo Credentials</Badge>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 p-7">
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div>
            <label htmlFor="admin-email" className="label">Email</label>
            <input
              id="admin-email"
              type="email"
              required
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="label">Password</label>
            <input
              id="admin-password"
              type="password"
              required
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
          <div className="pt-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-500">
              Quick fill (demo)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['admin@demotest.test', 'Super Admin'],
                ['subadmin@demotest.test', 'Admin'],
                ['manager@demotest.test', 'Store Manager'],
                ['marketing@demotest.test', 'Marketing'],
              ].map(([em, label]) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => quickFill(em)}
                  className="rounded-xl border border-brand-100 px-3 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={async () => {
                try {
                  await authApi.forgotPassword(email);
                  push('Reset link sent (mock)');
                } catch (err) {
                  push(err.userMessage || 'Request failed', 'error');
                }
              }}
              className="mt-3 text-xs text-brand-500 underline hover:text-brand-700"
            >
              Forgot password? (mock)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}