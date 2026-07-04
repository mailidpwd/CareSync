import React from 'react';
import { 
  Activity, 
  Pill, 
  Heart, 
  Sparkles, 
  Settings as SettingsIcon, 
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medicines', label: 'Medications', icon: Pill },
    { id: 'trackers', label: 'Wellness Log', icon: Activity },
    { id: 'ai', label: 'AI Health Coach', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Sidebar Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-5 py-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="app-sidebar"
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 shadow-md shadow-emerald-500/20">
            <Heart className="h-5.5 w-5.5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              CareSync
            </span>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">UN SDG 3 Champion</p>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-50/80 to-blue-50/50 dark:from-emerald-950/20 dark:to-blue-950/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100/30 dark:border-emerald-800/20 shadow-sm shadow-emerald-500/5'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'
                }`}
                id={`sidebar-link-${item.id}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* UN SDG 3 Footer Badge */}
        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-blue-50/40 dark:from-slate-900/60 dark:to-slate-900/30 border border-emerald-100/20 dark:border-slate-800/30">
          <div className="flex gap-2">
            <ShieldAlert className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">UN SDG Goal 3</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Ensure healthy lives and promote well-being for all at all ages.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
