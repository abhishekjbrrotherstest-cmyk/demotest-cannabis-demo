import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ShoppingBag, ArrowRight } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import Badge from '../components/ui/Badge';
import Button, { LinkButton } from '../components/ui/Button';
import { storeApi } from '../api/storeApi';
import { useFetch } from '../hooks/useFetch';
import { SkeletonCard } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';
import { isStoreOpenNow } from '../utils/storeHours';

export default function Shop() {
  usePageMeta('Choose a Dispensary | DemoTest Cannabis Co.', 'Pick a DemoTest location to open its order-ahead menu.');
  const navigate = useNavigate();
  const { data, loading } = useFetch(() => storeApi.getStores(), []);
  const stores = data?.stores || [];
  const [openMap, setOpenMap] = useState({});

  // Fetch each store's hours so every card can show an "Open Now" badge.
  useEffect(() => {
    if (stores.length === 0) return undefined;
    let active = true;
    Promise.all(
      stores.map((s) =>
        storeApi
          .getHours(s.id)
          .then(({ data: hoursData }) => ({ id: s.id, hours: hoursData.hours }))
          .catch(() => ({ id: s.id, hours: [] }))
      )
    ).then((results) => {
      if (!active) return;
      const map = {};
      results.forEach((r) => {
        map[r.id] = isStoreOpenNow(r.hours);
      });
      setOpenMap(map);
    });
    return () => {
      active = false;
    };
  }, [stores.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHero
        title="Choose a DemoTest Dispensary to Shop"
        subtitle="Pick a location and we'll open its order-ahead menu. Every store is powered by the real Dutchie embed — the mock preview appears only if embedding is blocked."
        eyebrow="Order Ahead"
        breadcrumb={[{ label: 'Shop' }]}
      />

      <section className="container-page py-12">
        <label htmlFor="shop-store" className="eyebrow mb-4 block text-gold-600">
          Choose your store
        </label>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((s) => (
              <div key={s.id} className="card-base flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-brand-800">{s.name.replace(/^DemoTest\s*/, '')}</h3>
                      <p className="text-sm text-brand-700/70">
                        {s.address}, {s.city}, {s.state} {s.zip}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <Badge tone={openMap[s.id] ? 'green' : 'red'}>
                    {openMap[s.id] ? 'Open Now' : 'Closed'}
                  </Badge>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5 pt-1">
                  <Button
                    onClick={() => navigate(`/shop/${s.slug}`)}
                    className="flex-1 min-w-[150px]"
                  >
                    <ShoppingBag className="h-4 w-4" /> Shop This Store
                  </Button>
                  <LinkButton to={`/locations/${s.slug}`} variant="outline">
                    Store Details <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}