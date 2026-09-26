'use client';

import React, { useState } from 'react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { DailyPlan, StudyPlanTask } from '@/lib/types';
import { CalendarDays, Sparkles, CheckCircle2, XCircle, RotateCcw, Plus, Clock, Edit2 } from 'lucide-react';

export default function PlanPage() {
  const { plans, profile, completeTask, skipTask, daysUntilExam } = useStudyStore();
  const [activeTab, setActiveTab] = useState<string>('Today');

  const selectedPlan = plans.find(p => p.label === activeTab) || plans[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI ADAPTIVE PLANNER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Adaptive Study Schedule</h1>
          <p className="text-xs text-slate-400 mt-1">
            Automatically redistributes workload when sessions are missed or scores change.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Daily Hours: {profile.dailyStudyHours}h/day • {daysUntilExam} Days left</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {plans.map(p => (
          <button
            key={p.label}
            onClick={() => setActiveTab(p.label)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activeTab === p.label
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{p.label}</span>
            {p.isAdjusted && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" title="Adjusted by AI" />
            )}
          </button>
        ))}
      </div>

      {/* Selected Plan List */}
      <div className="space-y-4">
        {selectedPlan.isAdjusted && (
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>AI automatically adjusted remaining tasks to balance your workload evenly.</span>
          </div>
        )}

        <div className="space-y-3">
          {selectedPlan.tasks.map(task => {
            const isCompleted = task.status === 'completed';
            const isSkipped = task.status === 'skipped';

            return (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                    : isSkipped
                    ? 'bg-slate-950 border-slate-800 opacity-60'
                    : 'glass-card text-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase text-indigo-400">
                      {task.subjectName}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      🔴 {task.priority}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-100">{task.topicName}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>⏱ {task.estimatedMinutes} min</span>
                    <span>•</span>
                    <span>Type: {task.activityType}</span>
                    {task.scheduledTime && (
                      <>
                        <span>•</span>
                        <span className="text-cyan-400 font-semibold">{task.scheduledTime}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Task Controls */}
                <div className="flex items-center gap-2">
                  {!isCompleted && !isSkipped && (
                    <>
                      <button
                        onClick={() => completeTask(task.id, 'good')}
                        className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Mark Complete
                      </button>
                      <button
                        onClick={() => skipTask(task.id)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 border border-slate-700 text-slate-400 hover:text-rose-300 text-xs font-semibold transition-colors"
                        title="Miss / Skip Task (Auto Redistribute)"
                      >
                        <XCircle className="w-4 h-4" /> Skip
                      </button>
                    </>
                  )}

                  {isCompleted && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                  )}

                  {isSkipped && (
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Skipped & Redistributed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
