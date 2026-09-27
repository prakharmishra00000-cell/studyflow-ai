'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Sliders, Calendar, Clock, Target, 
  Layers, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AIMentorDrawer } from '@/components/common/AIMentorDrawer';
import { AdjustPlanModal } from '@/components/common/AdjustPlanModal';
import { RoadmapTopic, TopicPriority } from '@/lib/types';

export default function RoadmapPage() {
  const { roadmap, toggleTopicStatus } = useStudyStore();
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopic | null>(null);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  if (!roadmap) return null;

  const { overview, months } = roadmap;

  const allTopics = months.flatMap(m => m.weeks).flatMap(w => w.topics);
  const completedCount = allTopics.filter(t => t.status === 'completed').length;
  const totalCount = Math.max(1, allTopics.length);
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const priorityColor = (p: TopicPriority) => {
    if (p.includes('Essential')) return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    if (p.includes('Important')) return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    if (p.includes('Optional')) return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 pb-20 lg:pb-8">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                  Living AI Learning Roadmap
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {overview.skill} Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Target: <strong className="text-white">{overview.careerGoal}</strong> • Level: <strong className="text-cyan-300">{overview.currentLevel}</strong>
              </p>
            </div>

            <button
              onClick={() => setIsAdjustOpen(true)}
              className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>⚙️ Adjust Pacing or Goal</span>
            </button>
          </div>

          {/* Clean 4-Card Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#070c17] border border-cyan-500/20 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Duration</span>
              </span>
              <p className="text-lg font-black text-white">{overview.totalDuration}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#070c17] border border-cyan-500/20 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daily Pacing</span>
              </span>
              <p className="text-lg font-black text-white">{overview.dailyStudyTime}/day</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#070c17] border border-cyan-500/20 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-400" />
                <span>Goal</span>
              </span>
              <p className="text-lg font-black text-white truncate">{overview.careerGoal}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#070c17] border border-cyan-500/20 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Syllabus Progress</span>
              </span>
              <p className="text-lg font-black text-cyan-400">{progressPercent}% Completed</p>
            </div>
          </div>

          {/* Simple Month-by-Month Roadmap List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Complete {months.length}-Month Syllabus Breakdown</span>
              </h2>
              <span className="text-xs text-slate-400 font-semibold">{allTopics.length} Total Topics</span>
            </div>

            <div className="space-y-6">
              {months.map((m) => {
                const monthTopics = m.weeks.flatMap(w => w.topics);
                const monthCompleted = monthTopics.filter(t => t.status === 'completed').length;
                const monthPercent = monthTopics.length > 0 ? Math.round((monthCompleted / monthTopics.length) * 100) : 0;

                return (
                  <div key={m.monthNumber} className="p-6 rounded-3xl bg-[#070c17] border border-cyan-500/25 space-y-5 shadow-xl">
                    
                    {/* Month Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black">
                            MONTH {m.monthNumber} OF {months.length}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">• {m.weeks.length} Weeks</span>
                        </div>
                        <h3 className="text-xl font-black text-white pt-1">{m.title}</h3>
                      </div>

                      {/* Month Progress Bar */}
                      <div className="w-full sm:w-40 space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-slate-400">
                          <span>Month Progress</span>
                          <span className="text-cyan-400">{monthPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${monthPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Weeks List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {m.weeks.map((w) => (
                        <div key={w.id} className="p-4 rounded-2xl bg-[#040712] border border-slate-800/80 space-y-3">
                          <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">{w.title}</h4>

                          <div className="space-y-2">
                            {w.topics.length > 0 ? (
                              w.topics.map((t) => {
                                const isDone = t.status === 'completed';
                                return (
                                  <div
                                    key={t.id}
                                    className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                                      isDone
                                        ? 'bg-[#060a14]/60 border-slate-900 text-slate-500'
                                        : 'bg-[#080f1d] border-cyan-500/20 hover:border-cyan-500/40 text-slate-200'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-2.5">
                                        <button
                                          onClick={() => toggleTopicStatus(t.id)}
                                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                                            isDone 
                                              ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black' 
                                              : 'border-slate-700 hover:border-cyan-400'
                                          }`}
                                        >
                                          {isDone && '✓'}
                                        </button>
                                        <div>
                                          <p className={`font-bold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                                            {t.name}
                                          </p>
                                          <p className="text-[10px] text-slate-400">{t.description}</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${priorityColor(t.priority)}`}>
                                        {t.priority}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-xs text-slate-500 italic p-2">Milestone project week</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </main>
      </div>

      <MobileNav />
      <AIMentorDrawer />
      <AdjustPlanModal isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} />
    </div>
  );
}

