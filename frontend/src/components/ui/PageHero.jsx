import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';

export default function PageHero({ title, subtitle, eyebrow, breadcrumb = [] }) {
  return (
    <section className="relative overflow-hidden bg-brand-800 py-12 text-cream sm:py-16">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, #D4A373 0, transparent 45%), radial-gradient(circle at 85% 70%, #2D6A4F 0, transparent 50%)',
        }}
        aria-hidden="true"
      />
      <div className="container-page relative">
        {breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-cream/70">
              <li>
                <Link to="/" className="transition hover:text-gold-400">
                  Home
                </Link>
              </li>
              {breadcrumb.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
                  {crumb.to && i !== breadcrumb.length - 1 ? (
                    <Link to={crumb.to} className="transition hover:text-gold-400">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-gold-400">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow mb-3 text-gold-400">{eyebrow}</p>}
        <h1 className="max-w-4xl text-4xl leading-[1.1] sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cream/80">{subtitle}</p>
        )}
        <p className="mt-8 flex max-w-3xl items-start gap-2.5 rounded-xl border border-cream/15 bg-brand-900/40 p-4 text-sm text-cream/70">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
          <span>Must be 18+ with a valid PA medical card. Demo project — not a real dispensary.</span>
        </p>
      </div>
    </section>
  );
}