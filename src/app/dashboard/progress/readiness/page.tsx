'use client';

import React from 'react';
import Link from 'next/link';
import { useStudyStore } from '@/lib/store/StudyContext';
import { calculateExamReadiness } from '@/lib/ai/learningBrain';
import { ShieldCheck, Sparkles, Play, ArrowRight, TrendingUp, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function ExamReadinessPage() {
  const { topics, profile, daysUntilExam } = useStudyStore();

  const readiness = calculateExamReadiness(topics, profile, daysUntilExam);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI LEARNING READINESS ESTIMATE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Exam Readiness Estimate</h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time readiness estimate based on syllabus coverage, active recall tests, mistake count, and days until exam.
        </p>
      </div>

      {/* Hero Percentage Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#131b2e] to-slate-900/90 border border-indigo-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-block relative">
          <div className="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-cyan-400 font-mono tracking-tight">
            {readiness.percentage}%
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block mt-1">
            READY FOR EXAM
          </span>
        </div>

        <p className="text-xs text-slate-400 max-w-md mx-auto">
          AI learning readiness estimate updated automatically as you complete focus sessions and quizzes.
        </p>
      </div>

      {/* YOUR NEXT BEST ACTION BOX */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">
            YOUR NEXT BEST ACTION
          </span>
          <h3 className="font-extrabold text-lg text-white">
            {readiness.nextBestAction.actionText}
          </h3>
          <p className="text-xs text-slate-400">
            Recommended session duration: {readiness.nextBestAction.recommendedDuration} minutes.
          </p>
        </div>

        <Link
          href={`/focus-session?topic=${encodeURIComponent(readiness.nextBestAction.topicName)}&duration=${readiness.nextBestAction.recommendedDuration}`}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 hover:brightness-110 shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>START PRACTICE</span>
        </Link>
      </div>

      {/* READINESS CATEGORIES BREAKDOWN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strong */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strong Subjects</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {readiness.strongSubjects.map((sub, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold text-xs">
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Improving */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>Improving Subjects</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {readiness.improvingSubjects.map((sub, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold text-xs">
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Needs Attention</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {readiness.needsAttentionSubjects.map((sub, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold text-xs">
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Critical Topics */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <XCircle className="w-4 h-4" />
            <span>Critical Topics</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {readiness.criticalTopics.map((top, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 font-semibold text-xs">
                {top}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
