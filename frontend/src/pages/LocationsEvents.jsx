import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Clock, Ticket } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { storeApi } from '../api/storeApi';
import { useFetch } from '../hooks/useFetch';
import { SkeletonCard } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';

export default function LocationsEvents() {
  usePageMeta('Events | DemoTest Cannabis Co.', 'Workshops, orientations, and community events at all five DemoTest locations.');

  const { data, loading, error } = useFetch(async () => {
    const storesRes = await storeApi.getStores();
    const stores = storesRes.data.stores || [];
    const withEvents = await Promise.all(
      stores.map(async (s) => {
        const ev = await storeApi.getEvents(s.id);
        return { store: s, events: ev.data.events || [] };
      })
    );
    return { groups: withEvents };
  }, []);

  const groups = data?.groups || [];
  const allEvents = groups.flatMap((g) => g.events.map((e) => ({ ...e, store: g.store })));
  const upcoming = allEvents
    .filter((e) => e.status === 'open')
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  return (
    <>
      <PageHero
        title="Store Events"
        subtitle="Orientations, education workshops, and community meetups across all five locations — free for patients."
        eyebrow="Community Calendar"
        breadcrumb={[{ label: 'Locations', to: '/locations' }, { label: 'Events' }]}
      />

      <section className="container-page py-12">
        {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="rounded-2xl bg-brand-50 p-10 text-center text-brand-700/70">
            No upcoming events right now — check back soon.
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              {upcoming.map((e) => {
                const date = new Date(e.event_date);
                const start = e.start_time?.slice(0, 5);
                const end = e.end_time?.slice(0, 5);
                return (
                  <article key={`${e.store.id}-${e.id}`} className="card-base flex flex-col p-6">
                    <div className="flex items-center gap-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold-100 text-center text-gold-700">
                        <div className="leading-tight">
                          <p className="text-lg font-bold">{date.getDate()}</p>
                          <p className="text-[10px] font-semibold uppercase">
                            {date.toLocaleString('en-US', { month: 'short' })}
                          </p>
                        </div>
                      </span>
                      <div>
                        <h2 className="text-lg leading-snug text-brand-800">{e.title}</h2>
                        <p className="mt-0.5 text-sm text-brand-700/70">{date.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-brand-700/75">{e.description}</p>
                    <dl className="mt-4 space-y-1.5 text-sm text-brand-800/85">
                      <div className="flex items-center gap-2">
                        <dt className="sr-only">Location</dt>
                        <MapPin className="h-4 w-4 shrink-0 text-gold-600" />
                        <span>{e.store.name.replace(/^DemoTest\s*/, '')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <dt className="sr-only">Time</dt>
                        <Clock className="h-4 w-4 shrink-0 text-gold-600" />
                        <span>
                          {start}–{end}
                        </span>
                      </div>
                      {e.location_detail && (
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 shrink-0 text-gold-600" />
                          <span>{e.location_detail}</span>
                        </div>
                      )}
                    </dl>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        to={`/locations/${e.store.slug}`}
                        className="link-underline text-sm"
                      >
                        Store details
                      </Link>
                      <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
                        <CalendarDays className="h-3.5 w-3.5" /> Upcoming
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-10">
              <h2 className="text-xl text-brand-800">By location</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groups.map(({ store, events }) => {
                  const count = events.filter((e) => e.status === 'open').length;
                  return (
                    <Link
                      key={store.id}
                      to={`/locations/${store.slug}`}
                      className="card-base flex items-center justify-between p-5 transition hover:-translate-y-1 hover:shadow-lift"
                    >
                      <div>
                        <h3 className="font-semibold text-brand-800">
                          {store.name.replace(/^DemoTest\s*/, '')}
                        </h3>
                        <p className="text-sm text-brand-700/70">
                          {count} upcoming event{count === 1 ? '' : 's'}
                        </p>
                      </div>
                      <CalendarDays className="h-5 w-5 text-gold-600" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}