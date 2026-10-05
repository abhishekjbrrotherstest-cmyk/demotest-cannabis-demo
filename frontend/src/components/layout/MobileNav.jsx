import { Link, NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useMenus, FALLBACK_MENUS } from '../../context/MenusContext';

export default function MobileNav({ open, onClose }) {
  const { menus } = useMenus();
  const drawerLinks = menus.mobile || FALLBACK_MENUS.mobile;
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[80] md:hidden">
      <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-brand-900/50" />
      <div className="absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-cream shadow-lift">
        <div className="flex items-center justify-between border-b border-brand-100 p-5">
          <span className="font-display text-lg font-semibold text-brand">DEMOTEST</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-10 w-10 place-items-center rounded-xl text-brand hover:bg-brand-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-4">
          {drawerLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-base font-semibold transition ${
                  isActive ? 'bg-brand text-cream' : 'text-brand-700 hover:bg-brand-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-brand-100 p-4 text-xs text-brand-500">
          Must be 18+ with a valid PA medical card.
        </div>
      </div>
    </div>,
    document.body
  );
}