'use client';

import React from 'react';
import Link from 'next/link';
import { useStudyStore } from '@/lib/store/StudyContext';
import { RotateCcw, AlertTriangle, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export default function RevisionPage() {
  const { topics } = useStudyStore();

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High Risk':
        return { label: '🔴 High Risk', class: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'Needs Revision':
        return { label: '🟠 Needs Revision', class: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'Due Soon':
        return { label: '🟡 Due Soon', class: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
      default:
        return { label: '🟢 Fresh', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>SPACED REPETITION & FORGETTING DECAY</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Smart Revision & Forgetting Risk</h1>
        <p className="text-xs text-slate-400 mt-1">
          Automatically calculates optimal recall intervals (Day 1 → 2 → 4 → 7 → 14 → 30) based on your performance.
        </p>
      </div>

      {/* Cycle Legend */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="font-extrabold text-white">Spaced Repetition Schedule:</span>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">Day 1: Learn</span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">Day 2: Recall</span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">Day 4: Practice</span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">Day 7: Revision</span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">Day 14: Test</span>
          <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">Day 30: Final Review</span>
        </div>
      </div>

      {/* Topics Revision List */}
      <div className="space-y-4">
        {topics.map(t => {
          const badge = getRiskBadge(t.revisionRisk);
          const daysSince = t.lastStudied
            ? Math.floor((new Date().getTime() - new Date(t.lastStudied).getTime()) / (1000 * 3600 * 24))
            : 10;

          return (
            <div key={t.id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-400">{t.subjectName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.class}`}>
                    {badge.label}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-white">{t.name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Last studied: {daysSince} days ago</span>
                  <span>•</span>
                  <span>Mastery: <span className="font-bold text-amber-400">{t.mastery}%</span></span>
                </div>
              </div>

              <Link
                href={`/focus-session?topic=${encodeURIComponent(t.name)}&subject=${encodeURIComponent(t.subjectName)}&duration=30`}
                className="px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs hover:bg-amber-500/30 transition-colors text-center"
              >
                Revise Now (30 min)
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
