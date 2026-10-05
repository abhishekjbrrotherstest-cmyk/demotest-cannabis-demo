import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ServerError() {
  usePageMeta('Something Went Wrong | DemoTest Cannabis Co.');

  return (
    <section className="container-page flex flex-col items-center py-28 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-3xl bg-red-50 text-red-600">
        <AlertTriangle className="h-10 w-10" />
      </span>
      <p className="eyebrow mt-6 text-gold-600">500</p>
      <h1 className="mt-2 text-4xl text-brand-800">The counter is having a moment</h1>
      <p className="mt-3 max-w-md text-brand-700/70">
        Something went wrong on our side. Try again in a minute, or head to one of these:
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-base bg-brand text-cream hover:bg-brand-600">Home</Link>
        <Link to="/shop" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">Shop</Link>
        <Link to="/contact" className="btn-base border border-brand text-brand hover:bg-brand hover:text-cream">Contact</Link>
      </div>
    </section>
  );
}