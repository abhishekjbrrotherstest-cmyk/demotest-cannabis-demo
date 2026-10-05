import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';

const ROLE_PERMISSIONS = {
  super_admin: [
    'stores.edit', 'stores.delete', 'blog.manage', 'blog.delete', 'faqs.manage',
    'faqs.delete', 'careers.manage', 'careers.delete', 'contact.view', 'contact.delete',
    'users.view', 'users.manage', 'dashboard.view', 'home.manage', 'about.manage',
    'pages.manage', 'pages.delete', 'menus.manage',
  ],
  admin: [
    'stores.edit', 'blog.manage', 'faqs.manage', 'careers.manage',
    'contact.view', 'contact.delete', 'users.view', 'dashboard.view',
    'home.manage', 'about.manage', 'pages.manage', 'pages.delete', 'menus.manage',
  ],
  store_manager: ['stores.edit', 'dashboard.view', 'contact.view'],
  marketing_manager: ['blog.manage', 'blog.delete', 'faqs.manage', 'faqs.delete', 'careers.manage', 'dashboard.view'],
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    setUser(null);
  };

  const hasPermission = (perm) =>
    Boolean(user && ROLE_PERMISSIONS[user.role]?.includes(perm));

  const value = useMemo(
    () => ({ user, loading, login, logout, hasPermission, permissions: user ? ROLE_PERMISSIONS[user.role] : [] }),
    [user, loading] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}