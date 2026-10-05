import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Leaf, Truck, Award, Sparkles } from 'lucide-react';
import { storeApi } from '../../api/storeApi';
import { faqApi } from '../../api/faqApi';
import { blogApi } from '../../api/blogApi';
import { useFetch } from '../../hooks/useFetch';
import { useToast } from '../../context/ToastContext';
import { SkeletonCard, SkeletonList } from '../ui/Skeleton';
import { LinkButton } from '../ui/Button';

function SectionHeading({ eyebrow, title, subtitle, description, light }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="eyebrow mb-2 text-gold-600">{eyebrow}</p>}
      <h2 className={`text-3xl ${light ? 'text-cream' : 'text-brand-800'}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-3 leading-relaxed ${light ? 'text-cream/75' : 'text-brand-700/70'}`}>{subtitle}</p>
      )}
      {description && (
        <p className={`mt-3 leading-relaxed ${light ? 'text-cream/75' : 'text-brand-700/70'}`}>{description}</p>
      )}
    </div>
  );
}

function SectionCTA({ text, to }) {
  if (!text || !to) return null;
  return (
    <LinkButton to={to} variant="outline">
      {text} <ArrowRight className="h-4 w-4" />
    </LinkButton>
  );
}

const BG = {
  cream: 'bg-cream',
  brand: 'bg-brand',
  alt: 'bg-brand-50',
  dark: 'bg-brand-800',
};

export function TrustBadges({ section }) {
  const entries = (section?.description || 'PA DOH dispensary permit · Free delivery on first order · Loyalty rewards').split('·');
  const icons = [Leaf, Truck, Award];
  const titles = ['Fully Licensed', 'Delivery Available', 'Loyalty Rewards'];
  return (
    <section className="border-y border-brand-100 bg-white">
      <div className="container-page grid gap-6 py-8 sm:grid-cols-3">
        {entries.map((text, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={i} className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-600">
                <Icon className="h-6 w-6" />
              </span>
              <div className="text-left">
                <h3 className="font-semibold text-brand-800">{titles[i] || 'DemoTest Difference'}</h3>
                <p className="text-sm text-brand-700/70">{text.trim()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StoreCard({ store }) {
  const { data: events } = useFetch(() => storeApi.getEvents(store.id), [store.id]);
  const near = events?.events?.[0];
  return (
    <Link
      to={`/locations/${store.slug}`}
      className="card-base group flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-lift"
    >
      {store.image_url && (
        <img src={store.image_url} alt="" className="-m-6 mb-4 h-40 w-[calc(100%+3rem)] max-w-none object-cover" />
      )}
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand">
        <MapPin className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg text-brand-800">{store.name.replace(/^DemoTest\s*/, '')}</h3>
      <p className="mt-1 text-sm text-brand-700/70">
        {store.address}, {store.city}
      </p>
      {near && (
        <p className="mt-2 text-xs font-medium text-gold-600">
          Next event: {new Date(near.event_date).toLocaleDateString()} · {near.title}
        </p>
      )}
      <span className="link-underline mt-4">
        Store details <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export function StoreLocatorPreview({ section }) {
  const { data, loading } = useFetch(() => storeApi.getStores(), []);

  return (
    <section className="container-page py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Store Locator"
          title={section?.title || 'Five locations. One standard of care.'}
          subtitle={section?.subtitle || undefined}
        />
        <SectionCTA text={section?.cta_text || 'View all locations'} to={section?.cta_link || '/locations'} />
      </div>
      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.stores || []).slice(0, 3).map((s) => (
            <StoreCard key={s.id} store={s} />
          ))}
        </div>
      )}
    </section>
  );
}

export function MedicalCardBanner({ section }) {
  return (
    <section className="bg-brand py-16 text-cream">
      <div className="container-page grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="eyebrow mb-2 text-gold-400">Medical Card</p>
          <h2 className="text-3xl">{section?.title || 'New to the Pennsylvania program?'}</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-cream/80">
            {section?.subtitle ||
              'Certification, the DOH registration, fees, and your first visit — our guide walks you through every step of getting your PA medical card.'}
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:items-end">
          <LinkButton to={section?.cta_link || '/medical-card'} variant="secondary" size="lg">
            {section?.cta_text || 'Read the guide'} <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

export function FAQPreview({ section }) {
  const { data, loading } = useFetch(() => faqApi.getFaqs(), []);

  return (
    <section className="container-page py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Got Questions?" title={section?.title || 'Frequently asked questions'} />
        <SectionCTA text={section?.cta_text || 'All FAQs'} to={section?.cta_link || '/faq'} />
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {loading ? (
          <div className="lg:col-span-3">
            <SkeletonList count={3} />
          </div>
        ) : (
          (data?.faqs || []).slice(0, 3).map((f) => (
            <div key={f.id} className="card-base p-6">
              <h3 className="text-base leading-snug text-brand-800">{f.question}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-700/70">{f.answer}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function RewardsPreview({ section }) {
  const emoji = ['Bronze', 'Silver', 'Gold', 'Onyx'];
  return (
    <section className="container-page py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Rewards" title={section?.title || 'Rewards that add up'} subtitle={section?.subtitle} description={section?.description} />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {emoji.map((t, i) => (
              <div key={t} className="card-base p-4 text-center">
                <Sparkles className={`mx-auto h-5 w-5 ${i === 3 ? 'text-brand' : 'text-gold-500'}`} />
                <p className="mt-2 text-sm font-semibold text-brand-800">{t}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <SectionCTA text={section?.cta_text || 'See rewards'} to={section?.cta_link || '/rewards'} />
          </div>
        </div>
        <div className="order-first lg:order-last">
          <img src={section?.image_url} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
        </div>
      </div>
    </section>
  );
}

function CommunityPreview({ section }) {
  return (
    <section className="bg-brand-50 py-16">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Community" title={section?.title || 'Community first'} subtitle={section?.subtitle} />
          <p className="mt-4 leading-relaxed text-brand-700/70">
            {section?.description ||
              'Workshops, caregiver support groups, and local giving — every month at every location.'}
          </p>
          <div className="mt-6">
            <SectionCTA text={section?.cta_text || 'Join us'} to={section?.cta_link || '/community'} />
          </div>
        </div>
        <img src={section?.image_url} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
      </div>
    </section>
  );
}

export function BlogPreview({ section }) {
  const { data, loading } = useFetch(() => blogApi.getPosts(), []);

  return (
    <section className="bg-brand-50 py-16">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Patient Education" title={section?.title || 'From the blog'} subtitle={section?.subtitle} />
          <SectionCTA text={section?.cta_text || 'All articles'} to={section?.cta_link || '/blog'} />
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
            : (data?.posts || []).slice(0, 3).map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="card-base group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift"
                >
                  {p.featured_image && <img src={p.featured_image} alt="" className="h-40 w-full object-cover" />}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">{p.category}</p>
                    <h3 className="mt-2 text-lg leading-snug text-brand-800">{p.title}</h3>
                    <span className="link-underline mt-4">Read article</span>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

export function NewsletterHome({ section }) {
  const { push } = useToast();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section className="container-page py-16">
      <div className="overflow-hidden rounded-3xl bg-brand-700 p-8 text-center sm:p-14">
        <p className="eyebrow text-gold-400">Stay Up To Date</p>
        <h2 className="mt-3 text-3xl text-cream">{section?.title || 'Deals, events & education'}</h2>
        <p className="mx-auto mt-3 max-w-xl text-cream/75">
          {section?.subtitle || 'Subscribe for monthly patient education, location events, and loyalty updates. No spam, ever.'}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) {
              push('Subscribed (mock) — thanks for joining!');
              setEmail('');
              setDone(true);
            }
          }}
          className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-h-12 flex-1 rounded-xl border border-brand-600 bg-brand-800 px-4 text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          <button
            type="submit"
            className="rounded-xl bg-gold px-6 font-semibold text-brand transition hover:bg-gold-500"
          >
            {done ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
}

function GenericSection({ section }) {
  const bg = BG[section?.background_color] || BG.cream;
  const dark = section?.background_color === 'dark';
  return (
    <section className={`py-16 ${bg} ${dark ? 'text-cream' : ''}`}>
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow={section?.section_key} title={section?.title} subtitle={section?.subtitle} light={dark} />
          {section?.description && (
            <p className={`mt-4 leading-relaxed ${dark ? 'text-cream/75' : 'text-brand-700/70'}`}>
              {section.description}
            </p>
          )}
          <div className="mt-6">
            <SectionCTA text={section?.cta_text} to={section?.cta_link} />
          </div>
        </div>
        {section?.image_url && (
          <img src={section.image_url} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
        )}
      </div>
    </section>
  );
}

const RENDERERS = {
  'trust-badges': TrustBadges,
  'store-locator': StoreLocatorPreview,
  'medical-card': MedicalCardBanner,
  'faq-preview': FAQPreview,
  rewards: RewardsPreview,
  community: CommunityPreview,
  'blog-preview': BlogPreview,
  newsletter: NewsletterHome,
};

export default function HomeSections({ sections }) {
  return (
    <>
      {(sections || []).map((section) => {
        if (section.section_key === 'hero') return null;
        const Renderer = RENDERERS[section.section_key] || GenericSection;
        return <Renderer key={section.id} section={section} />;
      })}
    </>
  );
}