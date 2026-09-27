'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Sliders, Calendar, ArrowRight, CheckCircle2, Clock, Target, 
  Flame, Award, BookOpen, Layers, Bot, ChevronRight, PlayCircle
} from 'lucide-react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AIMentorDrawer } from '@/components/common/AIMentorDrawer';
import AIMentorWidget from '@/components/dashboard/AIMentorWidget';

export default function HomeDashboardPage() {
  const router = useRouter();
  const { roadmap, completeTask } = useStudyStore();

  if (!roadmap) return null;

  const { overview, dailyPlan, months, projects } = roadmap;

  const currentModule = months[0]?.weeks.find(w => w.status === 'active') || months[0]?.weeks[0];
  const pendingTasks = dailyPlan.tasks.filter(t => t.status === 'pending');
  const primaryTask = pendingTasks[0] || dailyPlan.tasks[0];

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 pb-20 lg:pb-8">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome Banner */}
          <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#060811] border border-cyan-500/20 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 font-medium">Good morning 👋</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider">
                    Day {dailyPlan.dayNumber}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Let's continue your <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">{overview.skill}</span> journey.
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Target: <strong className="text-white">{overview.careerGoal}</strong> • Pacing: <strong className="text-cyan-300">{overview.dailyStudyTime}/day</strong>
                </p>
              </div>

              {/* Progress Ring / Metrics Summary */}
              <div className="flex items-center gap-4 bg-[#060811]/80 p-4 rounded-2xl border border-slate-800 shrink-0">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-cyan-400"
                      strokeDasharray={`${dailyPlan.progressPercentage}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-white">{dailyPlan.progressPercentage}%</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Today: <strong>{overview.dailyStudyTime}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Streak: <strong>{roadmap.streakDays} Days</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Current: <strong className="text-white">{currentModule?.title.split('—')[1] || 'Core Module'}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Grid Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (2 Cols wide on desktop): Continue Learning & Today's Plan */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* LARGE PRIMARY CARD: CONTINUE LEARNING */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider flex items-center gap-1.5">
                    <PlayCircle className="w-4 h-4 text-cyan-400" />
                    <span>Continue Learning</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500">{primaryTask?.timeSlot || '09:00 - 09:30'}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    {primaryTask?.title || 'Master Python Fundamentals & Data Structures'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Category: <strong className="text-slate-200">{primaryTask?.category}</strong> • Duration: <strong className="text-cyan-400">{primaryTask?.estimatedMinutes || 30} mins</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 text-[10px] font-extrabold uppercase border border-cyan-500/20">
                      {primaryTask?.priority || '🔴 Essential'}
                    </span>
                    <span className="text-xs text-slate-400">Targeting {overview.careerGoal} requirement</span>
                  </div>

                  <button
                    onClick={() => primaryTask && completeTask(primaryTask.id)}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{primaryTask?.status === 'completed' ? 'Marked Completed' : 'Start Study Session'}</span>
                  </button>
                </div>
              </div>

              {/* TODAY'S PLAN TASK CARDS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <span>Today's Action Plan</span>
                  </h3>
                  <Link
                    href="/dashboard/today"
                    className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Full Today Schedule</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dailyPlan.tasks.map((task) => {
                    const isDone = task.status === 'completed';
                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                          isDone 
                            ? 'bg-slate-900/40 border-slate-800 opacity-60' 
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{task.icon}</span>
                            <div>
                              <p className="text-xs font-bold text-white leading-snug">{task.title}</p>
                              <p className="text-[10px] text-slate-400">{task.timeSlot} • {task.category}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                          <span className="text-slate-400">{task.estimatedMinutes} mins</span>
                          <button
                            onClick={() => completeTask(task.id)}
                            className={`px-3 py-1 rounded-lg font-bold transition-all ${
                              isDone
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {isDone ? '✓ Completed' : 'Complete'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* VISUAL ROADMAP PREVIEW */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Visual Timeline Preview</span>
                  </h3>
                  <Link
                    href="/dashboard/roadmap"
                    className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <span>Full Interactive Roadmap</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3 pt-2">
                  {months.map((m) => (
                    <div key={m.monthNumber} className="p-4 rounded-2xl bg-[#060811] border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-300">
                          M{m.monthNumber}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white">{m.title}</p>
                          <p className="text-[10px] text-slate-400">{m.weeks.length} Module Weeks</p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        m.status === 'active' 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Projects, Career Goal & AI Mentor Trigger */}
            <div className="space-y-8">
              
              {/* PERSONAL AI MENTOR & SECTION 36 QUALITY BAR SCENARIOS */}
              <AIMentorWidget />

              {/* CURRENT & UPCOMING PROJECTS */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <span>Portfolio Projects</span>
                  </h3>
                  <Link href="/dashboard/projects" className="text-xs font-bold text-emerald-400 hover:underline">
                    View All ({projects.length})
                  </Link>
                </div>

                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-4 rounded-2xl bg-[#060811] border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {proj.difficulty}
                        </span>
                        <span className="text-[10px] text-slate-400">{proj.estimatedTime}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{proj.name}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{proj.portfolioValue}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* REPLANNING QUICK ENTRY CARD */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-[#060811] border border-indigo-500/30 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Living Adaptive Engine</span>
                  <h3 className="text-base font-bold text-white">Need to Modify Your Plan?</h3>
                  <p className="text-xs text-slate-400">
                    If you missed days or want to change daily study hours, AI will rebalance your remaining roadmap automatically.
                  </p>
                </div>

                <button
                  onClick={() => router.push('/dashboard/roadmap')}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Adjust Pacing or Goal</span>
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>

      <MobileNav />
      <AIMentorDrawer />
    </div>
  );
}
