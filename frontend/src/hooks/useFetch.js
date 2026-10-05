import { useEffect, useState } from 'react';

export function useFetch(fn, deps, { skip = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (skip) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    setLoading(true);
    setError(null);
    fn()
      .then(({ data: result }) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err.userMessage || err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const refetch = () => setTick((t) => t + 1);

  return { data, loading, error, refetch };
}