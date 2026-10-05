import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'demotest_cart';

const CartContext = createContext(null);

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        return prev.map((i) => (i.product_id === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { product_id: product.id, product, qty }];
    });
  };

  const remove = (productId) => setItems((prev) => prev.filter((i) => i.product_id !== productId));
  const clear = () => setItems([]);

  const setQty = (productId, qty) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.product_id !== productId)
        : prev.map((i) => (i.product_id === productId ? { ...i, qty } : i))
    );

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + (Number(i.product.price) || 0) * i.qty, 0);

  const value = useMemo(
    () => ({ items, add, remove, clear, setQty, count, subtotal }),
    [items] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}