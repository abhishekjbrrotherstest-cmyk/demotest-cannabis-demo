import { createPortal } from 'react-dom';
import { ShieldAlert } from 'lucide-react';
import { useAgeGate } from '../../context/AgeGateContext';
import Button from '../ui/Button';

export default function AgeGate() {
  const { verified, verify } = useAgeGate();
  if (verified) return null;

  return createPortal(
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-900/80 backdrop-blur" />
      <div role="dialog" aria-modal="true" aria-label="Age verification" className="card-base relative w-full max-w-md overflow-hidden p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-100 text-gold-600">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <p className="eyebrow mt-5 text-gold-600">Age Verification</p>
        <h2 className="mt-2 text-2xl text-brand-800">Are you 21 or older?</h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-700/75">
          You must be <strong>21 years or older</strong> and hold a <strong>valid Pennsylvania medical
          marijuana card</strong> to view this site. This is a demo project.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <Button variant="secondary" size="lg" onClick={verify}>
            Yes, I am 21 or older
          </Button>
          <a
            href="https://www.google.com"
            className="btn-base border border-brand-100 text-sm font-semibold text-brand-500 hover:bg-brand-50"
          >
            No, take me to the web
          </a>
        </div>
        <p className="mt-5 text-[11px] text-brand-500">
          We do not store your date of birth. Your choice is remembered on this device only.
        </p>
      </div>
    </div>,
    document.body
  );
}