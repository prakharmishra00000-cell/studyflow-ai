'use client';

import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, Flame, PlayCircle, Sparkles, AlertCircle, BookOpen 
} from 'lucide-react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AIMentorDrawer } from '@/components/common/AIMentorDrawer';
import StudyResourcesModal from '@/components/common/StudyResourcesModal';
import { RoadmapTopic } from '@/lib/types';

export default function TodayPlannerPage() {
  const { roadmap, completeTask } = useStudyStore();
  const [activeResourceTopic, setActiveResourceTopic] = useState<RoadmapTopic | null>(null);

  if (!roadmap) return null;

  const { dailyPlan, overview, months } = roadmap;
  const allTopics = months.flatMap(m => m.weeks).flatMap(w => w.topics);

  const openResourcesForTask = (taskTitle: string) => {
    const matchedTopic = allTopics.find(t => taskTitle.toLowerCase().includes(t.name.toLowerCase())) || allTopics[0] || {
      id: 'top-curr',
      name: taskTitle,
      priority: '🔴 Essential',
      estimatedMinutes: 45,
      category: 'Core Study',
      status: 'in_progress',
      mastery: 50,
      masteryLevel: 'Developing',
      description: `Target study unit for ${overview.skill} towards ${overview.careerGoal}.`,
      resources: []
    };
    setActiveResourceTopic(matchedTopic as RoadmapTopic);
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 pb-20 lg:pb-8">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#070c17] border border-cyan-500/20 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-extrabold uppercase">
                    TODAY • Day {dailyPlan.dayNumber}
                  </span>
                  <span className="text-xs text-slate-400">{dailyPlan.date}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
                  Daily AI Planner
                </h1>
                <p className="text-xs text-slate-400">
                  Available Time: <strong className="text-cyan-400">{dailyPlan.availableHours}</strong> • Skill: <strong className="text-white">{overview.skill}</strong>
                </p>
              </div>

              {/* Real-time Progress Bar */}
              <div className="w-full sm:w-48 space-y-1 text-right">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Completion</span>
                  <span className="text-cyan-400">{dailyPlan.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${dailyPlan.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Time-Blocked Task Schedule */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Time-Blocked Schedule & Checklist</span>
            </h2>

            <div className="space-y-3">
              {dailyPlan.tasks.map((task) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isDone
                        ? 'bg-[#050810]/40 border-slate-900 opacity-60'
                        : 'bg-[#070c17] border-cyan-500/20 hover:border-cyan-500/50 shadow-md'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <button
                        onClick={() => completeTask(task.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                          isDone 
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black' 
                            : 'border-slate-700 hover:border-cyan-400'
                        }`}
                      >
                        {isDone && '✓'}
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{task.icon}</span>
                          <span className={`text-xs font-black ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                            {task.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {task.timeSlot} • {task.category} • Estimated: {task.estimatedMinutes} mins
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openResourcesForTask(task.title)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>📚 Study Resources</span>
                      </button>

                      <button
                        onClick={() => completeTask(task.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
                        }`}
                      >
                        {isDone ? 'Completed' : 'Mark Done'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Replanner Morning Check */}
          <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span>AI Daily Replanner Check</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              If your schedule changes today, NEXRON AI will automatically redistribute unfinished tasks across your upcoming days without overloading you.
            </p>
          </div>
        </main>
      </div>

      <MobileNav />
      <AIMentorDrawer />
      <StudyResourcesModal topic={activeResourceTopic} onClose={() => setActiveResourceTopic(null)} />
    </div>
  );
}
