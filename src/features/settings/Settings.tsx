import React, { useState, useEffect } from 'react';
import { 
  User, Settings as SettingsIcon, Shield, Bell, 
  Download, Trash2, Heart, CheckCircle 
} from 'lucide-react';
import APIClient from '../../lib/api';

interface SettingsProps {
  user: any;
  onUserUpdate: (updatedUser: any) => void;
  triggerNotification: (title: string, msg: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUserUpdate, triggerNotification }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Daily goals states
  const [waterGoal, setWaterGoal] = useState('2000');
  const [sleepGoal, setSleepGoal] = useState('8');
  const [exerciseGoal, setExerciseGoal] = useState('30');

  // Preferences
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [emailReminders, setEmailReminders] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingGoals, setSavingGoals] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setWaterGoal(String(user.settings?.dailyWaterGoal || '2000'));
      setSleepGoal(String(user.settings?.dailySleepGoal || '8'));
      setExerciseGoal(String(user.settings?.dailyExerciseGoal || '30'));
      setBrowserNotifications(!!user.settings?.reminderPreferences?.browserNotifications);
      setEmailReminders(!!user.settings?.reminderPreferences?.emailReminders);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSavingProfile(true);
    try {
      const res = await APIClient.updateProfile({ name, email });
      onUserUpdate(res.user);
      triggerNotification('Profile Updated', 'Your profile info has been saved.');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdateGoals = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGoals(true);
    try {
      const res = await APIClient.updateSettings({
        dailyWaterGoal: Number(waterGoal),
        dailySleepGoal: Number(sleepGoal),
        dailyExerciseGoal: Number(exerciseGoal),
        reminderPreferences: {
          browserNotifications,
          emailReminders
        }
      });
      onUserUpdate(res.user);
      triggerNotification('Targets Synced', 'Your daily wellness compliance targets are saved.');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingGoals(false);
    }
  };

  const handleExportCSV = () => {
    // Generate simple mock CSV export
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Goal,Current adherence\n"
      + `Water goal,${waterGoal}ml,Log entries active\n`
      + `Sleep goal,${sleepGoal} hours,Log entries active\n`
      + `Workout goal,${exerciseGoal} mins,Log entries active\n`
      + `Profile,${name},${email}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "CareSync_Adherence_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification('Data Exported', 'CSV health report generated and downloaded.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your CareSync account? This action is irreversible and clears all medical protocols.")) {
      triggerNotification('Profile Deleted', 'Simulated account deletion completed.');
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-4xl mx-auto w-full" id="settings-feature">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
          Customize your profile, daily compliance targets, notification flags, and download records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Profile Panel */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <User className="h-4 w-4 text-emerald-500" /> Personal Identity
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4" id="profile-settings-form">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold" htmlFor="name-input">Full Name</label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-emerald-500 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold" htmlFor="email-input">Email Address</label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-emerald-500 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
            >
              {savingProfile ? 'Saving Info...' : 'Update Personal Identity'}
            </button>
          </form>
        </div>

        {/* Daily Goals Panel */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <SettingsIcon className="h-4 w-4 text-emerald-500" /> Daily Compliance Targets
          </h2>

          <form onSubmit={handleUpdateGoals} className="space-y-4" id="goals-settings-form">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold" htmlFor="water-goal-input">Water Goal (ml)</label>
                <input
                  id="water-goal-input"
                  type="number"
                  value={waterGoal}
                  onChange={(e) => setWaterGoal(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs border border-transparent focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold" htmlFor="sleep-goal-input">Sleep Goal (h)</label>
                <input
                  id="sleep-goal-input"
                  type="number"
                  value={sleepGoal}
                  onChange={(e) => setSleepGoal(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs border border-transparent focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold" htmlFor="exercise-goal-input">Exercise (min)</label>
                <input
                  id="exercise-goal-input"
                  type="number"
                  value={exerciseGoal}
                  onChange={(e) => setExerciseGoal(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs border border-transparent focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-[10px] text-slate-400 font-bold">Preferences</span>
              
              <div className="flex items-center justify-between">
                <label htmlFor="browserNotifications" className="text-xs text-slate-600 dark:text-slate-300 select-none cursor-pointer">
                  Browser push alerts
                </label>
                <input
                  type="checkbox"
                  id="browserNotifications"
                  checked={browserNotifications}
                  onChange={(e) => setBrowserNotifications(e.target.checked)}
                  className="rounded text-emerald-500 accent-emerald-500 h-4 w-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="emailReminders" className="text-xs text-slate-600 dark:text-slate-300 select-none cursor-pointer">
                  Periodic progress report emails
                </label>
                <input
                  type="checkbox"
                  id="emailReminders"
                  checked={emailReminders}
                  onChange={(e) => setEmailReminders(e.target.checked)}
                  className="rounded text-emerald-500 accent-emerald-500 h-4 w-4 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingGoals}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold text-xs hover:from-emerald-600 transition-all cursor-pointer"
            >
              {savingGoals ? 'Syncing Targets...' : 'Sync Targets'}
            </button>
          </form>
        </div>

      </div>

      {/* Backup and Deletion Panel */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100">Data Portability & Port</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportCSV}
            className="flex-1 py-3.5 rounded-2xl bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
            id="export-csv-btn"
          >
            <Download className="h-4 w-4" /> Download All Adherence Records (.CSV)
          </button>
          
          <button
            onClick={handleDeleteAccount}
            className="flex-1 py-3.5 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 text-rose-500 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
            id="delete-account-btn"
          >
            <Trash2 className="h-4 w-4" /> Reset / Clear Profile Data
          </button>
        </div>
      </div>

    </div>
  );
};
export default Settings;
