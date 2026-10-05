import { Link, useParams } from 'react-router-dom';
import { MapPin, Phone, ArrowLeft, Car, Accessibility, Clock, CalendarDays } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import DutchieEmbed from '../components/shop/DutchieEmbed';
import Badge from '../components/ui/Badge';
import { storeApi } from '../api/storeApi';
import { useFetch } from '../hooks/useFetch';
import { SkeletonCard, SkeletonList } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';

export default function StoreDetail() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(() => storeApi.getStore(slug), [slug]);
  const store = data?.store;
  const { data: eventsData } = useFetch(() => (store ? storeApi.getEvents(store.id) : Promise.resolve({ data: { events: [] } })), [store?.id]);
  const events = (eventsData?.events || []).filter((e) => e.status === 'open');

  usePageMeta(
    store ? `${store.name} | DemoTest Cannabis Co.` : 'Store | DemoTest Cannabis Co.',
    store?.description?.slice(0, 160)
  );

  if (loading) {
    return (
      <section className="container-page py-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonCard />
          <SkeletonList count={4} />
        </div>
      </section>
    );
  }

  if (error || !store) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="text-3xl text-brand-800">Store not found</h1>
        <p className="mt-3 text-brand-700/70">{error || 'We could not find that location.'}</p>
        <Link to="/locations" className="link-underline mt-6 inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to locations
        </Link>
      </section>
    );
  }

  return (
    <>
      <PageHero
        title={store.name}
        subtitle={store.description}
        eyebrow="Store Detail"
        breadcrumb={[{ label: 'Locations', to: '/locations' }, { label: store.city }]}
      />

      <section className="container-page py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            <div className="card-base p-6">
              <h2 className="text-lg text-brand-800">Visit us</h2>
              <p className="mt-3 flex items-start gap-2 text-sm text-brand-700/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                {store.address}, {store.city}, {store.state} {store.zip}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-brand-700/80">
                <Phone className="h-4 w-4 text-gold-600" /> {store.phone}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-brand-700/80">
                <Clock className="h-4 w-4 text-gold-600" /> Open 7 days a week
              </p>
              <div className="mt-5 space-y-3 text-sm text-brand-700/80">
                <p className="flex items-start gap-2">
                  <Car className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  {store.parking_info}
                </p>
                <p className="flex items-start gap-2">
                  <Accessibility className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  {store.accessibility_info}
                </p>
              </div>
              <a
                href={store.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-5 inline-flex"
              >
                Open in Google Maps
              </a>
            </div>

            <div className="card-base p-6">
              <h2 className="text-lg text-brand-800">Order ahead</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-700/75">
                This store's menu is powered by the real Dutchie embed URL. If Dutchie blocks
                embedding, you'll see a Preview Mode mock menu below instead.
              </p>
              <span className="mt-4 inline-block">
                <Badge tone="green">Real URL: dutchie.com/embedded-menu/…</Badge>
              </span>
            </div>

            <div className="card-base p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg text-brand-800">Upcoming events</h2>
                <Link to="/locations/events" className="link-underline text-sm">
                  All events
                </Link>
              </div>
              {events.length === 0 ? (
                <p className="mt-3 text-sm text-brand-700/70">
                  No upcoming events at this location right now.
                </p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {events.slice(0, 3).map((e) => (
                    <li key={e.id} className="flex gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-700">
                        <CalendarDays className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-brand-800">{e.title}</p>
                        <p className="text-xs text-brand-700/70">
                          {new Date(e.event_date).toLocaleDateString()} · {e.start_time?.slice(0, 5)}–
                          {e.end_time?.slice(0, 5)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <DutchieEmbed storeId={store.dutchie_menu_id || `demotest-${store.slug}`} storeName={store.name} />
          </div>
        </div>
      </section>
    </>
  );
}