import { Link } from 'react-router-dom';
import { Leaf, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { storeApi } from '../../api/storeApi';
import { useEffect } from 'react';
import Badge from '../ui/Badge';
import { useMenus, FALLBACK_MENUS } from '../../context/MenusContext';

export default function Footer() {
  const [stores, setStores] = useState([]);
  const [email, setEmail] = useState('');
  const { push } = useToast();
  const { menus } = useMenus();
  const quickLinks = menus.footer || FALLBACK_MENUS.footer;

  useEffect(() => {
    storeApi
      .getStores()
      .then(({ data }) => setStores(data.stores))
      .catch(() => setStores([]));
  }, []);

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    push('Subscribed to the newsletter (mock)');
    setEmail('');
  };

  return (
    <footer className="mt-20 border-t border-brand-100 bg-brand text-cream">
      <div className="container-page py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-brand">D</span>
              <div>
                <p className="font-display text-lg font-semibold leading-tight">DEMOTEST</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-300">Cannabis Co.</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">
              A patient-first Pennsylvania medical cannabis dispensary demo. Five locations across the
              state, order-ahead menus, and education for every patient.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Social link (demo)"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-brand-800 text-cream/80 transition hover:bg-gold hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-gold-300">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((l, i) => (
                <li key={`${l.to}-${i}`}>
                  <Link to={l.to} className="text-cream/70 transition hover:text-gold-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-gold-300">Locations</h3>
            <ul className="space-y-2.5 text-sm">
              {stores.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link to={`/locations/${s.slug}`} className="inline-flex items-center gap-1.5 text-cream/70 transition hover:text-gold-300">
                    <MapPin className="h-3.5 w-3.5" />
                    {s.name.replace(/^DemoTest\s*/, '')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4 text-gold-300">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Accessibility', to: '/accessibility' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-cream/70 transition hover:text-gold-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <form onSubmit={onSubscribe} className="mt-6">
              <label htmlFor="newsletter-email" className="eyebrow mb-2 block text-gold-300">
                Newsletter
              </label>
              <div className="flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-h-11 w-full rounded-xl border border-brand-600 bg-brand-800 px-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gold px-4 text-sm font-semibold text-brand transition hover:bg-gold-500"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-brand-600 pt-7 sm:flex-row">
          <p className="text-xs text-cream/60">
            Must be 18+ with a valid PA medical card. Demo project — not a real dispensary.
          </p>
          <Badge tone="gold">Demo Mode</Badge>
          <p className="text-xs text-cream/60">© {new Date().getFullYear()} DemoTest Cannabis Co. (fictional)</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 border-t border-brand-600 py-3 text-[11px] text-cream/40">
        <Leaf className="h-3.5 w-3.5" />
        For the demo: Dutchie menu loads the real embed URL; a mock menu appears only if embedding is blocked.
      </div>
    </footer>
  );
}