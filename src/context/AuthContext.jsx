import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

const AuthContext = createContext(null);

function hashPassword(pw) {
  let hash = 0;
  for (let i = 0; i < pw.length; i++) { const c = pw.charCodeAt(i); hash = ((hash << 5) - hash) + c; hash |= 0; }
  return btoa(String(hash));
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem('np_users')) || []; } catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem('np_users', JSON.stringify(users));
}

function getCurrentUserId() {
  return localStorage.getItem('np_currentUser');
}
function setCurrentUserId(id) {
  if (id) localStorage.setItem('np_currentUser', id);
  else localStorage.removeItem('np_currentUser');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const id = getCurrentUserId();
    if (!id) return null;
    const users = getUsers();
    return users.find(u => u.id === id) || null;
  });
  const [users, setUsersState] = useState(getUsers);

  const syncUsers = useCallback(() => {
    setUsersState(getUsers());
  }, []);

  useEffect(() => {
    const handler = () => syncUsers();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [syncUsers]);

  const register = useCallback((name, email, password) => {
    const all = getUsers();
    if (all.find(u => u.email === email)) return { ok: false, error: 'Email already registered' };
    const id = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const newUser = { id, name, email, password: hashPassword(password), createdAt: new Date().toISOString() };
    all.push(newUser);
    saveUsers(all);
    setUsersState(all);
    setUser(newUser);
    setCurrentUserId(id);
    return { ok: true };
  }, []);

  const login = useCallback((email, password) => {
    const all = getUsers();
    const found = all.find(u => u.email === email && u.password === hashPassword(password));
    if (!found) return { ok: false, error: 'Invalid email or password' };
    setUser(found);
    setCurrentUserId(found.id);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentUserId(null);
  }, []);

  const deleteAccount = useCallback(() => {
    if (!user) return;
    const all = getUsers().filter(u => u.id !== user.id);
    const prefix = `np_data_${user.id}`;
    const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
    keys.forEach(k => localStorage.removeItem(k));
    saveUsers(all);
    setUsersState(all);
    setUser(null);
    setCurrentUserId(null);
  }, [user]);

  const updateUser = useCallback((updates) => {
    if (!user) return;
    const all = getUsers();
    const idx = all.findIndex(u => u.id === user.id);
    if (idx === -1) return;
    all[idx] = { ...all[idx], ...updates };
    saveUsers(all);
    setUser(all[idx]);
    setUsersState(all);
  }, [user]);

  const value = useMemo(() => ({
    user, users, register, login, logout, deleteAccount, updateUser, isAuthenticated: !!user,
  }), [user, users, register, login, logout, deleteAccount, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
