import { ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';
import IframeWithFallback from '../ui/IframeWithFallback';
import Button from '../ui/Button';
import MockDutchieMenu from './MockDutchieMenu';
import { DUTCHIE_URL } from '../../api/dutchieApi';

/**
 * DutchieEmbed — ALWAYS uses the real Dutchie URL as the iframe src and as
 * the "Open in new tab" fallback. If the iframe is blocked (403 / CSP /
 * X-Frame-Options), a friendly panel + Preview Mode mock menu is shown.
 *
 * Props: { storeId, storeName }
 */
export default function DutchieEmbed({ storeId = 'demotest-meriden', storeName = 'DemoTest Cannabis Co. — Meriden' }) {
  // eslint-disable-next-line no-console
  console.log('[DutchieEmbed] Loading iframe src:', DUTCHIE_URL);

  const fallback = (reset) => (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
          <div>
            <h3 className="font-semibold text-amber-900">The live Dutchie menu could not be embedded</h3>
            <p className="mt-1 text-sm leading-relaxed text-amber-800/90">
              Dutchie returned a block (403 / X-Frame-Options). This happens when the embed is opened
              from a domain Dutchie hasn't whitelisted yet. The real menu is still fully available in
              a new tab:
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => window.open(DUTCHIE_URL, '_blank', 'noopener,noreferrer')}
            variant="primary"
          >
            Open Dutchie Menu <ExternalLink className="h-4 w-4" />
          </Button>
          <Button onClick={reset} variant="outline">
            <RefreshCw className="h-4 w-4" /> Retry embed
          </Button>
        </div>
        <p className="mt-4 break-all text-xs text-amber-700/80">{DUTCHIE_URL}</p>
      </div>

      <div>
        <p className="rounded-t-xl bg-brand px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-cream">
          Preview Mode — Simulated Dutchie Menu (Real URL: dutchie.com)
        </p>
        <MockDutchieMenu storeId={storeId} storeName={storeName} realUrl={DUTCHIE_URL} />
      </div>
    </div>
  );

  return (
    <div>
      <IframeWithFallback
        src={DUTCHIE_URL}
        title="Dutchie Menu"
        timeout={4000}
        fallback={fallback}
        className="h-full w-full min-h-[700px]"
      />
      <p className="mt-3 text-center text-sm text-brand-700">
        Having trouble?{' '}
        <a
          href={DUTCHIE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-gold-400 underline-offset-4 transition hover:text-gold-600"
        >
          Open Dutchie Menu in a new tab →
        </a>
      </p>
    </div>
  );
}