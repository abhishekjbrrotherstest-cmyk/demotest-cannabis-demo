import { Link, NavLink } from 'react-router-dom';
import { MapPin, Menu } from 'lucide-react';
import { useState } from 'react';
import { useMenus, FALLBACK_MENUS } from '../../context/MenusContext';
import MobileNav from './MobileNav';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { menus } = useMenus();
  const navLinks = menus.header || FALLBACK_MENUS.header;

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100/60 bg-cream/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="DemoTest Cannabis Co. home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-lg font-bold text-cream">D</span>
          <span className="hidden font-display text-lg font-semibold leading-tight text-brand sm:block">
            DEMOTEST
            <span className="block text-[11px] font-sans font-semibold uppercase tracking-[0.28em] text-gold-600">
              Cannabis Co.
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `text-sm font-semibold transition hover:text-gold-600 ${
                  isActive ? 'text-gold-600' : 'text-brand-700'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            to="/locations"
            className="hidden items-center gap-1.5 rounded-xl border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-cream sm:inline-flex"
          >
            <MapPin className="h-4 w-4" />
            Find a Store
          </Link>
          <Link
            to="/shop"
            className="hidden items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-cream transition hover:bg-brand-600 sm:inline-flex"
          >
            Shop Now
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="grid h-11 w-11 place-items-center rounded-xl border border-brand-100 bg-white text-brand md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}