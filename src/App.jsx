import { AuthProvider, useAuth } from './context/AuthContext';
import { NutritionProvider, useNutrition } from './context/NutritionContext';
import Header from './components/Header';
import AuthPage from './components/AuthPage';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import MealPlanView from './components/MealPlanView';
import GroceryListView from './components/GroceryListView';
import DailyTracker from './components/DailyTracker';
import WorkoutPlan from './components/WorkoutPlan';
import ProfileSettings from './components/ProfileSettings';

const MOBILE_NAV = [
  { id: 'dashboard', label: 'Dash', icon: '📊' },
  { id: 'mealplan', label: 'Meals', icon: '📋' },
  { id: 'workout', label: 'Gym', icon: '💪' },
  { id: 'grocery', label: 'Shop', icon: '🛒' },
  { id: 'tracker', label: 'Log', icon: '✅' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { isProfileComplete, view, setView } = useNutrition();

  if (!isAuthenticated) return <AuthPage />;
  if (!isProfileComplete) return <Onboarding />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-warm-50 to-primary-50">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="flex items-center justify-center gap-1.5 mb-6 md:hidden">
          {MOBILE_NAV.map(item => (
            <button key={item.id} onClick={() => setView(item.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${view === item.id ? 'bg-primary-100 text-primary-700 shadow-sm' : 'text-warm-500 bg-white border border-warm-200'}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="animate-fade-in">
          {view === 'dashboard' && <Dashboard />}
          {view === 'mealplan' && <MealPlanView />}
          {view === 'workout' && <WorkoutPlan />}
          {view === 'grocery' && <GroceryListView />}
          {view === 'tracker' && <DailyTracker />}
          {view === 'profile' && <ProfileSettings />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NutritionProvider>
        <AppContent />
      </NutritionProvider>
    </AuthProvider>
  );
}
