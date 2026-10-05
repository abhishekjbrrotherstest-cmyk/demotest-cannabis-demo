import { useState } from 'react';
import { Send, MapPin } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import Button from '../components/ui/Button';
import { contactApi } from '../api/contactApi';
import { storeApi } from '../api/storeApi';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../hooks/usePageMeta';

const EMPTY = { first_name: '', last_name: '', email: '', phone: '', store_id: '', subject: '', message: '' };

export default function Contact() {
  usePageMeta('Contact | DemoTest Cannabis Co.', 'Get in touch with DemoTest Cannabis Co.');
  const { push } = useToast();
  const { data } = useFetch(() => storeApi.getStores(), []);
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await contactApi.send({ ...form, store_id: form.store_id || null });
      push('Message sent (mock)! We usually reply within one business day.');
      setForm(EMPTY);
    } catch (err) {
      push(err.userMessage || 'Could not send message', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Questions, feedback, or partnership pitches — we read everything and reply within one business day."
        eyebrow="Get In Touch"
        breadcrumb={[{ label: 'Contact' }]}
      />

      <section className="container-page py-12">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <div className="card-base p-6">
              <h2 className="text-lg text-brand-800">Visit or call</h2>
              <ul className="mt-4 space-y-3 text-sm text-brand-700/80">
                {(data?.stores || []).slice(0, 3).map((s) => (
                  <li key={s.id} className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                    <span>
                      {s.name.replace(/^DemoTest\s*/, '')}
                      <br />
                      <span className="text-brand-500">
                        {s.address}, {s.city} · {s.phone}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-gold-50 p-6">
              <h3 className="font-semibold text-brand-800">In a hurry?</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-700/75">
                The fastest way to get an answer is to call your local store during business hours —
                a human picks up.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="card-base space-y-4 p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cfn" className="label">First name</label>
                <input id="cfn" required className="field" placeholder="Jane" {...set('first_name')} />
              </div>
              <div>
                <label htmlFor="cln" className="label">Last name</label>
                <input id="cln" required className="field" placeholder="Doe" {...set('last_name')} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cemail" className="label">Email</label>
                <input id="cemail" required type="email" className="field" placeholder="you@example.com" {...set('email')} />
              </div>
              <div>
                <label htmlFor="cphone" className="label">Phone</label>
                <input id="cphone" type="tel" className="field" placeholder="Optional" {...set('phone')} />
              </div>
            </div>
            <div>
              <label htmlFor="cstore" className="label">Store</label>
              <select id="cstore" className="field" {...set('store_id')}>
                <option value="">General / not store-specific</option>
                {(data?.stores || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="csubject" className="label">Subject</label>
              <input id="csubject" required className="field" placeholder="How can we help?" {...set('subject')} />
            </div>
            <div>
              <label htmlFor="cmsg" className="label">Message</label>
              <textarea id="cmsg" required rows={5} className="field resize-none" placeholder="Write away…" {...set('message')} />
            </div>
            <Button type="submit" className="w-full" disabled={sending}>
              <Send className="h-4 w-4" /> {sending ? 'Sending…' : 'Send message (mock)'}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}