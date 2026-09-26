'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudyStore } from '@/lib/store/StudyContext';
import { EnergyLevel, PriorityLevel, Topic } from '@/lib/types';
import { Sparkles, Clock, Zap, ArrowRight, Play, CheckCircle2, ChevronRight } from 'lucide-react';

const FALLBACK_TOPIC: Topic = {
  id: 'top-fallback',
  subjectId: 'sub-1',
  subjectName: 'Thermodynamics',
  name: 'Entropy & Second Law',
  importance: 9,
  difficulty: 4,
  mastery: 42,
  revisionRisk: 'High Risk',
  mistakeCount: 3,
  totalTimeSpentMinutes: 180
};

export default function StudyNowPage() {
  const { topics, daysUntilExam, getRecommendation } = useStudyStore();

  const [availableMinutes, setAvailableMinutes] = useState<number>(45);
  const [energy, setEnergy] = useState<EnergyLevel>('normal');
  const [customTime, setCustomTime] = useState<string>('');
  const [showChooseAnotherModal, setShowChooseAnotherModal] = useState<boolean>(false);
  const [overrideTopicId, setOverrideTopicId] = useState<string | null>(null);

  const recommendation = getRecommendation(
    customTime && !isNaN(parseInt(customTime)) ? parseInt(customTime) : availableMinutes,
    energy
  );

  const activeTopic: Topic = (overrideTopicId 
    ? topics.find(t => t.id === overrideTopicId) 
    : topics.find(t => t.id === recommendation.topicId)) || topics[0] || FALLBACK_TOPIC;

  const learnMin = Math.round((customTime ? parseInt(customTime) : availableMinutes) * 0.35);
  const solveMin = Math.round((customTime ? parseInt(customTime) : availableMinutes) * 0.45);
  const recallMin = Math.max(5, (customTime ? parseInt(customTime) : availableMinutes) - learnMin - solveMin);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>REAL-TIME ADAPTIVE ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What should I study now?
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure your current available time and energy. AI calculates the single highest-yield session for you.
        </p>
      </div>

      {/* INPUT SELECTORS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        {/* TIME SELECTOR */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-400" /> How much time do you have?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[15, 30, 45, 60, 120].map(mins => (
              <button
                key={mins}
                onClick={() => { setAvailableMinutes(mins); setCustomTime(''); }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  availableMinutes === mins && !customTime
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {mins < 60 ? `${mins} min` : `${mins / 60} hour${mins > 60 ? 's' : ''}`}
              </button>
            ))}
          </div>

          <div className="pt-1">
            <input
              type="number"
              placeholder="Custom duration (minutes)..."
              value={customTime}
              onChange={e => setCustomTime(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* ENERGY SELECTOR */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" /> How do you feel right now?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { level: 'low', label: '🔋 Low energy', sub: 'Revision & MCQs' },
              { level: 'normal', label: '🙂 Normal', sub: 'Standard study' },
              { level: 'high', label: '⚡ High energy', sub: 'Hard concepts' }
            ].map(item => (
              <button
                key={item.level}
                onClick={() => setEnergy(item.level as EnergyLevel)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  energy === item.level
                    ? 'bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-bold text-xs">{item.label}</span>
                <span className="text-[10px] text-slate-400 mt-1">{item.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI RECOMMENDATION RESULT CARD */}
      <div className="relative p-6 sm:p-8 rounded-3xl ai-recommendation-card border border-indigo-500/40 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            YOUR BEST NEXT STUDY SESSION
          </span>
          <span className="px-3 py-1 rounded-md text-xs font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
            🔴 {recommendation.priority} Priority
          </span>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 block mb-1">
            {activeTopic.subjectName}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            {activeTopic.name}
          </h2>
        </div>

        {/* Why Now Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Why studying this now?</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Weakness</span>
              <span className="font-bold text-amber-400">{100 - activeTopic.mastery}% (Mastery {activeTopic.mastery}%)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Exam Importance</span>
              <span className="font-bold text-cyan-400">{activeTopic.importance}/10 Weight</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Forgetting Risk</span>
              <span className="font-bold text-rose-400">{activeTopic.revisionRisk}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Past Mistakes</span>
              <span className="font-bold text-indigo-300">{activeTopic.mistakeCount} unreviewed</span>
            </div>
          </div>
        </div>

        {/* Structured Session Phases */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {customTime || availableMinutes}-Minute Optimized Session Flow
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-xs text-white">
                <span>1. Learn Concept</span>
                <span className="text-cyan-400">{learnMin} min</span>
              </div>
              <p className="text-[11px] text-slate-400">Read core theory & key formulas</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-xs text-white">
                <span>2. Solve Questions</span>
                <span className="text-cyan-400">{solveMin} min</span>
              </div>
              <p className="text-[11px] text-slate-400">Solve 10-15 targeted practice numericals</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-xs text-white">
                <span>3. Active Recall</span>
                <span className="text-cyan-400">{recallMin} min</span>
              </div>
              <p className="text-[11px] text-slate-400">Self-test definitions & save mistakes</p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <Link
            href={`/focus-session?topic=${encodeURIComponent(activeTopic.name)}&subject=${encodeURIComponent(activeTopic.subjectName)}&duration=${customTime || availableMinutes}`}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START SESSION NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setShowChooseAnotherModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 font-semibold text-xs hover:text-white transition-colors"
          >
            Choose another topic
          </button>
        </div>
      </div>

      {/* CHOOSE ANOTHER TOPIC MODAL */}
      {showChooseAnotherModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-slate-700 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 text-sm">Select Alternate Topic</h3>
              <button onClick={() => setShowChooseAnotherModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">Close</button>
            </div>

            <div className="space-y-2">
              {topics.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setOverrideTopicId(t.id); setShowChooseAnotherModal(false); }}
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left flex items-center justify-between hover:border-indigo-500 transition-colors"
                >
                  <div>
                    <span className="text-[10px] text-indigo-400 font-bold uppercase">{t.subjectName}</span>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Mastery: {t.mastery}%</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
