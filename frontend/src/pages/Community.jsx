import { GraduationCap, HandHeart, Users, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { usePageMeta } from '../hooks/usePageMeta';

const PROGRAMS = [
  { icon: GraduationCap, title: 'Wednesday Seminars', text: 'Free monthly talks on dosing, terpenes, and navigating the PA program — open to patients and caregivers.' },
  { icon: HandHeart, title: 'Caregiver Support', text: 'A monthly meetup and resource hub for the people who support patients day to day.' },
  { icon: Users, title: 'Community Grants', text: 'Each quarter we fund a local wellness or harm-reduction program chosen by our patients.' },
];

export default function Community() {
  usePageMeta('Community | DemoTest Cannabis Co.', 'Programs, partnerships, and giving at DemoTest Cannabis Co.');

  return (
    <>
      <PageHero
        title="Community"
        subtitle="We're part of the neighborhoods we serve. Here's how we give back in each city."
        eyebrow="Programs & Partnerships"
        breadcrumb={[{ label: 'Community' }]}
      />

      <section className="container-page py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <div key={p.title} className="card-base p-7">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-100 text-gold-600">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg text-brand-800">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-700/75">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl bg-gold p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_auto]">
            <div>
              <p className="eyebrow text-brand-700">Membership</p>
              <h2 className="mt-2 text-3xl font-semibold text-brand-800">Join the DemoTest Rewards club.</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-800/75">
                Free to join, 100 welcome points, and 1 point per $1 at every location. Community
                members get early invites to seminars and first dibs on quarterly grant votes.
              </p>
            </div>
            <Link
              to="/rewards#join"
              className="btn-base inline-flex items-center gap-2 bg-brand px-7 text-cream hover:bg-brand-600"
            >
              <Gift className="h-5 w-5" /> Join Us
            </Link>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-brand p-8 text-center text-cream sm:p-12">
          <p className="eyebrow text-gold-400">Get Involved</p>
          <h2 className="mt-2 text-3xl">Have an idea for your community?</h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/75">
            We review partnership pitches every month. Tell us about your program and we'll get back
            to you within a week.
          </p>
          <a href="/contact" className="btn-base mt-6 inline-flex bg-gold text-brand hover:bg-gold-500">
            Pitch a partnership
          </a>
        </div>
      </section>
    </>
  );
}