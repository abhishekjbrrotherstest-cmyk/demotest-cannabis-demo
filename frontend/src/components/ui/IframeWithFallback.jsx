import { useEffect, useState } from 'react';

/**
 * IframeWithFallback — loads an iframe and, if it fails to load within
 * `timeout` ms (403 / CSP / X-Frame-Options blocks do not fire `onError`
 * reliably), renders the `fallback` render-prop panel instead.
 *
 * Props:
 *  - src: string
 *  - title: string
 *  - timeout: number (ms) — default 4000
 *  - fallback: (reset) => ReactNode — rendered when load fails/times out
 *  - className: string
 */
export default function IframeWithFallback({ src, title, timeout = 4000, fallback, className = 'w-full min-h-[900px]', loadingSkeleton }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (loaded || failed) return undefined;
    const timer = setTimeout(() => {
      setFailed(true);
      // eslint-disable-next-line no-console
      console.warn('[IframeWithFallback] Iframe did not load within timeout. Remote likely returned 403 / blocked embedding.');
    }, timeout);
    return () => clearTimeout(timer);
  }, [loaded, failed, timeout, attempt]);

  if (failed && fallback) {
    return fallback(() => {
      setFailed(false);
      setLoaded(false);
      setAttempt((a) => a + 1);
    });
  }

  return (
    <div className="relative">
      {!loaded && !failed && (loadingSkeleton || (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex items-center gap-3 text-brand-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            <span className="text-sm">Connecting to Dutchie menu…</span>
          </div>
        </div>
      ))}
      <iframe
        key={attempt}
        src={src}
        title={title}
        className={`${className} ${loaded ? '' : 'hidden'}`}
        allow="payment; clipboard-write"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}