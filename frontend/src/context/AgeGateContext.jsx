import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const STORAGE_KEY = 'demotest_age_verified';

const AgeGateContext = createContext(null);

export function AgeGateProvider({ children }) {
  const [verified, setVerified] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');

  const verify = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVerified(true);
  }, []);

  const value = useMemo(() => ({ verified, verify }), [verified, verify]);

  return <AgeGateContext.Provider value={value}>{children}</AgeGateContext.Provider>;
}

export function useAgeGate() {
  const ctx = useContext(AgeGateContext);
  if (!ctx) throw new Error('useAgeGate must be used within AgeGateProvider');
  return ctx;
}