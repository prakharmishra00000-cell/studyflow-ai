'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, ArrowRight, Clock, Award, Target, Calendar, Flame, CheckCircle2, Zap, PlayCircle
} from 'lucide-react';
import { NexronLogo } from '@/components/common/NexronLogo';
import { useStudyStore } from '@/lib/store/StudyContext';
import { AIGenerationModal } from '@/components/common/AIGenerationModal';
import { CurrentLevel, GoalType, DurationOption, TimeDedicatedOption } from '@/lib/types';

export default function LandingPage() {
  const router = useRouter();
  const { generateRoadmap, isGenerating, generationStep, loadScenario } = useStudyStore();

  const [skill, setSkill] = useState('Python');
  const [dailyHours, setDailyHours] = useState<TimeDedicatedOption>('2 hr');
  const [currentLevel, setCurrentLevel] = useState<CurrentLevel>('Beginner');
  const [goal, setGoal] = useState<GoalType>('Become Job Ready');
  const [duration, setDuration] = useState<DurationOption>('3 Months');

  const exampleSkills = [
    'Python',
    'Data Science',
    'Digital Marketing',
    'Web Development',
    'Excel',
    'UI/UX Design',
    'Video Editing',
    'Machine Learning',
    'Public Speaking',
    'SSC CGL Preparation'
  ];

  const timeOptions: TimeDedicatedOption[] = ['30 min', '1 hr', '1.5 hr', '2 hr', '3 hr', '4 hr+'];
  const levelOptions: CurrentLevel[] = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'];
  const goalOptions: GoalType[] = [
    'Learn the Skill',
    'Become Job Ready',
    'Build Projects',
    'Get Freelance Ready',
    'Prepare for Interviews',
    'Career Transition',
    'Master the Skill',
    'Exam Preparation',
    'Build a Portfolio'
  ];
  const durationOptions: DurationOption[] = ['30 Days', '2 Months', '3 Months', '6 Months', '9 Months', '1 Year'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skill.trim()) return;

    await generateRoadmap({
      skill,
      dailyHours,
      currentLevel,
      goal,
      duration
    });

    router.push('/dashboard/roadmap');
  };

  const runQuickScenario = (scenarioKey: string) => {
    loadScenario(scenarioKey);
    router.push('/dashboard/roadmap');
  };

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-cyan-600/15 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#060811]/80 backdrop-blur-xl sticky top-0 z-40 px-6 lg:px-12 py-4 flex items-center justify-between">
        <NexronLogo size="md" />

        <div className="flex items-center gap-3">
          <button
            onClick={() => runQuickScenario('python_analyst_6m')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:border-cyan-500/40 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Demo Roadmap</span>
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </header>

      {/* Main Hero & Dynamic Form */}
      <main id="generator" className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 sm:py-16 space-y-10 relative z-10">
        
        {/* Tagline */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Flame className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Living AI Learning Roadmap</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Learn Anything.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Your Way.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto font-semibold leading-relaxed">
            AI builds the roadmap. You build the skill.
          </p>
        </div>

        {/* Dynamic Form Card */}
        <form 
          onSubmit={handleSubmit}
          className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 space-y-8 backdrop-blur-xl"
        >
          {/* STEP 1: SKILL INPUT */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <span>1. Enter Skill or Career Goal</span>
            </label>
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g. Python, Data Science, Digital Marketing, Excel..."
              className="w-full bg-[#060811] border border-slate-700 focus:border-cyan-400 rounded-2xl p-4 text-lg font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
              required
            />

            {/* Clickable Examples */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-500">Popular Examples:</span>
              <div className="flex flex-wrap gap-1.5">
                {exampleSkills.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setSkill(ex)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                      skill === ex 
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' 
                        : 'bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* STEP 2: TIME DEDICATED */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>How much time can you dedicate?</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeOptions.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDailyHours(t)}
                    className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                      dailyHours === t
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                        : 'bg-[#060811] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {t}/day
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: CURRENT LEVEL */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Current Level</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {levelOptions.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setCurrentLevel(l)}
                    className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                      currentLevel === l
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10'
                        : 'bg-[#060811] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STEP 4: GOAL */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span>What's your goal?</span>
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as GoalType)}
                className="w-full bg-[#060811] border border-slate-800 focus:border-purple-500 rounded-2xl p-3.5 text-xs font-bold text-white focus:outline-none"
              >
                {goalOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
                <option value="Data Analyst">Data Analyst (Career Goal)</option>
                <option value="Backend Developer">Backend Developer (Career Goal)</option>
                <option value="Automation Specialist">Automation Specialist</option>
                <option value="Data Scientist">Data Scientist</option>
              </select>
            </div>

            {/* STEP 5: DURATION */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>How long do you have?</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {durationOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                      duration === d
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                        : 'bg-[#060811] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>✨ Generate My Roadmap</span>
            </button>
          </div>
        </form>

        {/* Section 36 Quick Scenario Verification Bar */}
        <section className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4 text-center">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest">Interactive Scenario Verification</span>
            <h3 className="text-sm font-bold text-white">Test Real-Time Dynamic Replanning</h3>
            <p className="text-xs text-slate-400">Click any scenario below to verify dynamic roadmap transformation live:</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => runQuickScenario('python_analyst_6m')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:border-cyan-500 transition-colors"
            >
              1️⃣ Python + 2h/day + Beginner + 6 Months
            </button>
            <button
              onClick={() => runQuickScenario('python_3h')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-semibold hover:border-cyan-500 transition-colors"
            >
              2️⃣ 2h → 3h/day (Adds Practice)
            </button>
            <button
              onClick={() => runQuickScenario('python_1h')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 text-xs font-semibold hover:border-amber-500 transition-colors"
            >
              3️⃣ 3h → 1h/day (Prunes Optional 🔵)
            </button>
            <button
              onClick={() => runQuickScenario('missed_3days')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-rose-300 text-xs font-semibold hover:border-rose-500 transition-colors"
            >
              4️⃣ Missed 3 Days (Rebalances)
            </button>
            <button
              onClick={() => runQuickScenario('change_data_scientist')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-purple-300 text-xs font-semibold hover:border-purple-500 transition-colors"
            >
              5️⃣ Goal: Analyst → Scientist
            </button>
            <button
              onClick={() => runQuickScenario('duration_3m')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-300 text-xs font-semibold hover:border-emerald-500 transition-colors"
            >
              6️⃣ 6m → 3m (Fast Track ⚡)
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060811] py-8 text-center text-xs text-slate-500">
        <p>NEXRON AI — Living AI Learning Roadmap & Career Mentor.</p>
      </footer>

      {/* AI Generation Animation Modal */}
      <AIGenerationModal isOpen={isGenerating} step={generationStep} />
    </div>
  );
}
