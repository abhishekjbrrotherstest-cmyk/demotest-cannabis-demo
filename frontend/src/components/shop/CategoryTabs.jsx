export default function CategoryTabs({ categories = [], active, onChange }) {
  return (
    <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === cat ? 'bg-brand text-cream' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}