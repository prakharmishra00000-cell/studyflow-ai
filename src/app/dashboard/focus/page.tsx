'use client';

import React from 'react';
import Link from 'next/link';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Target, Play, Sparkles, Clock } from 'lucide-react';

export default function FocusLauncherPage() {
  const { topics } = useStudyStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span>DISTRACTION-FREE STUDY ENVIRONMENT</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Focus Mode Launcher</h1>
        <p className="text-xs text-slate-400 mt-1">
          Select a topic and enter an immersive fullscreen focus timer with Learn, Practice & Recall phase tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map(t => (
          <div key={t.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-cyan-400">{t.subjectName}</span>
              <h3 className="font-extrabold text-lg text-white">{t.name}</h3>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Mastery: <span className="font-bold text-amber-400">{t.mastery}%</span></span>
              <span>•</span>
              <span>Risk: {t.revisionRisk}</span>
            </div>

            <Link
              href={`/focus-session?topic=${encodeURIComponent(t.name)}&subject=${encodeURIComponent(t.subjectName)}&duration=45`}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch 45-Min Focus Session</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
