import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { usePageMeta } from '../hooks/usePageMeta';
import { useFetch } from '../hooks/useFetch';
import { storeApi } from '../api/storeApi';
import { blogApi } from '../api/blogApi';
import { SkeletonList } from '../components/ui/Skeleton';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop the Menu', to: '/shop' },
  { label: 'Medical Card Guide', to: '/medical-card' },
  { label: 'Rewards', to: '/rewards' },
  { label: 'Rewards Tiers', to: '/rewards/tiers' },
  { label: 'Locations', to: '/locations' },
  { label: 'Locations Events', to: '/locations/events' },
  { label: 'FAQ', to: '/faq' },
  { label: 'About', to: '/about' },
  { label: 'Community', to: '/community' },
  { label: 'Blog', to: '/blog' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
  { label: 'Search', to: '/search' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Accessibility', to: '/accessibility' },
];

export default function Sitemap() {
  usePageMeta('Sitemap | DemoTest Cannabis Co.', 'Every page on the DemoTest Cannabis Co. site, in one place.');
  const { data: storesData } = useFetch(() => storeApi.getStores(), []);
  const { data: blogData } = useFetch(() => blogApi.getPosts(), []);

  return (
    <>
      <PageHero
        title="Sitemap"
        subtitle="Wherever you're looking for, it's on this list."
        eyebrow="Site Navigation"
        breadcrumb={[{ label: 'Sitemap' }]}
      />
      <section className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl text-brand-800">Main pages</h2>
            <ul className="mt-4 space-y-2.5">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group inline-flex items-center gap-1 text-brand-700/85 hover:text-brand"
                  >
                    <ChevronRight className="h-4 w-4 text-gold-600" />
                    <span className="group-hover:underline group-hover:decoration-gold-400">
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl text-brand-800">Locations</h2>
              {storesData?.stores ? (
                <ul className="mt-4 space-y-2.5">
                  {storesData.stores.map((s) => (
                    <li key={s.id}>
                      <Link
                        to={`/locations/${s.slug}`}
                        className="group inline-flex items-center gap-1 text-brand-700/85 hover:text-brand"
                      >
                        <ChevronRight className="h-4 w-4 text-gold-600" />
                        <span className="group-hover:underline group-hover:decoration-gold-400">
                          {s.name.replace(/^DemoTest\s*/, '')} — {s.city}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <SkeletonList count={3} />
              )}
            </div>

            <div>
              <h2 className="text-xl text-brand-800">Blog articles</h2>
              {blogData?.posts ? (
                <ul className="mt-4 space-y-2.5">
                  {blogData.posts.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/blog/${p.slug}`}
                        className="group inline-flex items-center gap-1 text-brand-700/85 hover:text-brand"
                      >
                        <ChevronRight className="h-4 w-4 text-gold-600" />
                        <span className="group-hover:underline group-hover:decoration-gold-400">
                          {p.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <SkeletonList count={3} />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}