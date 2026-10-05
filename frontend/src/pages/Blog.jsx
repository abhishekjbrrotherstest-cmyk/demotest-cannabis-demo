import { Link, useParams } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { blogApi } from '../api/blogApi';
import { useFetch } from '../hooks/useFetch';
import { SkeletonCard } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';

function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function Blog() {
  const { category, tag } = useParams();
  const postsState = useFetch(() => blogApi.getPosts(), [category, tag]);
  const posts = postsState.data?.posts || [];
  const loading = postsState.loading;
  const error = postsState.error;

  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))].sort();
  const tags = [...new Set(posts.flatMap((p) => (p.tags || '').split(',').map((t) => t.trim()).filter(Boolean)))]
    .sort((a, b) => a.localeCompare(b));

  const activeCategory = category ? decodeURIComponent(category) : null;
  const activeTag = tag ? decodeURIComponent(tag) : null;

  const filtered = activeCategory
    ? posts.filter((p) => p.category === activeCategory)
    : activeTag
      ? posts.filter((p) => (p.tags || '').toLowerCase().includes(activeTag.toLowerCase()))
      : posts;

  usePageMeta(
    activeCategory
      ? `${activeCategory} — Blog | DemoTest Cannabis Co.`
      : activeTag
        ? `#${activeTag} — Blog | DemoTest Cannabis Co.`
        : 'Blog | DemoTest Cannabis Co.',
    'Patient guides and news from the DemoTest Cannabis Co. education team.'
  );

  return (
    <>
      <PageHero
        title={activeCategory || (activeTag ? `#${activeTag}` : 'The DemoTest Journal')}
        subtitle={
          activeCategory || activeTag
            ? 'Articles in this collection.'
            : 'Patient guides, program news, and perspectives written or reviewed by our education team.'
        }
        eyebrow="Patient Education"
        breadcrumb={[{ label: 'Blog', to: '/blog' }].concat(
          activeCategory ? [{ label: activeCategory }] : [],
          activeTag ? [{ label: `#${activeTag}` }] : []
        )}
      />

      <section className="container-page py-12">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/blog"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !activeCategory && !activeTag ? 'bg-brand text-cream' : 'bg-brand-50 text-brand-700 hover:bg-gold-100'
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              to={`/blog/category/${slugify(c)}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeCategory === c ? 'bg-brand text-cream' : 'bg-brand-50 text-brand-700 hover:bg-gold-100'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-4">
          <p className="text-sm text-brand-700/70">
            {filtered.length} article{filtered.length === 1 ? '' : 's'}
            {activeCategory ? ` in ${activeCategory}` : ''}
            {activeTag ? ` tagged #${activeTag}` : ''}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 12).map((t) => (
              <Link
                key={t}
                to={`/blog/tag/${slugify(t)}`}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  activeTag === t ? 'bg-gold text-brand' : 'bg-gold-50 text-gold-700 hover:bg-gold-100'
                }`}
              >
                #{t}
              </Link>
            ))}
          </div>
        </div>

        {error && <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-brand-50 p-10 text-center text-brand-700/70">
            No articles in this collection yet. Check back soon.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to={`/blog/${p.slug}`}
                className="card-base group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift"
              >
                <img src={p.featured_image} alt="" className="h-44 w-full object-cover" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to={`/blog/category/${slugify(p.category)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-semibold uppercase tracking-wider text-gold-600 hover:underline"
                    >
                      {p.category}
                    </Link>
                    <span className="text-xs text-brand-500">
                      {new Date(p.publish_date).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg leading-snug text-brand-800">{p.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-700/70">
                    {p.content}
                  </p>
                  <span className="link-underline mt-4">Read article</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}