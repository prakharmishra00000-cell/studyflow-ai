'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Topic, BrainState } from '@/lib/types';
import { Route, Sparkles, CheckCircle2, Play, ArrowDown, ChevronRight, RotateCcw, HelpCircle } from 'lucide-react';

export default function LearningPathPage() {
  const { topics, getRecommendation } = useStudyStore();
  const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);

  const rec = getRecommendation(45, 'normal');

  const getStateBadge = (state: BrainState) => {
    switch (state) {
      case 'Mastered': return { label: '🟢 Mastered', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'Strong': return { label: '🟢 Strong', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'Learning': return { label: '🔵 Learning', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      case 'Needs Practice': return { label: '🟡 Needs Practice', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'Needs Review': return { label: '🔴 Needs Attention', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      default: return { label: '⚪ Not Started', color: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
          <Route className="w-3.5 h-3.5 text-cyan-400" />
          <span>SYLLABUS PROGRESSION MAP</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">My Learning Path</h1>
        <p className="text-xs text-slate-400 mt-1">
          Visual progression through your syllabus. AI intelligently recommends your next topic.
        </p>
      </div>

      {/* Recommended Next Topic Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
            NEXT RECOMMENDED TOPIC
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
            {rec.topicName} ({rec.subjectName})
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            You have completed all prerequisite concepts. Target duration: 45 min.
          </p>
        </div>

        <Link
          href={`/focus-session?topic=${encodeURIComponent(rec.topicName)}&subject=${encodeURIComponent(rec.subjectName)}&duration=45`}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 hover:brightness-110 shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>CONTINUE LEARNING</span>
        </Link>
      </div>

      {/* Main Grid: Path Flow + Topic Details Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Vertical Learning Path Flow */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-slate-200">Syllabus Sequence</h3>
          
          <div className="space-y-3 relative">
            {topics.map((t, idx) => {
              const badge = getStateBadge(t.brainState || 'Learning');
              const isSelected = selectedTopic.id === t.id;

              return (
                <div key={t.id} className="flex flex-col items-center">
                  <div
                    onClick={() => setSelectedTopic(t)}
                    className={`w-full p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500 shadow-xl'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-indigo-400">{t.subjectName}</span>
                      <h4 className="font-bold text-sm text-white">{t.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>Mastery: <span className="font-bold text-amber-400">{t.mastery}%</span></span>
                        <span>•</span>
                        <span>Importance: {t.importance}/10</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>

                  {idx < topics.length - 1 && (
                    <div className="my-1 text-slate-700">
                      <ArrowDown className="w-4 h-4 text-indigo-500/50 animate-bounce" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Details Inspector */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 h-fit sticky top-24">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-indigo-400">{selectedTopic.subjectName}</span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">{selectedTopic.name}</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Current Mastery:</span>
              <span className="font-bold text-amber-400">{selectedTopic.mastery}%</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Learning Brain Status:</span>
              <span className="font-bold text-cyan-400">{selectedTopic.brainState || 'Learning'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-semibold">What this topic covers:</span>
              <p className="text-slate-300 leading-relaxed">
                Core definitions, mathematical derivations, boundary conditions, and practical numerical applications.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Link
              href={`/focus-session?topic=${encodeURIComponent(selectedTopic.name)}&subject=${encodeURIComponent(selectedTopic.subjectName)}&duration=45`}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <Play className="w-4 h-4 fill-current" /> Practice This Topic
            </Link>

            <Link
              href="/dashboard/quizzes"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" /> Active Recall Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
