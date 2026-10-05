import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, FileText, MapPin, HelpCircle, Briefcase, Layout, AlertCircle } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { searchApi } from '../api/contentApi';
import { usePageMeta } from '../hooks/usePageMeta';
import { SkeletonList } from '../components/ui/Skeleton';

function ResultList({ icon: Icon, title, children, tint }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-lg text-brand-800">
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${tint}`}>
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [input, setInput] = useState(q);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  usePageMeta(q ? `Search: ${q} | DemoTest Cannabis Co.` : 'Search | DemoTest Cannabis Co.', 'Search the DemoTest site.');

  useEffect(() => {
    const trimmed = q.trim();
    if (!trimmed) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    searchApi
      .search(trimmed)
      .then(({ data: result }) => {
        if (active) setData(result.results);
      })
      .catch(() => {
        if (active) setError('Search failed. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [q]);

  const submit = (e) => {
    e.preventDefault();
    setParams(input.trim() ? { q: input.trim() } : {});
  };

  const r = (data && {
    posts: data.posts || [],
    stores: data.stores || [],
    faqs: data.faqs || [],
    careers: data.careers || [],
    pages: data.pages || [],
  }) || { posts: [], stores: [], faqs: [], careers: [], pages: [] };

  const total = r.posts.length + r.stores.length + r.faqs.length + r.careers.length + r.pages.length;
  const empty = q.trim() && !loading && !error && total === 0;

  return (
    <>
      <PageHero
        title="Search"
        subtitle="Find articles, stores, FAQs, careers, and pages across the DemoTest site."
        eyebrow="Site Search"
        breadcrumb={[{ label: 'Search' }]}
      />

      <section className="container-page py-12">
        <form onSubmit={submit} className="mx-auto flex max-w-2xl gap-3">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-400" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Try “medical card”, “Pittsburgh”, or “dosing”…"
              className="field h-12 pl-12"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="h-12 rounded-xl bg-brand px-6 font-semibold text-cream transition hover:bg-brand-700"
          >
            Search
          </button>
        </form>

        <div className="mx-auto mt-10 max-w-4xl space-y-10">
          {!q.trim() && (
            <p className="text-center text-brand-700/60">Type above to search the site.</p>
          )}
          {error && (
            <p className="flex items-center justify-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
          {loading && <SkeletonList count={4} />}
          {empty && (
            <div className="rounded-2xl bg-brand-50 p-10 text-center text-brand-700/70">
              No results for “{q}”. Try a different term.
            </div>
          )}

          {!loading && !error && q.trim() && !empty && (
            <p className="text-sm text-brand-700/60">
              {total} result{total === 1 ? '' : 's'} for “{q}”
            </p>
          )}

          {r.posts.length > 0 && (
            <ResultList icon={FileText} title={`Blog posts (${r.posts.length})`} tint="bg-brand-50 text-brand">
              {r.posts.map((p) => (
                <Link key={`p${p.id}`} to={`/blog/${p.slug}`} className="card-base block p-5 transition hover:shadow-lift">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">{p.category}</p>
                  <h3 className="mt-1 text-lg text-brand-800">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-brand-700/70">{p.content}</p>
                </Link>
              ))}
            </ResultList>
          )}

          {r.stores.length > 0 && (
            <ResultList icon={MapPin} title={`Locations (${r.stores.length})`} tint="bg-gold-100 text-gold-600">
              {r.stores.map((s) => (
                <Link key={`s${s.id}`} to={`/locations/${s.slug}`} className="card-base block p-5 transition hover:shadow-lift">
                  <h3 className="text-lg text-brand-800">{s.name.replace(/^DemoTest\s*/, '')}</h3>
                  <p className="mt-1 text-sm text-brand-700/70">
                    {s.address}, {s.city}, {s.state} {s.zip}
                  </p>
                </Link>
              ))}
            </ResultList>
          )}

          {r.faqs.length > 0 && (
            <ResultList icon={HelpCircle} title={`FAQs (${r.faqs.length})`} tint="bg-brand-50 text-brand">
              {r.faqs.map((f) => (
                <Link key={`f${f.id}`} to="/faq" className="card-base block p-5 transition hover:shadow-lift">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">{f.category}</p>
                  <h3 className="mt-1 text-lg text-brand-800">{f.question}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-brand-700/70">{f.answer}</p>
                </Link>
              ))}
            </ResultList>
          )}

          {r.careers.length > 0 && (
            <ResultList icon={Briefcase} title={`Careers (${r.careers.length})`} tint="bg-gold-100 text-gold-600">
              {r.careers.map((c) => (
                <Link key={`c${c.id}`} to={`/careers/${c.id}`} className="card-base block p-5 transition hover:shadow-lift">
                  <h3 className="text-lg text-brand-800">{c.title}</h3>
                  <p className="mt-1 text-sm text-brand-700/70">
                    {c.location} · {c.employment_type}
                  </p>
                </Link>
              ))}
            </ResultList>
          )}

          {r.pages.length > 0 && (
            <ResultList icon={Layout} title={`Pages (${r.pages.length})`} tint="bg-brand-50 text-brand">
              {r.pages.map((p) => (
                <Link key={`pg${p.id}`} to={`/pages/${p.slug}`} className="card-base block p-5 transition hover:shadow-lift">
                  <h3 className="text-lg text-brand-800">{p.title}</h3>
                </Link>
              ))}
            </ResultList>
          )}
        </div>
      </section>
    </>
  );
}