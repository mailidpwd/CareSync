import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, LogOut, Sun, Moon, Heart } from 'lucide-react';
import APIClient from '../../lib/api';
import { Notification } from '../../types';

interface NavbarProps {
  onMenuClick: () => void;
  user: any;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, user, onLogout, theme, toggleTheme }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      APIClient.getNotifications()
        .then(res => setNotifications(res.notifications || []))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleMarkAsRead = async () => {
    try {
      await APIClient.markNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-6 backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
          aria-label="Toggle navigation drawer"
          id="mobile-nav-toggle"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 w-64 border border-slate-200/50 dark:border-slate-700/50 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 transition-all duration-200">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search medications or tips..."
            className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
            id="search-input"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-all duration-200"
          id="theme-toggler"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications && unreadCount > 0) {
                handleMarkAsRead();
              }
            }}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-all"
            id="notification-bell-btn"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-xl ring-1 ring-black/5 focus:outline-none transition-all duration-300 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Recent Updates</span>
                {unreadCount > 0 && (
                  <span className="text-xs text-emerald-500 font-medium">Marked all read</span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2.5">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-xl border transition-all ${
                        n.isRead 
                          ? 'bg-slate-50/50 dark:bg-slate-900/30 border-transparent' 
                          : 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/30'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Heart className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{n.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name || 'CareSync User'}</p>
            <p className="text-[10px] text-slate-400 font-medium">{user?.email || 'michaelkillgta@gmail.com'}</p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-xl p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus:outline-none transition-all duration-200"
            id="logout-btn"
            aria-label="Logout"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
