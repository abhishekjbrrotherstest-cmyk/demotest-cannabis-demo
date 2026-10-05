import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import { pageApi } from '../api/contentApi';
import { useFetch } from '../hooks/useFetch';
import { usePageMeta } from '../hooks/usePageMeta';
import { SkeletonList } from '../components/ui/Skeleton';

export default function CmsPage() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(() => pageApi.getBySlug(slug), [slug]);
  const page = data?.page;

  usePageMeta(
    page?.seo_title || (page ? `${page.title} | DemoTest Cannabis Co.` : 'Page | DemoTest Cannabis Co.'),
    page?.meta_description || page?.content?.slice(0, 160)
  );

  if (loading) {
    return (
      <section className="container-page py-12">
        <SkeletonList count={5} />
      </section>
    );
  }

  if (error || !page) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="text-3xl text-brand-800">Page not found</h1>
        <p className="mt-2 text-brand-700/70">The page you're looking for doesn't exist.</p>
        <Link to="/" className="link-underline mt-6 inline-flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </section>
    );
  }

  return (
    <>
      <PageHero
        title={page.title}
        subtitle="DemoTest Cannabis Co. resource page"
        eyebrow={page.status === 'draft' ? 'Draft' : 'Info'}
        image={page.hero_image_url}
        breadcrumb={[{ label: page.title }]}
      />
      <section className="container-page py-14">
        <article
          className="cms-prose mx-auto max-w-3xl"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </section>
    </>
  );
}