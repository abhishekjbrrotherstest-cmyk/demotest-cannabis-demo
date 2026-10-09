import { useLocation } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { usePageMeta } from '../hooks/usePageMeta';

const DOCS = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'January 1, 2026',
    body: [
      'This is a demo project. DemoTest Cannabis Co. collects only the information you voluntarily submit through demo forms (contact, job applications, newsletter).',
      'We do not sell personal data. In a production implementation, this policy would describe data retention, sharing, and the rights available under applicable law (including HIPAA-adjacent safeguards for medical information).',
      'The age gate stores a single flag ("demotest_age_verified") in your browser’s local storage — it contains no personal data.',
      'Session authentication uses an HTTP-only cookie scoped to this demo backend.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    updated: 'January 1, 2026',
    body: [
      'DemoTest Cannabis Co. is a fictional, demonstration-only brand. Nothing on this site constitutes medical advice, nor an offer to sell cannabis.',
      'You must be 21 or older and hold a valid Pennsylvania medical marijuana card to use this site, matching the demo age gate.',
      'All product listings in the preview menu are simulated placeholders. Dutchie checkouts do not process real orders from this demo.',
      'Use of the admin area is limited to the demo credentials provided in the README. All administrative actions are recorded to the audit log.',
    ],
  },
  accessibility: {
    title: 'Accessibility Statement',
    updated: 'January 1, 2026',
    body: [
      'DemoTest aims to meet WCAG 2.1 AA guidelines: keyboard navigation, focus states, aria labels on dynamic regions, and reduced-flicker animations.',
      'Loading states use role="status" announcements; modal dialogs trap focus and respond to Escape.',
      'Color contrast is checked against the brand palette. If anything is hard to use, please use the contact form — accessibility feedback is treated as a priority.',
    ],
  },
};

export default function Legal() {
  const { pathname } = useLocation();
  const docKey = pathname.replace('/', '') || 'privacy';
  const page = DOCS[docKey] || DOCS.privacy;

  usePageMeta(`${page.title} | DemoTest Cannabis Co.`);

  return (
    <>
      <PageHero
        title={page.title}
        subtitle={`Last updated: ${page.updated}`}
        eyebrow="Legal"
        breadcrumb={[{ label: page.title }]}
      />

      <section className="container-page py-12">
        <div className="mx-auto max-w-3xl space-y-5 leading-relaxed text-brand-800/85">
          {page.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
    </>
  );
}