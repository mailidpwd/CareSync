import React, { useState, useEffect } from 'react';
import { 
  Plus, Pill, Trash2, Edit3, HelpCircle, 
  Sparkles, ShieldCheck, Calendar, Check, AlertTriangle, X 
} from 'lucide-react';
import APIClient from '../../lib/api';
import { Medicine } from '../../types';

interface MedicineManagerProps {
  triggerNotification: (title: string, msg: string) => void;
}

export const MedicineManager: React.FC<MedicineManagerProps> = ({ triggerNotification }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [morning, setMorning] = useState(true);
  const [afternoon, setAfternoon] = useState(false);
  const [night, setNight] = useState(false);
  const [beforeFood, setBeforeFood] = useState(false);
  const [afterFood, setAfterFood] = useState(true);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const end = new Date();
    end.setDate(end.getDate() + 30);
    return end.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [reminderStatus, setReminderStatus] = useState(true);

  // AI states
  const [aiExplainingId, setAiExplainingId] = useState<string | null>(null);
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await APIClient.getMedicines();
      setMedicines(res.medicines || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDosage('');
    setFrequency('daily');
    setMorning(true);
    setAfternoon(false);
    setNight(false);
    setBeforeFood(false);
    setAfterFood(true);
    setStartDate(new Date().toISOString().split('T')[0]);
    const end = new Date();
    end.setDate(end.getDate() + 30);
    setEndDate(end.toISOString().split('T')[0]);
    setNotes('');
    setReminderStatus(true);
    setEditingMedId(null);
  };

  const handleOpenEdit = (med: Medicine) => {
    setEditingMedId(med.id);
    setName(med.name);
    setDosage(med.dosage);
    setFrequency(med.frequency);
    setMorning(med.morning);
    setAfternoon(med.afternoon);
    setNight(med.night);
    setBeforeFood(med.beforeFood);
    setAfterFood(med.afterFood);
    setStartDate(med.startDate);
    setEndDate(med.endDate);
    setNotes(med.notes);
    setReminderStatus(med.reminderStatus);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) {
      triggerNotification('Validation Failed', 'Medication name and dosage are required.');
      return;
    }

    const payload = {
      name, dosage, frequency, morning, afternoon, night,
      beforeFood, afterFood, startDate, endDate, notes, reminderStatus
    };

    try {
      if (editingMedId) {
        await APIClient.updateMedicine(editingMedId, payload);
        triggerNotification('Medication Updated', `${name} details updated.`);
      } else {
        await APIClient.createMedicine(payload);
        triggerNotification('Medication Added', `${name} successfully logged in CareSync.`);
      }
      fetchMedicines();
      setShowAddForm(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm(`Are you sure you want to delete ${label}? This clears pending reminders.`)) return;
    try {
      await APIClient.deleteMedicine(id);
      setMedicines(prev => prev.filter(m => m.id !== id));
      triggerNotification('Medication Deleted', `${label} removed.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAIExplain = async (med: Medicine) => {
    setAiExplainingId(med.id);
    try {
      const res = await APIClient.explainMedicine(med.name, med.dosage, med.notes);
      setAiExplanations(prev => ({
        ...prev,
        [med.id]: res.explanation
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setAiExplainingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full" id="medicine-manager">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Medication Routines</h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            Configure, track, and get AI insights about your daily medication schedules.
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-5 py-3 text-xs font-bold shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            id="add-med-form-btn"
          >
            <Plus className="h-4 w-4" /> Add Medication
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {showAddForm && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-md max-w-3xl mx-auto relative">
          <button 
            onClick={() => {
              setShowAddForm(false);
              resetForm();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-md font-extrabold text-slate-900 dark:text-white mb-6">
            {editingMedId ? 'Edit Medication Protocol' : 'New Medication Protocol'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6" id="medicine-protocol-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-bold" htmlFor="med-name-input">Medication Name</label>
                <input
                  id="med-name-input"
                  type="text"
                  placeholder="e.g. Lisinopril"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-emerald-500 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-bold" htmlFor="med-dosage-input">Dosage / Strength</label>
                <input
                  id="med-dosage-input"
                  type="text"
                  placeholder="e.g. 10mg, 1 Capsule"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-emerald-500 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                  required
                />
              </div>

            </div>

            {/* Timings */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 font-bold">Intake Schedule (Times of Day)</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Morning', val: morning, set: setMorning },
                  { label: 'Afternoon', val: afternoon, set: setAfternoon },
                  { label: 'Night', val: night, set: setNight }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => item.set(!item.val)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      item.val 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.val && <Check className="h-4 w-4 text-emerald-500" />}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Food correlation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-bold">Food Association</span>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setBeforeFood(true); setAfterFood(false); }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      beforeFood ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'
                    }`}
                  >
                    Before Food
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBeforeFood(false); setAfterFood(true); }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      afterFood ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'
                    }`}
                  >
                    After Food
                  </button>
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-bold" htmlFor="start-date-input">Duration Dates</label>
                <div className="flex gap-2">
                  <input
                    id="start-date-input"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs border border-transparent text-slate-700 dark:text-slate-200"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs border border-transparent text-slate-700 dark:text-slate-200"
                    aria-label="End Date"
                  />
                </div>
              </div>
            </div>

            {/* Additional directions */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-bold" htmlFor="med-notes-input">Instructions / Notes</label>
              <textarea
                id="med-notes-input"
                placeholder="Take with a full glass of water. Avoid driving after night dose."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-emerald-500 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none min-h-20"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="reminderStatus"
                  checked={reminderStatus}
                  onChange={(e) => setReminderStatus(e.target.checked)}
                  className="rounded text-emerald-500 accent-emerald-500 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="reminderStatus" className="text-xs text-slate-500 select-none cursor-pointer">
                  Enable dynamic adherence reminders
                </label>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); resetForm(); }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-xs font-bold cursor-pointer"
                >
                  {editingMedId ? 'Save Changes' : 'Publish Protocol'}
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* Medications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {medicines.length === 0 ? (
          <div className="col-span-full py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center">
            <Pill className="h-12 w-12 text-slate-300 animate-bounce" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-3">Your medicine cabinet is empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              Track active medicines, setup streaks, and check adherence by clicking "Add Medication" above.
            </p>
          </div>
        ) : (
          medicines.map((med) => (
            <div 
              key={med.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 shadow-sm space-y-4 relative group hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500">
                    <Pill className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-white leading-tight">
                      {med.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Dosage: <span className="font-bold text-slate-600 dark:text-slate-300">{med.dosage}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-1.5 opacity-90 sm:opacity-10 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(med)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    title="Edit Medicine"
                    aria-label={`Edit ${med.name}`}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(med.id, med.name)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                    title="Delete Medicine"
                    aria-label={`Delete ${med.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Timing Slots Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {med.morning && <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Morning</span>}
                {med.afternoon && <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Afternoon</span>}
                {med.night && <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Night</span>}
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                  {med.beforeFood ? 'Before Food' : 'After Food'}
                </span>
              </div>

              {/* Adherence Streaks indices */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-850 pt-3 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-500">Adherence streak:</span>
                  <span className="font-bold text-emerald-600">{med.adherenceStreak} days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                  <span className="text-slate-500">Missed doses:</span>
                  <span className="font-bold text-rose-600">{med.missedDoseCounter}</span>
                </div>
              </div>

              {med.notes && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850/50 leading-relaxed italic">
                  Note: {med.notes}
                </p>
              )}

              {/* AI Explain Medicine Button / Container */}
              <div className="border-t border-slate-100 dark:border-slate-850 pt-3.5">
                {aiExplanations[med.id] ? (
                  <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" /> CareSync AI Explanation
                    </div>
                    <p className="text-[11px] leading-relaxed italic text-slate-700 dark:text-slate-200">{aiExplanations[med.id]}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAIExplain(med)}
                    disabled={aiExplainingId === med.id}
                    className="w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                    {aiExplainingId === med.id ? 'Analyzing with Gemini...' : 'Analyze Medicine with Gemini AI'}
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
export default MedicineManager;
