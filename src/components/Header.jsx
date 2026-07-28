import { useState, useRef, useEffect } from 'react';
import { useNutrition } from '../context/NutritionContext';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'mealplan', label: 'Meal Plan', icon: '📋' },
  { id: 'workout', label: 'Workout', icon: '💪' },
  { id: 'grocery', label: 'Groceries', icon: '🛒' },
  { id: 'tracker', label: 'Tracker', icon: '✅' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

export default function Header() {
  const { view, setView, isProfileComplete } = useNutrition();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isProfileComplete) return null;

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-warm-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-200">
              <span className="text-lg">🥗</span>
            </div>
            <span className="text-lg font-bold text-warm-800 hidden sm:block">NutriPlan</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <button key={item.id} onClick={() => setView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${view === item.id ? 'bg-primary-100 text-primary-700' : 'text-warm-500 hover:text-warm-800 hover:bg-warm-100'}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-warm-100 transition">
              <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center text-sm font-semibold text-primary-700">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-warm-700 hidden sm:block">{user?.name || 'User'}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-warm-200 py-2 animate-fade-in z-50">
                <div className="px-4 py-2 border-b border-warm-200">
                  <p className="text-sm font-medium text-warm-800">{user?.name}</p>
                  <p className="text-xs text-warm-500">{user?.email}</p>
                </div>
                <div className="md:hidden border-b border-warm-200">
                  {NAV.map(item => (
                    <button key={item.id} onClick={() => { setView(item.id); setMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition ${view === item.id ? 'bg-primary-50 text-primary-700' : 'text-warm-600 hover:bg-warm-50'}`}>
                      <span>{item.icon}</span>{item.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
