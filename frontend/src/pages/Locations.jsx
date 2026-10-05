import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight, CalendarDays } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { storeApi } from '../api/storeApi';
import { useFetch } from '../hooks/useFetch';
import { SkeletonCard } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Locations() {
  usePageMeta('Locations | DemoTest Cannabis Co.', 'Find a DemoTest Cannabis Co. dispensary near you in Pennsylvania.');
  const { data, loading, error } = useFetch(() => storeApi.getStores(), []);

  return (
    <>
      <PageHero
        title="Store Locations"
        subtitle="Five patient-first dispensaries across Pennsylvania. Order ahead online and pick up in minutes."
        eyebrow="Store Locator"
        breadcrumb={[{ label: 'Locations' }]}
      />

      <section className="container-page py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-brand-700/75">Five locations, one standard of care.</p>
          <Link to="/locations/events" className="link-underline inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-gold-600" /> Community events
          </Link>
        </div>
        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
        )}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.stores || []).map((s) => (
              <div key={s.id} className="card-base flex flex-col overflow-hidden">
                <img src={s.image_url} alt="" className="h-44 w-full object-cover" />
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl text-brand-800">
                    {s.name.replace(/^DemoTest\s*/, '')}
                  </h2>
                  <p className="mt-1 text-sm text-brand-700/75">
                    {s.address}, {s.city}, {s.state} {s.zip}
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-brand-700/80">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gold-600" /> {s.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gold-600" /> Mon–Sat 10a–7p
                    </p>
                  </div>
                  <Link to={`/locations/${s.slug}`} className="link-underline mt-5">
                    Store details & menu <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {data?.stores?.[0] && (
        <section className="border-t border-brand-100">
          <div className="container-page grid gap-6 py-10 md:grid-cols-2">
            <div>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-100 text-gold-600">
                <MapPin className="h-6 w-6" />
              </span>
              <h2 className="mt-4 text-2xl text-brand-800">Hours & Accessibility</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-700/75">
                Every store is open 7 days a week with step-free entrances, automatic doors, and staff
                trained in accessibility support. Holiday hours are posted in-store.
              </p>
            </div>
            <div className="card-base overflow-hidden">
              <div className="border-b border-brand-100 bg-brand-50 px-6 py-4">
                <h3 className="font-semibold text-brand-800">Standard Weekly Hours</h3>
              </div>
              <ul className="divide-y divide-brand-100 text-sm">
                {DAYS.map((d, i) => (
                  <li key={d} className="flex justify-between px-6 py-2.5 text-brand-700/80">
                    <span className={i === 0 ? 'font-semibold text-brand-800' : ''}>{d}</span>
                    <span>{i === 0 ? '11:00 AM – 5:00 PM' : '10:00 AM – 7:00 PM'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </>
  );
}