import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import Accordion from '../components/ui/Accordion';
import { LinkButton } from '../components/ui/Button';
import { faqApi } from '../api/faqApi';
import { useFetch } from '../hooks/useFetch';
import { SkeletonList } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';

export default function FAQ() {
  usePageMeta('FAQ | DemoTest Cannabis Co.', 'Frequently asked questions about the PA medical program and ordering at DemoTest.');
  const [active, setActive] = useState('all');
  const { data, loading } = useFetch(() => faqApi.getFaqs(), []);

  const faqs = data?.faqs || [];
  const categories = data?.categories || [];
  const visible = active === 'all' ? faqs : faqs.filter((f) => f.category === active);

  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="The answers patients ask for most — cards, purchasing rules, caregivers, and order-ahead. Anything else, ask a budtender."
        eyebrow="Patient Help"
        breadcrumb={[{ label: 'FAQ' }]}
      />

      <section className="container-page py-12">
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
          {['all', ...categories.map((c) => c.category)].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === cat
                  ? 'bg-brand text-cream'
                  : 'bg-white text-brand-700 ring-1 ring-brand-100 hover:bg-brand-50'
              }`}
            >
              {cat === 'all' ? 'All Questions' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonList count={6} />
        ) : (
          <div className="mx-auto max-w-4xl">
            <Accordion items={visible} allowMultiple />
          </div>
        )}

        <div className="mx-auto mt-12 max-w-4xl rounded-3xl bg-brand p-8 text-center sm:p-10">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gold-100 text-gold-600">
            <HelpCircle className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-2xl text-cream">Still have questions?</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-cream/75">
            Our budtenders answer questions on the floor, not from a script. Visit any location or
            send us a message.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton to="/contact" variant="secondary">
              Contact us
            </LinkButton>
            <LinkButton to="/locations" variant="outline-light">
              Find a store
            </LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}