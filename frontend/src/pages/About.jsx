import { Heart, Users, BookOpen, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { aboutApi } from '../api/contentApi';
import { useFetch } from '../hooks/useFetch';
import { usePageMeta } from '../hooks/usePageMeta';
import { SkeletonCard, SkeletonBox } from '../components/ui/Skeleton';

const VALUE_ICONS = {
  Compassion: Heart,
  Quality: ShieldCheck,
  Education: BookOpen,
  Community: Users,
};

function Card({ children, className = '' }) {
  return <div className={`card-base ${className}`}>{children}</div>;
}

function RenderStory(s) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <SectionEyebrow>About Us</SectionEyebrow>
        <h2 className="text-3xl text-brand-800">{s.title}</h2>
        {s.subtitle && <p className="mt-3 text-lg font-medium text-gold-600">{s.subtitle}</p>}
        {s.content && (
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-700/85">{s.content}</p>
        )}
      </div>
      {s.image_url && (
        <img src={s.image_url} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
      )}
    </div>
  );
}

function RenderMission(s) {
  return (
    <section className="bg-brand py-16 text-cream">
      <div className="container-page grid items-center gap-10 lg:grid-cols-[1.45fr_1fr]">
        <div>
          <SectionEyebrow light>Our Mission</SectionEyebrow>
          <h2 className="text-3xl text-cream">{s.title}</h2>
          {s.subtitle && <p className="mt-3 text-lg font-medium text-gold-300">{s.subtitle}</p>}
          {s.content && <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/85">{s.content}</p>}
        </div>
        {s.image_url && (
          <img src={s.image_url} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
        )}
      </div>
    </section>
  );
}

function RenderValues(s) {
  const values = (() => {
    try {
      return JSON.parse(s.content || '[]');
    } catch {
      return [];
    }
  })();
  return (
    <section>
      <div className="container-page py-14">
        <SectionEyebrow>What We Believe</SectionEyebrow>
        <h2 className="text-3xl text-brand-800">{s.title}</h2>
        {s.subtitle && <p className="mt-3 max-w-2xl text-brand-700/70">{s.subtitle}</p>}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => {
            const Icon = VALUE_ICONS[v.label] || Sparkles;
            return (
              <Card key={v.label} className="p-7 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 text-lg text-brand-800">{v.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-700/75">{v.text}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RenderTeam(s) {
  const members = (() => {
    try {
      return JSON.parse(s.content || '[]');
    } catch {
      return [];
    }
  })();
  return (
    <section className="bg-brand-50 py-16">
      <div className="container-page">
        <SectionEyebrow>The Team</SectionEyebrow>
        <h2 className="text-3xl text-brand-800">{s.title}</h2>
        {s.subtitle && <p className="mt-3 max-w-2xl text-brand-700/70">{s.subtitle}</p>}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => (
            <Card key={m.name} className="p-6 text-center">
              <img
                src={m.image}
                alt={m.name}
                className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-gold-100"
              />
              <h3 className="mt-4 text-lg text-brand-800">{m.name}</h3>
              <p className="text-sm font-semibold text-gold-600">{m.role}</p>
              {m.bio && <p className="mt-2 text-sm leading-relaxed text-brand-700/70">{m.bio}</p>}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function RenderFeatures(s) {
  const features = (() => {
    try {
      return JSON.parse(s.content || '[]');
    } catch {
      return [];
    }
  })();
  return (
    <section className="container-page py-16">
      <SectionEyebrow>Why We Exist</SectionEyebrow>
      <h2 className="text-3xl text-brand-800">{s.title}</h2>
      {s.subtitle && <p className="mt-3 max-w-2xl text-brand-700/70">{s.subtitle}</p>}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.label} className="p-6">
            <h3 className="text-base font-semibold text-brand-800">{f.label}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-700/70">{f.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function RenderCommunity(s) {
  return (
    <section className="bg-brand-50 py-16">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2">
        {s.image_url && (
          <img src={s.image_url} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift" />
        )}
        <div>
          <SectionEyebrow>Community</SectionEyebrow>
          <h2 className="text-3xl text-brand-800">{s.title}</h2>
          {s.subtitle && <p className="mt-3 text-lg font-medium text-gold-600">{s.subtitle}</p>}
          {s.content && <p className="mt-4 leading-relaxed text-brand-700/75">{s.content}</p>}
        </div>
      </div>
    </section>
  );
}

function RenderCTA(s) {
  const isLink = (s.content || '').trim().startsWith('/');
  return (
    <section className="container-page py-16">
      <div className="overflow-hidden rounded-3xl bg-brand-700 px-8 py-12 text-center text-cream sm:px-14">
        <h2 className="text-3xl text-cream">{s.title}</h2>
        {s.subtitle && <p className="mx-auto mt-3 max-w-xl text-cream/75">{s.subtitle}</p>}
        {isLink && (
          <div className="mt-7 flex justify-center">
            <Link
              to={s.content}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 font-semibold text-brand transition hover:bg-gold-500"
            >
              View locations <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function SectionEyebrow({ light, children }) {
  return <p className={`eyebrow mb-2 ${light ? 'text-gold-400' : 'text-gold-600'}`}>{children}</p>;
}

const RENDERERS = {
  story: RenderStory,
  mission: RenderMission,
  values: RenderValues,
  team: RenderTeam,
  features: RenderFeatures,
  community: RenderCommunity,
  cta: RenderCTA,
};

export default function About() {
  usePageMeta('About Us | DemoTest Cannabis Co.', 'Our story and values in the Pennsylvania medical cannabis program.');
  const { data, loading } = useFetch(() => aboutApi.getSections(), []);
  const sections = data?.sections || [];

  if (loading) {
    return (
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <SkeletonBox className="h-6 w-40" />
            <SkeletonBox className="h-10 w-2/3" />
            <SkeletonBox className="h-5 w-1/2" />
            <SkeletonBox className="h-24 w-full" />
          </div>
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const hero = sections.find((s) => s.section_type === 'story');
  const rest = sections.filter((s) => s.section_type !== 'story');

  return (
    <>
      <PageHero
        title={hero?.title || 'Our Story'}
        subtitle={hero?.subtitle || 'DemoTest began with a simple idea: a cannabis dispensary that treats patients like people.'}
        eyebrow="About Us"
        image={hero?.image_url}
        breadcrumb={[{ label: 'About' }]}
      />

      {rest.map((s) => {
        const Renderer = RENDERERS[s.section_type] || RenderStory;
        return <Renderer key={s.id} {...s} />;
      })}
    </>
  );
}