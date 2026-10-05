import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, MapPin, Clock } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { careerApi } from '../api/careerApi';
import { useFetch } from '../hooks/useFetch';
import { SkeletonCard } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Careers() {
  usePageMeta('Careers | DemoTest Cannabis Co.', 'Join the DemoTest Cannabis Co. team across Pennsylvania.');
  const { data, loading, error } = useFetch(() => careerApi.getCareers(), []);

  return (
    <>
      <PageHero
        title="Work With Us"
        subtitle="Careers at DemoTest are patient-first roles with real purpose — across all five of our locations."
        eyebrow="Careers"
        breadcrumb={[{ label: 'Careers' }]}
      />

      <section className="container-page py-12">
        {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {(data?.careers || []).map((c) => (
              <div key={c.id} className="card-base flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand">
                      <Briefcase className="h-5 w-5" />
                    </span>
                    <h2 className="mt-3 text-xl text-brand-800">{c.title}</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase text-emerald-700">
                    Open
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-brand-700/75">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gold-600" /> {c.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gold-600" /> {c.employment_type}
                  </span>
                </div>
                <Link to={`/careers/${c.id}`} className="link-underline mt-5">
                  View job & apply <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}