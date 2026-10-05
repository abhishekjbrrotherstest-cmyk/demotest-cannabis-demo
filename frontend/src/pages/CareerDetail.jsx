import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CheckCircle2, Briefcase } from 'lucide-react';
import { useState } from 'react';
import PageHero from '../components/ui/PageHero';
import Button from '../components/ui/Button';
import { careerApi } from '../api/careerApi';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../context/ToastContext';
import { SkeletonList } from '../components/ui/Skeleton';
import { usePageMeta } from '../hooks/usePageMeta';

export default function CareerDetail() {
  const { id } = useParams();
  const { push } = useToast();
  const { data, loading, error } = useFetch(() => careerApi.getCareer(id), [id]);
  const career = data?.career;

  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', cover_letter: '' });
  const [submitting, setSubmitting] = useState(false);

  usePageMeta(
    career ? `${career.title} | DemoTest Careers` : 'Career | DemoTest Cannabis Co.',
    career?.description?.slice(0, 160)
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await careerApi.apply(id, form);
      push('Application submitted (mock)! Check your email for next steps.');
      setForm({ first_name: '', last_name: '', email: '', phone: '', cover_letter: '' });
    } catch (err) {
      push(err.userMessage || 'Could not submit application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  if (loading) {
    return (
      <section className="container-page py-12">
        <SkeletonList count={5} />
      </section>
    );
  }

  if (error || !career) {
    return (
      <section className="container-page py-24 text-center">
        <h1 className="text-3xl text-brand-800">Job not found</h1>
        <Link to="/careers" className="link-underline mt-6 inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to careers
        </Link>
      </section>
    );
  }

  return (
    <>
      <PageHero
        title={career.title}
        eyebrow="Careers"
        breadcrumb={[{ label: 'Careers', to: '/careers' }, { label: career.title }]}
      />

      <section className="container-page py-12">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4 text-sm text-brand-700/80">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gold-600" /> {career.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gold-600" /> {career.employment_type}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-gold-600" /> Open
              </span>
            </div>

            <div>
              <h2 className="text-2xl text-brand-800">About the role</h2>
              <p className="mt-3 leading-relaxed text-brand-800/85">{career.description}</p>
            </div>

            {career.responsibilities && (
              <div>
                <h2 className="text-2xl text-brand-800">What you'll do</h2>
                <ul className="mt-3 space-y-2 text-brand-800/85">
                  {career.responsibilities.split(/\n|\. /).filter(Boolean).map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-gold-600" />
                      {r.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {career.requirements && (
              <div>
                <h2 className="text-2xl text-brand-800">What we're looking for</h2>
                <ul className="mt-3 space-y-2 text-brand-800/85">
                  {career.requirements.split(/\n|\. /).filter(Boolean).map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-gold-600" />
                      {r.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="card-base h-fit p-6">
            <h2 className="text-lg text-brand-800">Apply now</h2>
            <p className="mt-1 text-sm text-brand-700/70">
              Submissions are saved to the database. No real emails are sent (demo).
            </p>
            <form onSubmit={onSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="First name" {...field('first_name')} className="field" />
                <input required placeholder="Last name" {...field('last_name')} className="field" />
              </div>
              <input required type="email" placeholder="Email" {...field('email')} className="field" />
              <input type="tel" placeholder="Phone" {...field('phone')} className="field" />
              <textarea
                rows={4}
                placeholder="Cover letter (optional)"
                {...field('cover_letter')}
                className="field resize-none"
              />
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit application (mock)'}
              </Button>
            </form>
          </aside>
        </div>
      </section>
    </>
  );
}