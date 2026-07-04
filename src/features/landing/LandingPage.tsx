import React from 'react';
import { Heart, Activity, CheckCircle, Flame, Star, Sparkles, MessageSquare, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-50">
      
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-500 to-blue-600 shadow-sm shadow-emerald-500/10">
              <Heart className="h-5 w-5 text-white animate-pulse" />
            </div>
            <span className="text-md font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">CareSync</span>
          </div>
          <button
            onClick={onEnterApp}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-5 py-2 text-xs font-semibold shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all cursor-pointer"
            id="enter-app-nav-btn"
          >
            Launch CareSync
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-blue-50/10 to-transparent dark:from-emerald-950/5 dark:via-blue-950/5 -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 border border-emerald-100/50 dark:border-emerald-900/30 mb-6">
            <HeartPulse className="h-4 w-4 text-emerald-500" />
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">UN SDG 3: Good Health & Well-being Companion</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Adhere to Care.<br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 bg-clip-text text-transparent">
              Elevate Your Well-being.
            </span>
          </h1>
          
          <p className="mt-6 text-sm sm:text-md text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            CareSync is a smart, production-ready health sync application that helps you perfect your medication compliance, track water and sleep, monitor moods, and build unbreakable streaks.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white px-8 py-4 text-xs font-bold shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer"
              id="cta-launch-btn"
            >
              Get Started for Free <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#features"
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-8 py-4 text-xs font-bold transition-all"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900 transition-colors px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Everything You Need for Health Sync</h2>
            <p className="text-xs text-slate-500 mt-3 dark:text-slate-400 leading-relaxed">
              We leverage clean, medical-grade indicators and client-friendly design to optimize your routine compliance and build lasting habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Meds */}
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/20 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-300">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 mb-5">
                <HeartPulse className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Medication Sync</h3>
              <p className="text-xs text-slate-500 mt-2 dark:text-slate-400 leading-relaxed">
                Add medical dosage routines with strict morning, afternoon, or night timings. Ensure absolute adherence with smart streaks.
              </p>
            </div>

            {/* AI Advisor */}
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/20 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-300">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 mb-5">
                <Sparkles className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Gemini AI Coach</h3>
              <p className="text-xs text-slate-500 mt-2 dark:text-slate-400 leading-relaxed">
                Receive real-time compliance coaching tips, health suggestions, and instant clinical explanations on any added pills.
              </p>
            </div>

            {/* Tracker */}
            <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/20 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-300">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 mb-5">
                <Activity className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Wellness Sync Metrics</h3>
              <p className="text-xs text-slate-500 mt-2 dark:text-slate-400 leading-relaxed">
                Easily log and analyze water consumption, mood stability, sleep quality, daily exercise routines, and steps performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UN SDG 3 Global Well-being Impact Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 px-6 transition-colors">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-tr from-slate-900 via-emerald-950 to-blue-950 p-8 sm:p-12 text-white border border-emerald-900/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl -z-10" />

          <div className="max-w-3xl">
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">United Nations SDG 3 Integration</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">Empowering 1 Billion Healthy Lives</h2>
            <p className="text-xs text-slate-300 mt-4 leading-relaxed">
              According to the World Health Organization, nearly 50% of people fail to take chronic medications correctly. CareSync directly addresses this challenge, facilitating wellness management, reducing preventable clinical events, and promoting positive mental health and community resilience.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 border-t border-slate-800 pt-8">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">50%</p>
                <p className="text-[10px] text-slate-400 mt-1">Average Adherence Improvement</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
                <p className="text-[10px] text-slate-400 mt-1">Free and Accessible Worldwide</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">5+</p>
                <p className="text-[10px] text-slate-400 mt-1">Wellness Habits Managed Daily</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">24/7</p>
                <p className="text-[10px] text-slate-400 mt-1">Gemini AI Coaching Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 bg-white dark:bg-slate-950 px-6 border-t border-slate-100 dark:border-slate-900 transition-colors">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">How does the medication streak system work?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Every time you check a medicine reminder as 'taken' on the active dashboard, your active medication compliance streak increases. Missing a dose resets that specific pills active compliance streak.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Is my health sync data safe?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Absolutely. All tracking points, pill schedules, moods, and workout durations are securely persisted locally on the cloud container with robust security standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 transition-colors py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-emerald-500" />
            <span className="font-semibold text-slate-600 dark:text-slate-300">CareSync</span>
          </div>
          <p>© 2026 CareSync. Dedicated to United Nations SDG 3 (Good Health and Well-being).</p>
        </div>
      </footer>

    </div>
  );
};
export default LandingPage;
