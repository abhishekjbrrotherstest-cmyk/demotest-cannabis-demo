import { Link, useParams } from 'react-router-dom';
import { MapPin, Phone, ArrowLeft, ChevronRight, Navigation } from 'lucide-react';
import DutchieEmbed from '../components/shop/DutchieEmbed';
import Badge from '../components/ui/Badge';
import Button, { LinkButton } from '../components/ui/Button';
import { storeApi } from '../api/storeApi';
import { useFetch } from '../hooks/useFetch';
import { SkeletonCard } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';
import { isStoreOpenNow } from '../utils/storeHours';

export default function ShopStore() {
  const { storeSlug } = useParams();
  const { data, loading, error } = useFetch(() => storeApi.getStore(storeSlug), [storeSlug]);
  const store = data?.store;
  const open = isStoreOpenNow(data?.hours);

  usePageMeta(
    store ? `Shop ${store.name} | DemoTest Cannabis Co.` : 'Shop a Store | DemoTest Cannabis Co.',
    `Order ahead from ${store?.name || 'a DemoTest store'} with the Dutchie-powered menu.`
  );

  if (loading) {
    return (
      <section className="container-page py-12">
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    );
  }

  if (error || !store) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="text-3xl text-brand-800">Store not found</h1>
        <p className="mt-3 text-brand-700/70">
          {error || 'We could not find that store.'} Try picking one from the list.
        </p>
        <Link to="/shop" className="link-underline mt-6 inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to all stores
        </Link>
      </section>
    );
  }

  const mapsUrl = store.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${store.address}, ${store.city}, ${store.state} ${store.zip}`
  )}`;

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-brand-100 bg-cream">
        <div className="container-page flex items-center gap-1.5 py-3 text-sm text-brand-600">
          <Link to="/" className="transition hover:text-gold-600">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
          <Link to="/shop" className="transition hover:text-gold-600">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
          <span aria-current="page" className="font-semibold text-brand-800">{store.name.replace(/^DemoTest\s*/, '')}</span>
        </div>
      </nav>

      {/* Compact store header bar */}
      <section className="border-b border-brand-100 bg-brand-50/60">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold text-brand-800">{store.name}</h2>
              <Badge tone={open ? 'green' : 'red'}>{open ? 'Open Now' : 'Closed'}</Badge>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-700/80">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold-600" />
                {store.address}, {store.city}, {store.state} {store.zip}
              </span>
              {store.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-gold-600" />
                  <a href={`tel:${store.phone}`} className="hover:text-gold-600">{store.phone}</a>
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Navigation className="h-4 w-4" /> Get Directions
              </Button>
            </a>
            {store.phone && (
              <a href={`tel:${store.phone}`}>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4" /> Call Store
                </Button>
              </a>
            )}
            <LinkButton to={`/locations/${store.slug}`} variant="ghost" size="sm">
              Store Details
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Dutchie menu — only content in this area */}
      <section className="container-page py-8">
        <div className="min-h-[700px] lg:min-h-[900px]">
          <DutchieEmbed storeId={store.dutchie_menu_id || `demotest-${store.slug}`} storeName={store.name} />
        </div>

        <div className="mt-10 text-center">
          <Link to="/shop" className="link-underline inline-flex items-center gap-2 font-semibold">
            <ArrowLeft className="h-4 w-4" /> Back to all stores
          </Link>
        </div>
      </section>
    </>
  );
}