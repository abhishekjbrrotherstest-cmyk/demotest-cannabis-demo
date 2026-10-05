import { useState } from 'react';
import { Store, Lock } from 'lucide-react';
import PromoBanner from './PromoBanner';
import CategoryTabs from './CategoryTabs';
import ProductCard from './ProductCard';
import { dutchieApi, DUTCHIE_URL } from '../../api/dutchieApi';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonGrid } from '../ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';

/**
 * MockDutchieMenu — visual fallback that mimics Dutchie's embedded layout.
 * ONLY rendered when the real iframe fails to load.
 */
export default function MockDutchieMenu({ storeId, storeName, realUrl }) {
  const { push } = useToast();
  const { add } = useCart();
  const [active, setActive] = useState('All');
  const { data, loading, error } = useFetch(() => dutchieApi.menu(storeId), [storeId]);

  const categories = ['All', ...(data?.categories || [])];
  const products =
    active === 'All' ? data?.products || [] : (data?.products || []).filter((p) => p.category === active);

  const onAdd = (p) => {
    add(p);
    push(`${p.name} added to cart (preview mode)`);
  };

  return (
    <div className="overflow-hidden rounded-b-2xl border border-brand-100 bg-white">
      {/* Dutchie-style top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brand p-4 text-cream">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-brand">
            <Store className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display font-semibold leading-tight">{storeName} (Demo)</p>
            <span className="inline-flex items-center gap-1.5 text-xs text-cream/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Open
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-brand-800 px-3 py-2 text-xs font-semibold text-cream">
            <Lock className="h-3.5 w-3.5" /> Login
          </span>
        </div>
      </div>

      <PromoBanner />

      <div className="p-4">
        <CategoryTabs categories={categories} active={active} onChange={setActive} />
      </div>

      <div className="p-4 pt-0">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            Could not load preview products: {error}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={() => onAdd(p)} />
            ))}
          </div>
        )}
        <p className="mt-6 text-center text-xs text-brand-500">
          Simulated menu for demo purposes. Real products & checkout: {realUrl || DUTCHIE_URL}
        </p>
      </div>
    </div>
  );
}