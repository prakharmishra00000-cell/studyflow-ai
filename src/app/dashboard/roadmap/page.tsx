'use client';

import React, { useState } from 'react';
import { 
  Sparkles, Sliders, Calendar, Clock, Award, Target, BookOpen, 
  Layers, CheckCircle2, ChevronRight, ExternalLink, Flame, Zap
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

  const { overview, months, projects, milestones } = roadmap;

  const priorityColor = (p: TopicPriority) => {
    if (p.includes('Essential')) return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    if (p.includes('Important')) return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    if (p.includes('Optional')) return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
  };

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 pb-20 lg:pb-8">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Your Personalized Roadmap
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                <strong className="text-white">{overview.skill}</strong> → <strong className="text-cyan-300">{overview.totalDuration}</strong> → <strong className="text-emerald-400">{overview.dailyStudyTime}/day</strong> → <strong className="text-purple-300">{overview.careerGoal}</strong>
              </p>
            </div>

            <button
              onClick={() => setIsAdjustOpen(true)}
              className="self-start md:self-auto px-4 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 text-slate-950" />
              <span>⚙️ Adjust Plan</span>
            </button>
          </div>

          {/* Overview Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3">
            {[
              { label: 'Total Duration', val: overview.totalDuration, icon: Calendar, color: 'text-amber-400' },
              { label: 'Daily Study', val: overview.dailyStudyTime, icon: Clock, color: 'text-cyan-400' },
              { label: 'Total Hours', val: `${overview.estimatedTotalHours} hrs`, icon: Flame, color: 'text-rose-400' },
              { label: 'Current Level', val: overview.currentLevel, icon: Award, color: 'text-emerald-400' },
              { label: 'Target Level', val: 'Job Ready', icon: Target, color: 'text-purple-400' },
              { label: 'Career Goal', val: overview.careerGoal, icon: Sparkles, color: 'text-cyan-300' },
              { label: 'Modules', val: `${overview.modulesCount} Weeks`, icon: Layers, color: 'text-indigo-400' },
              { label: 'Projects', val: `${overview.projectsCount} Built`, icon: BookOpen, color: 'text-emerald-300' },
              { label: 'Milestones', val: `${overview.milestonesCount} Badges`, icon: Zap, color: 'text-amber-300' }
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold">
                    <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                    <span className="truncate">{m.label}</span>
                  </div>
                  <p className="text-xs font-black text-white truncate">{m.val}</p>
                </div>
              );
            })}
          </div>

          {/* Visual Timeline Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Timeline Nodes */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Milestones Horizontal Bar */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Milestone Checkpoints</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {milestones.map((ms) => (
                    <div key={ms.id} className="p-3 rounded-2xl bg-[#060811] border border-slate-800 flex items-center gap-3">
                      <span className="text-xl">{ms.badge.split(' ')[0] || '🏆'}</span>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white">{ms.title}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{ms.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Months Timeline */}
              <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">
                {months.map((m) => (
                  <div key={m.monthNumber} className="relative pl-10 space-y-4">
                    
                    {/* Node Dot */}
                    <div className="absolute left-1.5 top-1.5 w-5 h-5 rounded-full bg-cyan-500 border-4 border-[#060811] shadow-lg shadow-cyan-500/50" />

                    {/* Month Card */}
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-white">{m.title}</h2>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {m.status}
                        </span>
                      </div>

                      {/* Weeks Grid */}
                      <div className="space-y-4">
                        {m.weeks.map((w) => (
                          <div key={w.id} className="p-4 rounded-2xl bg-[#060811] border border-slate-800/80 space-y-3">
                            <h3 className="text-xs font-bold text-slate-300">{w.title}</h3>

                            <div className="space-y-2">
                              {w.topics.map((t) => {
                                const isDone = t.status === 'completed';
                                const isSelected = selectedTopic?.id === t.id;
                                return (
                                  <div
                                    key={t.id}
                                    onClick={() => setSelectedTopic(t)}
                                    className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                                      isSelected
                                        ? 'bg-cyan-500/15 border-cyan-500 text-white'
                                        : isDone
                                          ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                                          : 'bg-slate-900 border-slate-800/60 text-slate-200 hover:border-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleTopicStatus(t.id);
                                        }}
                                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                          isDone 
                                            ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' 
                                            : 'border-slate-600 hover:border-slate-400'
                                        }`}
                                      >
                                        {isDone && '✓'}
                                      </button>

                                      <div>
                                        <p className={`font-semibold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                                          {t.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400">{t.category} • {t.estimatedMinutes} mins</p>
                                      </div>
                                    </div>

                                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${priorityColor(t.priority)}`}>
                                      {t.priority}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Selected Topic Detail Inspector */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 sticky top-20">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Topic Inspector</span>
                </h3>

                {selectedTopic ? (
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1 pb-3 border-b border-slate-800">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${priorityColor(selectedTopic.priority)}`}>
                        {selectedTopic.priority}
                      </span>
                      <h4 className="text-lg font-bold text-white pt-1">{selectedTopic.name}</h4>
                      <p className="text-slate-400 leading-relaxed">{selectedTopic.description}</p>
                    </div>

                    {/* Resources Section */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Curated Resources (Section 12)</span>
                      <div className="space-y-2">
                        {selectedTopic.resources.map((res) => (
                          <div key={res.id} className="p-3 rounded-xl bg-[#060811] border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-cyan-400">{res.type} Resource</span>
                              <a href={res.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                            <p className="font-bold text-white">{res.title}</p>
                            <p className="text-[10px] text-slate-400 italic">"Why this resource? {res.whyThisResource}"</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleTopicStatus(selectedTopic.id)}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
                    >
                      {selectedTopic.status === 'completed' ? 'Mark Incomplete' : '✓ Mark Topic Complete'}
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-2 text-slate-500">
                    <BookOpen className="w-8 h-8 mx-auto text-slate-700" />
                    <p className="text-xs">Click any topic in the roadmap timeline to view curated resources and details.</p>
                  </div>
                )}
              </div>
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
