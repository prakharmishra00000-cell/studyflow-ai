'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudyStore } from '@/lib/store/StudyContext';
import { calculateExamReadiness } from '@/lib/ai/learningBrain';
import AIRecommendationCard from '@/components/dashboard/AIRecommendationCard';
import { 
  Sparkles, 
  Play, 
  Route, 
  ShieldCheck, 
  Zap, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Clock,
  BookOpen
} from 'lucide-react';

export default function DashboardHomePage() {
  const { profile, topics, plans, daysUntilExam, getRecommendation, recoveryModeActive, activateRecoveryPlan } = useStudyStore();

  const recommendation = getRecommendation(45, 'normal');
  const readiness = calculateExamReadiness(topics, profile, daysUntilExam);
  const gapTopic = topics.find(t => t.mastery < 50 || t.revisionRisk === 'High Risk') || topics[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#131a2e] to-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{profile.exam}</span>
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
            href="/dashboard/progress/readiness"
            className="px-4 py-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-cyan-300 font-extrabold text-xs flex items-center gap-2 hover:border-indigo-400 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Readiness: {readiness.percentage}%</span>
          </Link>
        </div>
      </div>

      {/* Procrastination Recovery Alert Banner */}
      {recoveryModeActive && (
        <div className="p-5 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Let's restart without stress</h3>
              <p className="text-xs text-purple-200/80 mt-0.5">
                You missed previous sessions. Click to launch a 20-min recovery task.
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

      {/* WHAT SHOULD I DO NEXT? (PRIMARY HERO RECOMMENDATION CARD) */}
      <AIRecommendationCard recommendation={recommendation} />

      {/* SECONDARY HOMEPAGE GRID (Learning Path + Knowledge Gap + Readiness + Quick Study) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Your Learning Path Snippet */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block">
              YOUR LEARNING PATH
            </span>
            <h4 className="font-bold text-sm text-white mt-1">Continue where you left off</h4>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Next node: {recommendation.topicName} ({recommendation.subjectName})
            </p>
          </div>
          <Link
            href="/dashboard/learn/path"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 pt-2 border-t border-slate-800"
          >
            Open Learning Path <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2. Knowledge Gap Highlight */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 block">
              KNOWLEDGE GAP DETECTED
            </span>
            <h4 className="font-bold text-sm text-white mt-1">{gapTopic?.name || 'Entropy'}</h4>
            <p className="text-xs text-slate-400 mt-1">
              Mastery is {gapTopic?.mastery || 42}%. Target active recall test.
            </p>
          </div>
          <Link
            href={`/focus-session?topic=${encodeURIComponent(gapTopic?.name || 'Entropy')}&duration=15`}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 pt-2 border-t border-slate-800"
          >
            Fix Knowledge Gap <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3. Exam Readiness (71%) */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 block">
              EXAM READINESS
            </span>
            <h4 className="font-extrabold text-2xl text-white mt-1">{readiness.percentage}%</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              AI learning readiness estimate.
            </p>
          </div>
          <Link
            href="/dashboard/progress/readiness"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 pt-2 border-t border-slate-800"
          >
            View Breakdown <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4. Quick Study Selector */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
              QUICK STUDY SESSION
            </span>
            <h4 className="font-bold text-sm text-white mt-1">Select available duration</h4>
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {[5, 10, 15, 30].map(mins => (
                <Link
                  key={mins}
                  href={`/dashboard/study-now?time=${mins}`}
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-center text-slate-300 hover:border-amber-400 hover:text-white"
                >
                  {mins}m
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/dashboard/study-now"
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 pt-2 border-t border-slate-800"
          >
            Study Now Engine <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
