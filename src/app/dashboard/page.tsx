'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudyStore } from '@/lib/store/StudyContext';
import AIRecommendationCard from '@/components/dashboard/AIRecommendationCard';
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Flame, 
  RotateCcw, 
  ArrowRight,
  TrendingUp,
  Brain
} from 'lucide-react';
import { UnderstandingRating } from '@/lib/types';

export default function DashboardHomePage() {
  const { 
    profile, 
    topics, 
    plans, 
    daysUntilExam, 
    getRecommendation, 
    completeTask, 
    skipTask,
    recoveryModeActive,
    activateRecoveryPlan
  } = useStudyStore();

  const [selectedTaskForModal, setSelectedTaskForModal] = useState<string | null>(null);
  const [rating, setRating] = useState<UnderstandingRating>('good');

  const recommendation = getRecommendation(45, 'normal');
  const todayPlan = plans.find(p => p.label === 'Today') || plans[0];

  const highRiskTopics = topics.filter(t => t.revisionRisk === 'High Risk' || t.revisionRisk === 'Needs Revision');

  const handleCompleteModalSubmit = () => {
    if (selectedTaskForModal) {
      completeTask(selectedTaskForModal, rating);
      setSelectedTaskForModal(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Greeting Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#131a2e] to-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Exam: {profile.exam}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Good evening, {profile.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            You have <span className="font-extrabold text-cyan-400 text-base">{daysUntilExam} days</span> remaining until your exam.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Link
            href="/dashboard/study-now"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 hover:brightness-110 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Study Now Engine</span>
          </Link>
        </div>
      </div>

      {/* Procrastination Recovery Alert Banner */}
      {recoveryModeActive && (
        <div className="p-5 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-purple-900/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Let's restart without stress</h3>
              <p className="text-xs text-purple-200/80 mt-0.5">
                You missed a couple of previous sessions. No shame — we generated a manageable 20-minute restart session to get you back into flow.
              </p>
            </div>
          </div>
          <button
            onClick={activateRecoveryPlan}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 shadow-md transition-colors"
          >
            Launch 20-Min Recovery Task
          </button>
        </div>
      )}

      {/* SECTION 6 HERO FEATURE: AI RECOMMENDATION CARD */}
      <AIRecommendationCard recommendation={recommendation} />

      {/* TODAY'S PLAN CHECKLIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-extrabold text-white">Today's Planned Sessions</h2>
          </div>
          <Link href="/dashboard/plan" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
            View Full Plan <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayPlan?.tasks.map(task => {
            const isCompleted = task.status === 'completed';
            const isSkipped = task.status === 'skipped';

            return (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                    : isSkipped
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-60'
                    : 'glass-card text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {task.subjectName}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    task.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {task.priority}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-100 line-clamp-1">{task.topicName}</h3>

                <div className="flex items-center gap-3 text-xs text-slate-400 my-3">
                  <span>⏱ {task.estimatedMinutes} min</span>
                  <span>•</span>
                  <span>{task.activityType}</span>
                </div>

                {/* Actions */}
                {!isCompleted && !isSkipped && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => setSelectedTaskForModal(task.id)}
                      className="flex-1 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Complete
                    </button>
                    <button
                      onClick={() => skipTask(task.id)}
                      className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-colors"
                      title="Skip / Miss (Auto-redistribute remaining workload)"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {isCompleted && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-2 border-t border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" /> Completed (+50 XP)
                  </div>
                )}

                {isSkipped && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold pt-2 border-t border-slate-800">
                    <XCircle className="w-4 h-4" /> Skipped (Redistributed)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK STATS & UPCOMING REVISIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revision Decay Monitor */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-sm text-white">Forgetting Risk & Upcoming Revision</h3>
            </div>
            <Link href="/dashboard/revision" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {highRiskTopics.slice(0, 3).map(topic => (
              <div key={topic.id} className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{topic.name}</span>
                    <span className="text-[10px] text-slate-400">({topic.subjectName})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>Mastery: <span className="font-bold text-amber-400">{topic.mastery}%</span></span>
                    <span>•</span>
                    <span>Mistakes: {topic.mistakeCount}</span>
                  </div>
                </div>

                <Link
                  href={`/focus-session?topic=${encodeURIComponent(topic.name)}&subject=${encodeURIComponent(topic.subjectName)}&duration=30`}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[11px] hover:bg-amber-500/30 transition-colors"
                >
                  Revise Now
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Gamification Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Flame className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-sm text-white">Study Velocity & Streak</h3>
            </div>
            <div className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Daily Study Streak</span>
                <span className="text-amber-400 font-bold">{profile.streak} Days 🔥</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full" style={{ width: '70%' }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">30 min study today to maintain your streak!</p>
            </div>
          </div>

          <Link
            href="/dashboard/copilot"
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 text-center flex items-center justify-center gap-2 transition-colors"
          >
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>Ask AI Copilot for help</span>
          </Link>
        </div>
      </div>

      {/* Completion Rating Modal */}
      {selectedTaskForModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-slate-700 space-y-5 animate-scaleUp">
            <h3 className="font-bold text-lg text-white">How well did you understand this session?</h3>
            <p className="text-xs text-slate-400">Your rating adjusts future spaced revision intervals & mastery scores.</p>

            <div className="grid grid-cols-4 gap-2.5">
              {[
                { label: 'Poor', icon: '😕', val: 'poor', color: 'border-rose-500/40 text-rose-300' },
                { label: 'Okay', icon: '😐', val: 'okay', color: 'border-amber-500/40 text-amber-300' },
                { label: 'Good', icon: '🙂', val: 'good', color: 'border-indigo-500/40 text-indigo-300' },
                { label: 'Excellent', icon: '🔥', val: 'excellent', color: 'border-emerald-500/40 text-emerald-300' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setRating(opt.val as UnderstandingRating)}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
                    rating === opt.val ? `bg-indigo-600/30 ${opt.color} ring-2 ring-indigo-500` : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-[11px] font-bold">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedTaskForModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteModalSubmit}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
              >
                Save & Complete (+50 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
