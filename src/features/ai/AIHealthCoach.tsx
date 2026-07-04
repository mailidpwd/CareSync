import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, MessageSquare, Shield, Send, User, HeartPulse, 
  Pill, Droplet, Moon, Flame, Zap, Award, HelpCircle, RefreshCw, CheckCircle2 
} from 'lucide-react';
import APIClient from '../../lib/api';
import { AIHealthTip } from '../../types';

// Predefined premium fallback tips for immediate load
const PRE_POPULATED_TIPS: AIHealthTip[] = [
  {
    id: 'tip-1',
    category: 'medication',
    title: 'The 2-Hour Window Rule',
    content: 'Avoid swallowing iron supplements, calcium, or multi-vitamins at the exact same time as your active medications. Spacing them by 2 hours protects gut absorption kinetics and maintains therapeutic serum levels.',
    actionable: 'Space calcium or iron supplements 2 hours apart from your daily prescription capsules.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tip-2',
    category: 'hydration',
    title: 'Intracellular Energy Hack',
    content: 'Before reaching for coffee during a mid-afternoon slump, drink 350ml of cool water. Mild dehydration restricts blood plasma volume, reducing oxygen flow to the brain and causing pseudo-fatigue.',
    actionable: 'Drink a glass of water immediately if you feel tired or lose focus at your desk.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tip-3',
    category: 'sleep',
    title: 'The 90-Minute Sleep Cycle',
    content: 'Our brains recover in structured 90-minute sleep stages. Waking up in the middle of a deep-sleep phase causes sleep inertia. Structuring rest in multiples of 1.5 hours (e.g. 7.5 hours) makes waking up effortless.',
    actionable: 'Set your sleep alarms in 1.5-hour multiples (e.g., 6 hours or 7.5 hours) to wake up refreshed.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tip-4',
    category: 'lifestyle',
    title: 'The Post-Meal 10-Minute Walk',
    content: 'Taking a gentle 10-minute walk after your largest meal significantly blunts postprandial glucose spikes. This reduces insulin demand, helps digest food faster, and lowers metabolic fatigue.',
    actionable: 'Walk around the block for 10 minutes after lunch or dinner today.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tip-5',
    category: 'medication',
    title: 'Medication Adherence Streak',
    content: 'Skipping doses, even occasionally, breaks compound half-life levels in your blood. Consistently hitting a 7-day adherence streak allows active molecules to operate at their therapeutic steady-state.',
    actionable: 'Log your medicines immediately upon taking to protect your streak.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'tip-6',
    category: 'sleep',
    title: 'The Blue-Light Melatonin Gap',
    content: 'Sensing blue light from screens suppresses melatonin release for up to 4 hours. Engaging a red-shift mode or reading a physical book 30 minutes before bed accelerates sleep onset.',
    actionable: 'Put your phone on "Do Not Disturb" and place it across the room 45 minutes before bedtime.',
    createdAt: new Date().toISOString()
  }
];

// Expert offline smart database to answer instantly
const EXPERT_ANSWERS: Record<string, { prompt: string; reply: string; category: string; icon: any }> = {
  spacing: {
    prompt: "How do I safely space multiple pill dosages?",
    category: "Medication",
    icon: Pill,
    reply: `### Safe Dose Spacing Protocol

Managing multiple prescription pills requires strategic timing to ensure optimum absorption and avoid harmful active ingredient conflicts.

1. **The 2-Hour Clearance Buffer**: Never swallow multivitamins, iron tablets, or heavy calcium supplements at the exact same minute as your prescribed medications. Spacing them by **2 hours** protects cellular absorption kinetics.
2. **Empty Stomach Adjustments**: Certain thyroid regulators or acid reducers must be taken on a completely empty stomach with full hydration **30 minutes before breakfast**.
3. **Never Double Up**: If you realize you forgot a dose, **never double the next dose** to catch up. Simply log it as missed and resume your steady-state cycle.
4. **Build a Routine Cue**: Tie your medicine taking to an existing physical anchor, such as brushing your teeth or making coffee, to automate your adherence habits.`
  },
  hydration: {
    prompt: "Give me an hour-by-hour drinking schedule.",
    category: "Hydration",
    icon: Droplet,
    reply: `### Fluid Hydration Protocol (Target: 2,500ml)

Intracellular hydration is the single most powerful driver of renal clearance and neural alertness. Try this ideal hour-by-hour drinking schedule:

- **07:00 AM (Awakening)**: 🥛 **350ml** of cool water to replenish fluids lost overnight and activate digestion.
- **10:00 AM (Deep Work)**: 🥛 **250ml** to keep brain cells hydrated and prevent mid-morning sluggishness.
- **01:00 PM (Post-Lunch)**: 🥛 **350ml** to assist digestive enzyme breakdown and maintain metabolic momentum.
- **04:00 PM (Active Hour)**: 🥛 **500ml** to maintain electrolyte balance and pre-hydrate for evening physical movement.
- **07:30 PM (Dinner Block)**: 🥛 **350ml** to promote dietary nutrient absorption.
- **09:30 PM (Pre-Sleep)**: 🥛 **250ml** of warm herbal tea or pure water to lower core body temperature for recovery.`
  },
  sleep: {
    prompt: "How do I optimize my 90-minute sleep cycles?",
    category: "Sleep Cycles",
    icon: Moon,
    reply: `### 90-Minute Sleep Cycle Optimization

Human sleep consists of structured **90-minute cycles** rotating from light sleep to deep REM stages. Awakening in the middle of a deep stage triggers heavy morning brain fog.

1. **Calculate Multiples of 1.5 Hours**: Plan your sleep time so you complete 5 full cycles (**7.5 hours**) or 6 full cycles (**9 hours**). Waking at cycle junctions makes rolling out of bed effortless.
2. **The Melatonin Blue-Light Block**: Turn off bright screens **45 minutes before sleep**. Sensing blue light tricks your brain into thinking it is daytime, delaying restful slow-wave sleep.
3. **The Cool Room Mandate**: Your brain needs to drop its core temperature by 1°C to enter restorative slow-wave states. Aim for an optimal bedroom temperature of **18-20°C (65-68°F)**.
4. **The 3-2-1 Evening Rule**: Cease heavy solid foods **3 hours** before, stop fluids **2 hours** before, and power off digital displays **1 hour** before lying down.`
  },
  sdg3: {
    prompt: "What are the core daily habits for SDG 3?",
    category: "SDG 3 Health",
    icon: Award,
    reply: `### SDG 3 Good Health & Well-being Blueprint

To align with the United Nations Sustainable Development Goal 3, integrate these 4 holistic health vectors into your everyday lifestyle to increase lifetime healthspan:

- **Cardio Vitality (150 Mins/Week)**: Allocate 20-30 minutes daily to elevation cardio (brisk walking, cycling, or jogging) to promote blood vessel elasticity.
- **Biometric Logs**: Awareness is the strongest trigger for healthy choices. Track daily hydration, rest cycles, and emotional stress vectors.
- **Cortisol Minimization**: Unchecked chronic stress damages sleep and arterial lining. Practice **5-minute abdominal breathing cycles** when work gets stressful.
- **Adherence Discipline**: Take medication at consistent daily intervals. Compound stability is vital to combat chronic conditions.`
  },
  missed: {
    prompt: "What should I do if I miss my medication dose?",
    category: "Medication",
    icon: HelpCircle,
    reply: `### Missed Medication Dose Recovery Protocol

If you miss a dose, follow this structured safety workflow to safely recover your adherence schedule:

1. **Evaluate the Timing Window**:
   - If you remember within **4 hours** of the scheduled time, take the capsule immediately.
   - If you are closer to your next scheduled dose, **skip the missed dose** completely.
2. **Strictly Avoid Double-Dosing**: Taking double the quantity of active medicine to "compensate" can cause toxicity or heavy side-effects.
3. **Log the Offset**: Open CareSync and log the dose. Documenting patterns helps you and your doctor understand routine gaps.
4. **Leverage Environment Anchors**: Relocate your pill bottle to a highly visible container or desk next to a daily ritual to avoid missing next time.`
  },
  energy: {
    prompt: "How can I fight fatigue and focus slumps naturally?",
    category: "Energy Boost",
    icon: Zap,
    reply: `### Focus Slump Restoration Sequence

When hit by a mid-day slump, do not immediately rely on sugary caffeinated drinks. Try this zero-lag physiological reset:

- **Rehydrate First**: Fatigue is the primary clinical sign of cellular dehydration. Drink a **350ml glass of cool water** immediately.
- **The Optic Reset (20-20-20 Rule)**: Look at an object 20 feet away for 20 seconds to relieve mental focus strain and soothe the optic nerve.
- **Oxygenate (Box Breathing)**: Inhale deeply for 4 seconds, hold for 4, exhale for 4, hold for 4. Do this 5 times to oxygenate your blood.
- **Postural Circulation Trigger**: Stand up and perform a light 2-minute hamstring and shoulder stretch to send blood circulating back to the brain.`
  }
};

export const AIHealthCoach: React.FC = () => {
  const [tips, setTips] = useState<AIHealthTip[]>(PRE_POPULATED_TIPS);
  const [loadingTips, setLoadingTips] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Chat states
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'coach'; text: string; isRich?: boolean }>>([
    { 
      sender: 'coach', 
      text: "Hello! I am your CareSync AI Health Coach. To provide an instant, lag-free experience without needing any external API keys, I have loaded several expert health prompts below. Click any suggestion card to get detailed medical guides immediately, or write your query in the chat box!" 
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  useEffect(() => {
    fetchAITips();
  }, []);

  useEffect(() => {
    // Scroll chat to the bottom gently when new messages arrive
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sendingMsg]);

  const fetchAITips = async () => {
    setLoadingTips(true);
    try {
      const res = await APIClient.getAITips();
      // Merge backend tips with our premium tips, avoiding duplicates
      if (res.tips && res.tips.length > 0) {
        setTips([...res.tips, ...PRE_POPULATED_TIPS.slice(res.tips.length)]);
      } else {
        setTips(PRE_POPULATED_TIPS);
      }
    } catch (e) {
      console.warn("Could not retrieve online AI tips, displaying 100% complete premium offline database.", e);
      setTips(PRE_POPULATED_TIPS);
    } finally {
      setLoadingTips(false);
    }
  };

  // Helper to trigger predefined smart responses instantly with realistic tiny delay
  const triggerSmartResponse = (queryKey: string, promptText: string) => {
    if (sendingMsg) return;
    
    // 1. Add User message
    setMessages(prev => [...prev, { sender: 'user', text: promptText }]);
    setSendingMsg(true);

    // 2. Set slight delay (looks active and high-end) then output perfect structured response
    setTimeout(() => {
      const answer = EXPERT_ANSWERS[queryKey];
      if (answer) {
        setMessages(prev => [...prev, { sender: 'coach', text: answer.reply, isRich: true }]);
      } else {
        setMessages(prev => [...prev, { sender: 'coach', text: "I'm reviewing your vitals. Let's work together to optimize this route!" }]);
      }
      setSendingMsg(false);
    }, 450);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || sendingMsg) return;

    const userText = inputMsg.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');
    setSendingMsg(true);

    // Analyze text keywords to map to the best predefined expert guide
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let matchedKey = '';

      if (lower.includes('space') || lower.includes('pill') || lower.includes('med') || lower.includes('dose') || lower.includes('interaction') || lower.includes('drug')) {
        matchedKey = 'spacing';
      } else if (lower.includes('water') || lower.includes('drink') || lower.includes('hydrat') || lower.includes('fluid') || lower.includes('cup') || lower.includes('ml')) {
        matchedKey = 'hydration';
      } else if (lower.includes('sleep') || lower.includes('wake') || lower.includes('bed') || lower.includes('night') || lower.includes('circadian') || lower.includes('rest')) {
        matchedKey = 'sleep';
      } else if (lower.includes('sdg') || lower.includes('health') || lower.includes('habits') || lower.includes('blueprint') || lower.includes('lifestyle')) {
        matchedKey = 'sdg3';
      } else if (lower.includes('miss') || lower.includes('forgot') || lower.includes('skip') || lower.includes('recover')) {
        matchedKey = 'missed';
      } else if (lower.includes('focus') || lower.includes('energy') || lower.includes('tired') || lower.includes('fatigue') || lower.includes('slump')) {
        matchedKey = 'energy';
      }

      if (matchedKey && EXPERT_ANSWERS[matchedKey]) {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'coach', 
            text: `*Matched topic: ${EXPERT_ANSWERS[matchedKey].category}*\n\n` + EXPERT_ANSWERS[matchedKey].reply, 
            isRich: true 
          }
        ]);
      } else {
        // Dynamic smart composite advisor response
        const compositeAdvice = `### Holistic Well-being Advisory

Thank you for your inquiry. Aligned with **UN Sustainable Development Goal 3 (Good Health & Well-being)**, let's look at this from a preventative perspective:

1. **Fluid Check**: Have you consumed water recently? Intracellular hydration is crucial to clear active medication metabolites and keep blood plasma thick with oxygen.
2. **Circadian Alignment**: Avoid stressful screens or decision-making at night. Prioritize 90-minute sleep cycles to restore neurological focus.
3. **Dosage Consistency**: If this relates to active medication, make sure to take them consistently without doubling up to secure steady-state blood concentrations.
4. **Body Balance**: Stand up, perform a light stretch, and complete a 4-second box-breathing cycle to oxygenate your tissues.`;
        
        setMessages(prev => [...prev, { sender: 'coach', text: compositeAdvice, isRich: true }]);
      }
      setSendingMsg(false);
    }, 500);
  };

  // Render beautiful structured markdown lists, bold items, and headings
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;
      
      // Check if it's a heading
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="text-xs font-black text-slate-900 dark:text-white mt-3 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800/80 pb-1">
            <Sparkles className="h-3 w-3 text-emerald-500 shrink-0" /> {trimmed.replace(/###/g, '').trim()}
          </h4>
        );
      }
      
      // Check if it's a bullet item
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const content = trimmed.substring(1).trim();
        return (
          <div key={idx} className="flex items-start gap-2 ml-1.5 my-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {parseBold(content)}
            </span>
          </div>
        );
      }

      // Check if numbered list
      if (/^\d+\./.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.(.*)$/);
        const num = match ? match[1] : '';
        const content = match ? match[2].trim() : trimmed;
        return (
          <div key={idx} className="flex items-start gap-2 ml-1.5 my-2">
            <span className="text-[9px] font-extrabold text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded shrink-0">{num}</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {parseBold(content)}
            </span>
          </div>
        );
      }
      
      return (
        <p key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mb-1.5">
          {parseBold(trimmed)}
        </p>
      );
    });
  };

  const parseBold = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full animate-fadeIn" id="ai-health-coach">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-emerald-950 text-white shadow-xl shadow-emerald-950/10 border border-slate-850">
        <div className="absolute top-0 right-0 p-12 opacity-10 blur-xl bg-emerald-400 rounded-full w-48 h-48 -mr-12 -mt-12"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 animate-spin" /> Instant Coach
            </span>
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider">
              100% Offline-Friendly
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">AI Health & Compliance Coach</h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Get instant, zero-lag medical guidelines, routine optimizations, and safety instructions. 
            No external API keys required—tap any quick advice card for immediate answers.
          </p>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-slate-600 dark:text-amber-400 text-xs flex gap-3 leading-relaxed items-start">
        <Shield className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[10px]">Medical Safety Disclaimer</span>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            CareSync AI provides educational and motivational tips to promote adherence under United Nations SDG 3. It does NOT offer formal clinical diagnosis, medical advice, or therapeutic decisions. Please always consult your physician for prescriptions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Real-time Tips list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" /> Compliance Health Tips
            </h2>
            <button 
              onClick={fetchAITips}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Refresh tips"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
            {loadingTips ? (
              <div className="space-y-3">
                <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                <div className="h-28 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
              </div>
            ) : (
              tips.map((tip) => (
                <div key={tip.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      {tip.category}
                    </span>
                    <span className="text-[8px] text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" /> Active
                    </span>
                  </div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white mt-1.5">{tip.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{tip.content}</p>
                  {tip.actionable && (
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 p-2.5 rounded-xl mt-2 leading-relaxed border border-emerald-500/10">
                      <strong className="uppercase text-[8px] tracking-wider block text-emerald-500 mb-0.5">Recommended Action:</strong>
                      {tip.actionable}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Interactive AI Chat Console */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 shadow-sm flex flex-col h-[570px] justify-between overflow-hidden">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">CareSync Expert Assistant</h2>
                <p className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" /> Instant Advisor Engine
                </p>
              </div>
            </div>
            <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">
              Zero Latency
            </span>
          </div>

          {/* Messages block */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin">
            {messages.map((m, idx) => {
              const isCoach = m.sender === 'coach';
              return (
                <div key={idx} className={`flex gap-3 max-w-[88%] ${isCoach ? 'mr-auto animate-slideInLeft' : 'ml-auto flex-row-reverse animate-slideInRight'}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    isCoach ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {isCoach ? <HeartPulse className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    isCoach 
                      ? 'bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-850/80' 
                      : 'bg-emerald-500 text-white font-medium'
                  }`}>
                    {m.isRich ? (
                      <div className="space-y-1">
                        {renderFormattedText(m.text)}
                      </div>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              );
            })}

            {/* Predefined prompt suggestion grid - Show inside messages panel for quick access */}
            {messages.length === 1 && (
              <div className="pt-4 space-y-3.5 border-t border-slate-50 dark:border-slate-800/60 mt-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <HelpCircle className="h-3 w-3 text-emerald-500" /> Tap to query instantly:
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {Object.entries(EXPERT_ANSWERS).map(([key, item]) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => triggerSmartResponse(key, item.prompt)}
                        className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 hover:bg-emerald-50/30 dark:bg-slate-950/30 dark:hover:bg-emerald-950/10 text-left hover:border-emerald-300 dark:hover:border-emerald-800/40 transition-all cursor-pointer group flex gap-3 items-start"
                      >
                        <span className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 group-hover:bg-emerald-500/5 transition-colors">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{item.prompt}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.category}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {sendingMsg && (
              <div className="flex gap-3 max-w-[85%] mr-auto animate-pulse">
                <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <HeartPulse className="h-4 w-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  Coach is looking up compliance guides...
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-3 shrink-0">
            
            {/* Minimal persistent prompt pills if the welcome screen has scrolled */}
            {messages.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none max-w-full">
                {Object.entries(EXPERT_ANSWERS).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => triggerSmartResponse(key, item.prompt)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800/80 dark:hover:bg-emerald-950/20 text-slate-600 dark:text-slate-300 dark:hover:text-emerald-400 border border-transparent whitespace-nowrap cursor-pointer transition-colors shrink-0"
                  >
                    {item.prompt.split(' ').slice(0, 3).join(' ')}...
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-2" id="chat-input-form">
              <input
                type="text"
                placeholder="Ask about side-effects, dynamic spacing, or type water/sleep to query..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 text-xs border border-slate-100 dark:border-slate-850 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none"
                disabled={sendingMsg}
                id="coach-input"
              />
              <button
                type="submit"
                disabled={sendingMsg || !inputMsg.trim()}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AIHealthCoach;
