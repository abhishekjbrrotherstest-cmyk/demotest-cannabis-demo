import { useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import { DUTCHIE_URL } from '../../api/dutchieApi';

export default function CartDrawer({ open, onClose }) {
  const { items, remove, setQty, clear, count, subtotal } = useCart();
  const { push } = useToast();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const onCheckout = () => {
    window.open(DUTCHIE_URL, '_blank', 'noopener,noreferrer');
    push('Redirecting to the real Dutchie checkout (new tab)');
    clear();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[85]">
      <button type="button" aria-label="Close cart" onClick={onClose} className="absolute inset-0 bg-brand-900/50" />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-lift"
      >
        <div className="flex items-center justify-between border-b border-brand-100 p-5">
          <h2 className="flex items-center gap-2 text-xl text-brand-800">
            <ShoppingCart className="h-5 w-5 text-gold-600" /> Your Cart{' '}
            {count > 0 && <span className="text-sm text-brand-500">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center rounded-xl text-brand hover:bg-brand-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-brand-200" />
            <p className="mt-4 font-semibold text-brand-800">Your cart is empty</p>
            <p className="mt-1 text-sm text-brand-700/70">
              Add items from the menu — in preview mode, checkout happens on the real Dutchie site.
            </p>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="card-base flex gap-4 p-4">
                  <img src={product.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-brand-800">{product.name}</p>
                        <p className="text-xs text-brand-500">{product.weight}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-brand-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label="Decrease quantity"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-brand-100 text-brand transition hover:bg-brand-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-brand-800">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label="Increase quantity"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-brand-100 text-brand transition hover:bg-brand-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-brand-800">
                        ${(Number(product.price) * qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-brand-100 bg-white p-5">
              <div className="flex items-center justify-between text-base font-semibold text-brand-800">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-xs text-brand-500">
                Tax and fees are calculated at checkout on Dutchie.
              </p>
              <Button onClick={onCheckout} className="mt-4 w-full" size="lg">
                Checkout on Dutchie
              </Button>
              <button
                type="button"
                onClick={() => {
                  clear();
                  push('Cart cleared');
                }}
                className="mt-2 w-full text-center text-sm text-brand-500 underline transition hover:text-brand-700"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>,
    document.body
  );
}