import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Page Not Found | DemoTest Cannabis Co.');

  return (
    <section className="container-page flex flex-col items-center py-28 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-50 text-brand">
        <Compass className="h-10 w-10" />
      </span>
      <p className="eyebrow mt-6 text-gold-600">404</p>
      <h1 className="mt-2 text-4xl text-brand-800">You wandered off the trail</h1>
      <p className="mt-3 max-w-md text-brand-700/70">
        That page doesn't exist or has moved. Let's get you back to one of these:
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-base bg-brand text-cream hover:bg-brand-600">Home</Link>
        <Link to="/shop" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">Shop</Link>
        <Link to="/faq" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">FAQ</Link>
      </div>
    </section>
  );
}