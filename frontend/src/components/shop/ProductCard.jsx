import { Plus, Leaf } from 'lucide-react';
import Badge from '../ui/Badge';

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="card-base group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
      <div className="relative">
        <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
        <span className="absolute left-3 top-3">
          <Badge tone={product.inStock ? 'green' : 'gray'}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gold-600">
              {product.brand}
            </p>
            <h3 className="mt-0.5 font-semibold leading-snug text-brand-800">{product.name}</h3>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-brand-700/70">
          <span className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold">{product.thc} THC</span>
          {product.cbd && Number.parseFloat(product.cbd) > 0 && (
            <span className="rounded-full bg-gold-50 px-2 py-0.5 font-semibold">{product.cbd} CBD</span>
          )}
          <span>{product.weight}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-lg font-bold text-brand-800">
            ${Number(product.price).toFixed(2)}
          </span>
          <button
            type="button"
            onClick={onAdd}
            disabled={!product.inStock}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-semibold text-cream transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t border-brand-50 px-5 py-2 text-[11px] text-brand-500">
        <Leaf className="h-3.5 w-3.5 text-gold-500" />
        {product.terpenes?.filter((t) => t !== 'N/A').slice(0, 2).join(', ') || 'Lab-tested'}
      </div>
    </article>
  );
}