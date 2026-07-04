import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './features/landing/LandingPage';
import { Dashboard } from './features/dashboard/Dashboard';
import { MedicineManager } from './features/medicines/MedicineManager';
import { WellnessTrackers } from './features/trackers/WellnessTrackers';
import { AIHealthCoach } from './features/ai/AIHealthCoach';
import { Settings } from './features/settings/Settings';
import APIClient from './lib/api';
import { User } from './types';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // Toast notifications states
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; message: string }>>([]);

  useEffect(() => {
    // Sync theme
    const savedTheme = localStorage.getItem('caresync_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Auto restore session if available
    const savedToken = localStorage.getItem('caresync_token');
    if (savedToken) {
      APIClient.getCurrentUser()
        .then(res => {
          setUser(res.user);
          setIsAuthenticated(true);
          setShowLanding(false);
        })
        .catch(() => {
          // Clear stale session
          localStorage.removeItem('caresync_token');
        });
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('caresync_theme', nextTheme);
  };

  const triggerToast = (title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleEnterApp = async () => {
    try {
      const res = await APIClient.getCurrentUser();
      setUser(res.user);
      setIsAuthenticated(true);
      setShowLanding(false);
      triggerToast('Welcome to CareSync!', 'Logged into your health dashboard successfully.');
    } catch (e) {
      // Fallback
      setIsAuthenticated(true);
      setShowLanding(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('caresync_token');
    setUser(null);
    setIsAuthenticated(false);
    setShowLanding(true);
    triggerToast('Signed Out', 'You have been successfully signed out.');
  };

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onAddMedicineClick={() => setCurrentTab('medicines')} 
            onGoToTrackers={() => setCurrentTab('trackers')}
            triggerNotification={triggerToast}
          />
        );
      case 'medicines':
        return <MedicineManager triggerNotification={triggerToast} />;
      case 'trackers':
        return <WellnessTrackers triggerNotification={triggerToast} />;
      case 'ai':
        return <AIHealthCoach />;
      case 'settings':
        return (
          <Settings 
            user={user} 
            onUserUpdate={setUser} 
            triggerNotification={triggerToast} 
          />
        );
      default:
        return <Dashboard onAddMedicineClick={() => setCurrentTab('medicines')} onGoToTrackers={() => setCurrentTab('trackers')} triggerNotification={triggerToast} />;
    }
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        
        {showLanding ? (
          <LandingPage onEnterApp={handleEnterApp} />
        ) : (
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            {/* Main Shell */}
            <div className="flex flex-1 flex-col overflow-hidden">
              <Navbar
                onMenuClick={() => setSidebarOpen(true)}
                user={user}
                onLogout={handleLogout}
                theme={theme}
                toggleTheme={toggleTheme}
              />

              <main className="flex-1 overflow-y-auto">
                {renderActiveTab()}
              </main>
            </div>
          </div>
        )}

        {/* Floating Toast Notification Containers */}
        <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm w-full">
          {toasts.map((toast) => (
            <div 
              key={toast.id}
              className="p-4 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-800 flex flex-col gap-1 transition-all animate-bounce"
            >
              <span className="text-xs font-black text-emerald-400">{toast.title}</span>
              <span className="text-[11px] text-slate-300 leading-relaxed">{toast.message}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
