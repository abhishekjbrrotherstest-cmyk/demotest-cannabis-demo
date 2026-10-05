import { useState } from 'react';
import { Gift, Star, Package, CheckCircle, Sparkles } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { usePageMeta } from '../hooks/usePageMeta';

const TIERS = [
  { name: 'Green Leaf', spend: '$0', perk: 'Welcome 500 points on your first visit' },
  { name: 'Gold Leaf', spend: '$500', perk: '1.25x points + birthday reward' },
  { name: 'Hero Leaf', spend: '$1,500', perk: '1.5x points, first access to drops, free delivery' },
];

const emptyForm = { first_name: '', last_name: '', email: '', phone: '', consent: false };

export default function Rewards() {
  usePageMeta('Rewards | DemoTest Cannabis Co.', 'Earn points on every visit with the DemoTest loyalty program.');
  const [form, setForm] = useState(emptyForm);
  const [joined, setJoined] = useState(false);

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.consent) return;
    setJoined(true);
  };

  return (
    <>
      <PageHero
        title="DemoTest Rewards"
        subtitle="Earn points on every visit, unlock discounts, and get patient-only perks. It's our way of saying thanks."
        eyebrow="Loyalty Program"
        breadcrumb={[{ label: 'Rewards' }]}
      />

      <section id="join" className="container-page py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-gold-600">Join Free</p>
            <h2 className="mt-2 text-3xl font-semibold text-brand-800">Earn 100 points on your first order.</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-700/75">
              Sign up in about a minute. No cards, no fees — just points that work at any DemoTest
              location in Pennsylvania.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-brand-700/85">
              <li className="flex items-start gap-3">
                <Star className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" /> 100 welcome points on signup, worth $1 off.
              </li>
              <li className="flex items-start gap-3">
                <Gift className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" /> Stack with birthday double points and referral bonuses.
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" /> Patient-first, stays in PA: we never sell your data.
              </li>
            </ul>
          </div>

          {joined ? (
            <div className="card-base p-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-green-100 text-green-600">
                <CheckCircle className="h-7 w-7" />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-brand-800">Welcome to DemoTest Rewards, {form.first_name}!</h3>
              <p className="mt-2 text-sm text-brand-700/75">
                Your 100 welcome points are ready to use (demo). Show your phone number at any DemoTest
                store to earn 1 point per $1.
              </p>
              <button
                onClick={() => {
                  setForm(emptyForm);
                  setJoined(false);
                }}
                className="btn-base mt-6 border border-brand text-brand hover:bg-brand hover:text-cream"
              >
                Sign up another member
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="card-base p-8">
              <p className="eyebrow text-gold-600">Membership</p>
              <h3 className="mt-1 text-xl text-brand-800">Join DemoTest Rewards</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="rew-first" className="label">First name *</label>
                  <input id="rew-first" className="field" required value={form.first_name} onChange={set('first_name')} placeholder="Jane" />
                </div>
                <div>
                  <label htmlFor="rew-last" className="label">Last name *</label>
                  <input id="rew-last" className="field" required value={form.last_name} onChange={set('last_name')} placeholder="Doe" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="rew-email" className="label">Email *</label>
                  <input id="rew-email" type="email" className="field" required value={form.email} onChange={set('email')} placeholder="jane@example.com" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="rew-phone" className="label">Phone (optional)</label>
                  <input id="rew-phone" type="tel" className="field" value={form.phone} onChange={set('phone')} placeholder="(555) 000-0000" />
                </div>
              </div>
              <label className="mt-5 flex items-start gap-3 text-sm text-brand-700/80">
                <input type="checkbox" required checked={form.consent} onChange={set('consent')} className="mt-0.5 h-4 w-4 rounded border-brand-300 accent-gold-600" />
                <span>
                  I agree to the program <span className="font-semibold text-brand-800">terms</span> and want to
                  receive reward updates. I can opt out anytime.
                </span>
              </label>
              <button type="submit" className="btn-base mt-6 w-full bg-brand text-cream hover:bg-brand-600">
                Join DemoTest Rewards
              </button>
              <p className="mt-4 text-center text-xs text-brand-500">
                Demo form — no data is sent anywhere.
              </p>
            </form>
          )}
        </div>
      </section>

      <section className="container-page pb-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.name} className="card-base p-7">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-100 text-gold-600">
                <Gift className="h-6 w-6" />
              </span>
              <p className="eyebrow mt-4 text-gold-600">{t.spend} Lifetime</p>
              <h3 className="mt-1 text-xl text-brand-800">{t.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-700/75">{t.perk}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-brand-700 p-8 text-cream sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow text-gold-400">How It Works</p>
              <h2 className="mt-2 text-3xl">Simple. Every dollar counts.</h2>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-cream/80">
                <li className="flex items-start gap-3">
                  <Star className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                  Earn 1 point per $1 spent. 100 points = $1 off.
                </li>
                <li className="flex items-start gap-3">
                  <Package className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                  Points apply to eligible products and can be used at the register or on order-ahead.
                </li>
                <li className="flex items-start gap-3">
                  <Gift className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                  Birthday month double points. Refer a patient, earn 500 points.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}