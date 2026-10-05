const TONES = {
  demo: 'bg-gold-100 text-gold-700 ring-gold-200',
  green: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-100 text-amber-700 ring-amber-200',
  red: 'bg-red-100 text-red-700 ring-red-200',
  gray: 'bg-brand-100 text-brand-700 ring-brand-200',
  gold: 'bg-gold text-brand-800 ring-gold-600',
};

export default function Badge({ children, tone = 'demo', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}