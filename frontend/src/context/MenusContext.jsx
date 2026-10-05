import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { menuApi } from '../api/contentApi';

export const FALLBACK_MENUS = {
  header: [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'FAQ', to: '/faq' },
    { label: 'About Us', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ],
  mobile: [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Locations', to: '/locations' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Medical Card', to: '/medical-card' },
    { label: 'Rewards', to: '/rewards' },
    { label: 'About', to: '/about' },
    { label: 'Community', to: '/community' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/contact' },
  ],
  footer: [
    { label: 'Shop', to: '/shop' },
    { label: 'Locations', to: '/locations' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Rewards', to: '/rewards' },
    { label: 'About Us', to: '/about' },
    { label: 'Community', to: '/community' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/contact' },
  ],
};

const MenusContext = createContext({ menus: FALLBACK_MENUS, loading: true });

export function MenusProvider({ children }) {
  const [menus, setMenus] = useState(FALLBACK_MENUS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    menuApi
      .getMenus()
      .then(({ data }) => {
        if (!active) return;
        const next = {};
        for (const key of ['header', 'mobile', 'footer']) {
          const match = (data.menus || []).find((m) => m.key_name === key);
          next[key] = (match?.items || []).map((i) => ({ label: i.label, to: i.url }));
        }
        setMenus(next);
      })
      .catch(() => {/* keep fallbacks */})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ menus, loading }), [menus, loading]);
  return <MenusContext.Provider value={value}>{children}</MenusContext.Provider>;
}

export function useMenus() {
  return useContext(MenusContext);
}