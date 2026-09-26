'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Clock, AlertTriangle, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Recommendation } from '@/lib/types';

interface Props {
  recommendation: Recommendation;
  onStartSession?: () => void;
  onChooseAnother?: () => void;
}

export default function AIRecommendationCard({ recommendation, onStartSession, onChooseAnother }: Props) {
  const isCritical = recommendation.priority === 'Critical';
  const isHigh = recommendation.priority === 'High';

  return (
    <div className="relative overflow-hidden rounded-3xl ai-recommendation-card p-6 sm:p-8 transition-all hover:border-indigo-500/50 group">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>✨ AI RECOMMENDATION</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${
            isCritical
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : isHigh
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          }`}>
            🔴 {recommendation.priority} Priority
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            {recommendation.recommendedDurationMinutes} min
          </span>
        </div>
      </div>

      {/* Main Topic Highlight */}
      <div className="my-4">
        <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 block mb-1">
          {recommendation.subjectName}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
          {recommendation.topicName}
        </h2>
      </div>

      {/* Reason Pill Tags */}
      <div className="flex flex-wrap gap-2 my-4">
        {recommendation.detailedReasons.map((reason, idx) => (
          <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/80 border border-slate-700/80 text-slate-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            {reason}
          </span>
        ))}
      </div>

      {/* Explanation Quote */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 my-5 text-xs text-slate-300 leading-relaxed">
        <p className="font-medium text-slate-200">Why should you study this now?</p>
        <p className="text-slate-400 mt-1 italic">"{recommendation.reason}"</p>
      </div>

      {/* Recommended Session Phases */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-6">
        {recommendation.sessionBreakdown.map((step, i) => (
          <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-200 mb-1">
              <span>{i + 1}. {step.phase}</span>
              <span className="text-[10px] text-cyan-400">{step.durationMinutes} min</span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">{step.action}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link
          href={`/focus-session?topic=${encodeURIComponent(recommendation.topicName)}&subject=${encodeURIComponent(recommendation.subjectName)}&duration=${recommendation.recommendedDurationMinutes}`}
          onClick={onStartSession}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2.5 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>START STUDY SESSION</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {onChooseAnother && (
          <button
            onClick={onChooseAnother}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-300 font-semibold text-xs hover:text-white hover:bg-slate-800 transition-colors"
          >
            Choose another topic
          </button>
        )}
      </div>
    </div>
  );
}
