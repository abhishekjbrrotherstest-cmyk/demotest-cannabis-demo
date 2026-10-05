export default function StatCard({ label, value, icon: Icon, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-50 text-brand',
    gold: 'bg-gold-100 text-gold-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="card-base flex items-center gap-4 p-5">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${accents[accent]}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-2xl font-bold text-brand-800">{value}</p>
        <p className="text-sm text-brand-600">{label}</p>
      </div>
    </div>
  );
}