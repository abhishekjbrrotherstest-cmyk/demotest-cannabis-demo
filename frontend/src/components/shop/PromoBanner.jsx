import { Truck, BadgePercent, Gift } from 'lucide-react';

const PERKS = [
  { icon: Truck, text: 'FREE DELIVERY ON 1ST ORDER' },
  { icon: BadgePercent, text: 'SPEND $100 → FREE PRE-ROLL + FREE VAPE + FREE DELIVERY' },
  { icon: Gift, text: 'SPEND $75 → FREE PRE-ROLL' },
];

export default function PromoBanner() {
  return (
    <div className="grid gap-px bg-brand-900 sm:grid-cols-3">
      {PERKS.map((p) => (
        <div
          key={p.text}
          className="flex items-center gap-3 bg-brand-800 px-4 py-3 text-[11px] font-semibold tracking-wide text-cream"
        >
          <p.icon className="h-5 w-5 shrink-0 text-gold-400" aria-hidden="true" />
          <span>{p.text}</span>
        </div>
      ))}
    </div>
  );
}