import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { usePageMeta } from '../hooks/usePageMeta';

const TIERS = [
  {
    name: 'Bronze',
    spend: '$0',
    blurb: 'Welcome points on your first visit.',
    cta: 'Start earning',
    perks: [
      ['Welcome 500 points', true],
      ['1 point per $1 spent', true],
      ['Birthday reward', true],
      ['Member-only deals', false],
      ['Free delivery on first order only', true],
    ],
  },
  {
    name: 'Silver',
    spend: '$500 / year',
    blurb: 'For regular patients who visit monthly.',
    cta: 'Earn Silver',
    featured: true,
    perks: [
      ['Everything in Bronze', true],
      ['1.25x points', true],
      ['First access to drops', false],
      ['Free delivery on all orders', false],
      ['Refer a patient = 500 points', false],
    ],
  },
  {
    name: 'Gold',
    spend: '$1,500 / year',
    blurb: 'Our most popular tier for weekly patients.',
    cta: 'Earn Gold',
    perks: [
      ['Everything in Silver', true],
      ['1.5x points', true],
      ['Birthday month double points', true],
      ['First access to drops', true],
      ['Free delivery on all orders', false],
    ],
  },
  {
    name: 'Onyx',
    spend: '$3,000 / year',
    blurb: 'The full DemoTest experience.',
    cta: 'Earn Onyx',
    perks: [
      ['Everything in Gold', true],
      ['2x points', true],
      ['Free delivery on all orders', true],
      ['Private consultation lounge', true],
      ['Early access to events', true],
    ],
  },
];

export default function RewardsTiers() {
  usePageMeta('Rewards Tiers | DemoTest Cannabis Co.', 'Compare our four membership tiers and see how to unlock each one.');

  return (
    <>
      <PageHero
        title="Rewards Tiers"
        subtitle="Four tiers, one simple ladder. Earn points on every purchase and unlock perks as you go."
        eyebrow="Loyalty Program"
        breadcrumb={[{ label: 'Rewards', to: '/rewards' }, { label: 'Tiers' }]}
      />

      <section className="container-page py-14">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`card-base relative flex flex-col p-7 ${t.featured ? 'ring-2 ring-gold' : ''}`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-brand">
                  Popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-xl text-brand-800">{t.name}</h3>
                <Sparkles className="h-5 w-5 text-gold-500" />
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold-600">{t.spend}</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-700/70">{t.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {t.perks.map(([label, ok]) => (
                  <li key={label} className="flex items-start gap-2 text-sm text-brand-800/85">
                    {ok ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                    )}
                    {label}
                  </li>
                ))}
              </ul>
              <Link
                to="/shop"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-cream transition hover:bg-brand-700"
              >
                {t.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-brand-700 p-8 text-cream sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow text-gold-400">How It Works</p>
              <h2 className="mt-2 text-3xl">Simple. Every dollar counts.</h2>
              <p className="mt-4 max-w-xl text-cream/80">
                You never lose points when you move up — tier upgrades are automatic at the register.
                Tiers are based on your trailing 12-month spend across all DemoTest locations.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Link
                to="/rewards"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 font-semibold text-brand transition hover:bg-gold-500"
              >
                Back to rewards <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}