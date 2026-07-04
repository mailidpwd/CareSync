import React, { useState, useEffect } from 'react';
import { 
  Plus, Check, Award, Activity, 
  Droplet, Moon, Heart, Flame,
  Calendar, CheckCircle2, AlertCircle, TrendingUp, Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import APIClient from '../../lib/api';
import { Reminder, HealthScore } from '../../types';

interface DashboardProps {
  onAddMedicineClick: () => void;
  onGoToTrackers: () => void;
  triggerNotification: (title: string, msg: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onAddMedicineClick, 
  onGoToTrackers, 
  triggerNotification 
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [waterTotal, setWaterTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [stress, setStress] = useState(3);
  const [energy, setEnergy] = useState(8);
  const [moodLogSuccess, setMoodLogSuccess] = useState(false);

  const [quickSteps, setQuickSteps] = useState('3000');
  const [quickWorkoutMin, setQuickWorkoutMin] = useState('15');

  const QUOTES = [
    "Health is a state of complete physical, mental, and social well-being. - WHO",
    "A healthy outside starts from the inside. - Robert Urich",
    "Your health is an investment, not an expense. - Unknown",
    "Habit is stronger than willpower. Keep your streaks up!"
  ];
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      
      const [remRes, scoreRes, waterRes] = await Promise.all([
        APIClient.getReminders(todayStr),
        APIClient.getHealthScore(),
        APIClient.getWater(todayStr)
      ]);

      setReminders(remRes.reminders || []);
      setHealthScore(scoreRes.healthScore || null);
      
      const totalWater = (waterRes.waterEntries || []).reduce((sum: number, w: any) => sum + w.amountMl, 0);
      setWaterTotal(totalWater);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleReminder = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'taken' ? 'pending' : 'taken';
    try {
      await APIClient.updateReminderStatus(id, nextStatus);
      
      // Update local state
      setReminders(prev => prev.map(r => r.id === id ? { ...r, status: nextStatus, takenAt: nextStatus === 'taken' ? new Date().toISOString() : undefined } : r));
      
      if (nextStatus === 'taken') {
        triggerNotification('Medication Taken!', 'Awesome work keeping up with your medication plan.');
      }
      
      // Refresh score
      const scoreRes = await APIClient.getHealthScore();
      setHealthScore(scoreRes.healthScore || null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddWater = async (amount: number) => {
    try {
      await APIClient.addWater(amount);
      setWaterTotal(prev => prev + amount);
      triggerNotification('Hydration Added', `Logged +${amount}ml of water successfully.`);
      
      // Refresh score
      const scoreRes = await APIClient.getHealthScore();
      setHealthScore(scoreRes.healthScore || null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogMood = async () => {
    if (!selectedMood) return;
    try {
      await APIClient.addMood({
        emoji: selectedMood,
        stressLevel: stress,
        energyLevel: energy,
        journal: 'Logged from CareSync dashboard quick actions.'
      });
      setMoodLogSuccess(true);
      triggerNotification('Mood Synced', 'Your emotional state and stress indices are logged.');
      setTimeout(() => setMoodLogSuccess(false), 3000);

      const scoreRes = await APIClient.getHealthScore();
      setHealthScore(scoreRes.healthScore || null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddQuickWorkout = async () => {
    try {
      const min = Number(quickWorkoutMin) || 15;
      const steps = Number(quickSteps) || 2000;
      await APIClient.addWorkout({
        name: 'Quick Workout log',
        durationMinutes: min,
        caloriesBurned: min * 8, // simple rule of thumb
        steps: steps
      });
      triggerNotification('Workout Added', `Logged ${min} mins workout & ${steps} steps.`);
      
      // Refresh score
      const scoreRes = await APIClient.getHealthScore();
      setHealthScore(scoreRes.healthScore || null);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6 animate-pulse" id="dashboard-loading-skeleton">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl col-span-2" />
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full" />
      </div>
    );
  }

  const upcomingRem = reminders.find(r => r.status === 'pending');

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full" id="caresync-dashboard">
      
      {/* Title / Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, Friend!
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            {quote}
          </p>
        </div>
        <button
          onClick={onAddMedicineClick}
          className="rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-5 py-3 text-xs font-bold shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          id="dashboard-add-med-btn"
        >
          <Plus className="h-4 w-4" /> Add Medication
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Adherence Score Card */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-sm relative overflow-hidden transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weekly SDG 3 Adherence Score</h3>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Calculated Live
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-slate-50/50 dark:bg-slate-950/40">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 128 128">
                <defs>
                  <linearGradient id="scoreProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  className="stroke-slate-100 dark:stroke-slate-800/60 fill-none"
                  strokeWidth="10"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="url(#scoreProgressGradient)"
                  className="fill-none transition-all duration-1000"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - (healthScore?.score || 75) / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-center z-10">
                <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  {healthScore?.score || 75}%
                </span>
                <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-extrabold uppercase tracking-wider mt-0.5">
                  {(() => {
                    const s = healthScore?.score || 75;
                    if (s >= 85) return 'Excellent';
                    if (s >= 70) return 'Optimal';
                    if (s >= 50) return 'Good';
                    return 'Fair';
                  })()}
                </p>
              </div>
            </div>

            <div className="flex-1 w-full space-y-3.5">
              {healthScore && Object.entries(healthScore.breakdown).map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, ' $1');
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 capitalize">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trend Chart using Recharts */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Adherence Progress Trend (7-Day)
            </h4>
            <div className="h-36 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={healthScore?.weeklyTrend || []}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderColor: '#10b981',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: '#ffffff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorAdherence)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Next Scheduled Pill / Info */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600/90 to-blue-700/90 text-white p-6 shadow-lg shadow-emerald-500/5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/80">Active Reminder Status</span>
            <h3 className="text-lg font-extrabold mt-2 text-white">Upcoming Target</h3>
            
            {upcomingRem ? (
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{upcomingRem.medicineName}</h4>
                    <p className="text-xs text-emerald-100/80 mt-0.5">{upcomingRem.dosage} • {upcomingRem.timeSlot}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleReminder(upcomingRem.id, upcomingRem.status)}
                    className="w-full py-2.5 rounded-xl bg-white text-emerald-700 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Mark as Taken
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-200" />
                <p className="text-xs font-bold text-emerald-50 mt-3">All clear for today!</p>
                <p className="text-[10px] text-emerald-100/70 mt-1">Check back later or configure more medications.</p>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 flex items-center gap-2 text-[10px] text-emerald-100/80">
            <Info className="h-4 w-4 text-emerald-200 shrink-0" />
            <span>Adhering strictly to schedules limits clinical issues significantly.</span>
          </div>
        </div>

      </div>

      {/* Main Row: Meds and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Medicine Checklist */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Today's Medication Intake</h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              {reminders.filter(r => r.status === 'taken').length}/{reminders.length} Taken
            </span>
          </div>

          {reminders.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-10 w-10 text-slate-300" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">No medications scheduled for today</p>
              <button
                onClick={onAddMedicineClick}
                className="mt-3 text-xs text-emerald-500 font-bold hover:underline"
              >
                Add your first medication
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {reminders.map((r) => {
                const isTaken = r.status === 'taken';
                return (
                  <div 
                    key={r.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isTaken 
                        ? 'bg-slate-50/50 dark:bg-slate-950/20 border-transparent text-slate-400 dark:text-slate-500' 
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-emerald-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleReminder(r.id, r.status)}
                        className={`h-6 w-6 rounded-lg flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                          isTaken 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500'
                        }`}
                        aria-label={`Toggle medication intake status for ${r.medicineName}`}
                      >
                        {isTaken && <Check className="h-4 w-4" />}
                      </button>
                      <div>
                        <p className={`text-xs font-bold ${isTaken ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-100'}`}>
                          {r.medicineName}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {r.dosage} • <span className="capitalize">{r.timeSlot}</span>
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                      isTaken 
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                    }`}>
                      {isTaken ? 'Taken' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Sync Tracker Panel */}
        <div className="space-y-6">

          {/* Hydration Tracker */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500 animate-bounce" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hydration Tracker</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">{waterTotal}ml logged</span>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => handleAddWater(250)}
                className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all cursor-pointer"
              >
                +250ml Cup
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all cursor-pointer"
              >
                +500ml Bottle
              </button>
            </div>
          </div>

          {/* Mental Mood Logging */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Mood Tracker</h3>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              {['😢', '😐', '🙂', '😄', '🤩'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedMood(emoji)}
                  className={`text-2xl p-2 rounded-xl transition-all hover:scale-125 focus:outline-none cursor-pointer ${
                    selectedMood === emoji ? 'bg-emerald-50 dark:bg-emerald-950 border border-emerald-200/50' : 'bg-transparent'
                  }`}
                  aria-label={`Log mood ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {selectedMood && (
              <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Stress level ({stress}/10)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stress}
                    onChange={(e) => setStress(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Energy level ({energy}/10)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energy}
                    onChange={(e) => setEnergy(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleLogMood}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs hover:from-emerald-600 hover:to-emerald-700 transition-all cursor-pointer"
                >
                  {moodLogSuccess ? 'Logged Successfully!' : 'Log Mood State'}
                </button>
              </div>
            )}
          </div>

          {/* Quick Exercise Logging */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-rose-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quick Workout sync</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold" htmlFor="steps-input">Steps Taken</label>
                <input
                  id="steps-input"
                  type="number"
                  value={quickSteps}
                  onChange={(e) => setQuickSteps(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs border border-transparent focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold" htmlFor="duration-input">Duration (min)</label>
                <input
                  id="duration-input"
                  type="number"
                  value={quickWorkoutMin}
                  onChange={(e) => setQuickWorkoutMin(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs border border-transparent focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <button
              onClick={handleAddQuickWorkout}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
            >
              Add Workout Entry
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Dashboard;
