import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, User } from 'lucide-react';
import { useState } from 'react';
import PageHero from '../components/ui/PageHero';
import { blogApi } from '../api/blogApi';
import { useFetch } from '../hooks/useFetch';
import { SkeletonList } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';

function slugify(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function BlogPost() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(() => blogApi.getPost(slug), [slug]);
  const post = data?.post;
  const [copied, setCopied] = useState(false);

  usePageMeta(
    post ? `${post.title} | DemoTest Cannabis Co.` : 'Article | DemoTest Cannabis Co.',
    post?.meta_description || post?.content?.slice(0, 160)
  );

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href)?.then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <section className="container-page py-12">
        <SkeletonList count={4} />
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="text-3xl text-brand-800">Article not found</h1>
        <Link to="/blog" className="link-underline mt-6 inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to the journal
        </Link>
      </section>
    );
  }

  const pageTags = (post.tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <>
      <PageHero
        title={post.title}
        eyebrow={post.category}
        breadcrumb={[{ label: 'Blog', to: '/blog' }, { label: post.category }]}
      />

      <article className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 text-sm text-brand-600">
            <div className="flex flex-wrap items-center gap-5">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-gold-600" /> {post.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-gold-600" />{' '}
                {new Date(post.publish_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </span>
            </div>
            <Link
              to={`/blog/category/${slugify(post.category)}`}
              className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 hover:bg-gold-100"
            >
              {post.category}
            </Link>
          </div>
          <img
            src={post.featured_image}
            alt=""
            className="h-64 w-full rounded-2xl object-cover sm:h-80"
          />
          <div className="mt-8 space-y-5 leading-relaxed text-brand-800/90">
            <p className="text-lg">{post.content}</p>
            <p>
              This guide is part of the DemoTest education curriculum and is provided for demo
              purposes only. Always consult a physician for medical advice.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-brand-100 pt-6">
            {pageTags.map((t) => (
              <Link
                key={t}
                to={`/blog/tag/${slugify(t)}`}
                className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 transition hover:bg-gold-100"
              >
                #{t}
              </Link>
            ))}
            <button
              onClick={copyLink}
              className="ml-auto rounded-full border border-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>
      </article>
    </>
  );
}