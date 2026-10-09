import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../shop/CartDrawer';
import { useCart } from '../../context/CartContext';
import { MenusProvider } from '../../context/MenusContext';

export default function Layout() {
  const { pathname } = useLocation();
  const { items } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Scroll to hash target if present (e.g. from a footer link).
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pathname]);

  // Auto-close the cart when it becomes empty.
  useEffect(() => {
    if (!cartOpen) return;
    if (items.length === 0) setCartOpen(false);
  }, [items, cartOpen]);

  return (
    <MenusProvider>
      <div className="flex min-h-screen flex-col">
        <Header onOpenCart={() => setCartOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </MenusProvider>
  );
}