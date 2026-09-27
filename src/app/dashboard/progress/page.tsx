'use client';

import React from 'react';
import { 
  BarChart3, Award, CheckCircle2, Flame, Clock, Target, Layers, Sparkles
} from 'lucide-react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AIMentorDrawer } from '@/components/common/AIMentorDrawer';

export default function ProgressPage() {
  const { roadmap, updateTopicMastery } = useStudyStore();

  if (!roadmap) return null;

  const { overview, months, projects, totalHoursStudied, streakDays } = roadmap;

  const allTopics = months.flatMap(m => m.weeks).flatMap(w => w.topics);
  const completedTopicsCount = allTopics.filter(t => t.status === 'completed').length;
  const totalTopicsCount = Math.max(1, allTopics.length);
  const overallPercentage = Math.round((completedTopicsCount / totalTopicsCount) * 100);

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'Strong': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Proficient': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Developing': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Beginner': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 pb-20 lg:pb-8">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Skill Mastery & Progress Analytics
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Tracking real skill acquisition for <strong className="text-white">{overview.skill}</strong> → <strong className="text-cyan-300">{overview.careerGoal}</strong>
            </p>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Overall Progress</span>
              </div>
              <p className="text-3xl font-black text-white">{overallPercentage}%</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Current Streak</span>
              </div>
              <p className="text-3xl font-black text-white">{streakDays} Days</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Hours Studied</span>
              </div>
              <p className="text-3xl font-black text-white">{totalHoursStudied} hrs</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Target className="w-4 h-4 text-purple-400" />
                <span>Projects Completed</span>
              </div>
              <p className="text-3xl font-black text-white">{projects.filter(p => p.isCompleted).length} / {projects.length}</p>
            </div>
          </div>

          {/* Section 16 Skill Mastery System Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider">5-Stage Skill Mastery Engine</span>
              <h2 className="text-xl font-bold text-white">Topic Mastery Breakdown</h2>
              <p className="text-xs text-slate-400">
                Mastery flows through: <strong>Learn → Practice → Apply → Build → Review</strong>
              </p>
            </div>

            {/* Scale legend */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold border-b border-slate-800 pb-4">
              <span className="text-slate-500">Mastery Stages:</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">0–20% Awareness</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">21–40% Beginner</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">41–60% Developing</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">61–80% Proficient</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">81–100% Strong</span>
            </div>

            {/* Topic Mastery List */}
            <div className="space-y-4">
              {allTopics.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl bg-[#060811] border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-white">{t.name}</h3>
                      <p className="text-[10px] text-slate-400">{t.category} • Priority: {t.priority}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold border ${getMasteryColor(t.masteryLevel)}`}>
                        {t.masteryLevel} ({t.mastery}%)
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateTopicMastery(t.id, -10)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateTopicMastery(t.id, 10)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${t.mastery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      <MobileNav />
      <AIMentorDrawer />
    </div>
  );
}
