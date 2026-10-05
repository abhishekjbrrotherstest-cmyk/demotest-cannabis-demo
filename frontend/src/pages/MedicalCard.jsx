import { CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { usePageMeta } from '../hooks/usePageMeta';
import { faqApi } from '../api/faqApi';
import { useFetch } from '../hooks/useFetch';

const STEPS = [
  { step: 1, title: 'Get certified', text: 'Meet with a Pennsylvania-registered physician who reviews your qualifying condition. Certification is valid for 12 months.' },
  { step: 2, title: 'Register with the PA DOH', text: 'Create a patient profile in the Pennsylvania Department of Health portal and pay the annual fee (reduced for caregivers and some benefit programs).' },
  { step: 3, title: 'Receive your card', text: 'Your medical marijuana card arrives by mail in roughly 7–14 days. You can use it immediately once it is in hand.' },
  { step: 4, title: 'Visit a dispensary', text: 'Bring your card and a government-issued photo ID. Our staff verify your profile and walk you through your first purchase.' },
];

const FAQS = [
  { q: 'Who is eligible?', a: 'PA residents 18+ with a qualifying condition certified by a registered physician can apply. Minors may qualify with a parent or guardian as caregiver.' },
  { q: 'How much does it cost?', a: 'The physician certification is a private cost usually between $100–$250. The state registration fee is $50 per year (with discounts for qualifying individuals).' },
  { q: 'Can I use my card out of state?', a: 'No. Pennsylvania does not recognize other state medical programs, and other states do not recognize PA cards.' },
];

export default function MedicalCard() {
  usePageMeta('Get a Medical Card | DemoTest Cannabis Co.', 'Step-by-step guide to getting your Pennsylvania medical marijuana card.');
  const { data, loading } = useFetch(() => faqApi.getFaqs(), []);
  const cardFaqs = (data?.faqs || []).filter((f) => f.category === 'Medical Card').slice(0, 6);

  return (
    <>
      <PageHero
        title="Get Your PA Medical Card"
        subtitle="A plain-English walkthrough of the Pennsylvania medical marijuana program — certification, registration, fees, and your first visit."
        eyebrow="Medical Card"
        breadcrumb={[{ label: 'Medical Card' }]}
      />

      <section className="container-page py-14">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.step} className="card-base relative overflow-hidden p-6">
              <span className="absolute -right-4 -top-6 font-display text-[88px] font-bold text-brand-50">
                {s.step}
              </span>
              <h3 className="relative text-lg text-brand-800">{s.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-brand-700/75">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow text-gold-600">Quick Answers</p>
            <h2 className="mt-2 text-3xl text-brand-800">Card questions, answered</h2>
            <ul className="mt-6 space-y-5">
              {FAQS.map((f) => (
                <li key={f.q}>
                  <h3 className="flex items-center gap-2 text-base font-semibold text-brand-800">
                    <CheckCircle2 className="h-5 w-5 text-gold-600" /> {f.q}
                  </h3>
                  <p className="mt-1 pl-7 text-sm leading-relaxed text-brand-700/75">{f.a}</p>
                </li>
              ))}
            </ul>
          </div>
          <aside className="card-base h-fit p-6">
            <h3 className="text-lg text-brand-800">Bring to your first visit</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-700/80">
              <li>• Your valid PA medical card</li>
              <li>• Government-issued photo ID</li>
              <li>• Your DOH patient ID number</li>
              <li>• A caregiver? Bring their card too</li>
            </ul>
            <p className="mt-5 rounded-xl bg-gold-50 p-4 text-sm leading-relaxed text-brand-700/80">
              New patients: ask for the demo tour. We'll walk you through the menu, dosing, and
              what to expect on your first visit.
            </p>
          </aside>
        </div>

        <div className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-gold-600">Live from the FAQ</p>
              <h2 className="mt-2 text-3xl text-brand-800">More card questions</h2>
            </div>
            <Link to="/faq" className="link-underline">
              All FAQs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i} className="card-base animate-pulse p-6">
                  <div className="h-4 w-3/4 rounded bg-brand-100" />
                  <div className="mt-2 h-3 w-full rounded bg-brand-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {cardFaqs.map((f) => (
                <div key={f.id} className="card-base p-6">
                  <h3 className="flex items-start gap-2 text-base font-semibold leading-snug text-brand-800">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" /> {f.question}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-700/75">{f.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}