'use client';

import React from 'react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Layers } from 'lucide-react';

export default function ReviewChangesModal() {
  const { pendingRecommendation, applyRecommendation, keepCurrentPlan, toggleReviewModal } = useStudyStore();

  if (!pendingRecommendation) return null;

  const currentMonths = pendingRecommendation.proposedRoadmap.months;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-[#090d16] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-[#090d16] p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Review Detailed Roadmap Changes
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Inspect month-by-month phase adjustments before committing to your updated roadmap.
              </p>
            </div>
          </div>

          <button 
            onClick={() => toggleReviewModal(false)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Month Breakdown */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Target Goal & Timeline</span>
              <p className="text-base font-extrabold text-white mt-0.5">
                {pendingRecommendation.proposedRoadmap.overview.skill} ➔ {pendingRecommendation.proposedRoadmap.overview.careerGoal}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">
                ⏱️ {pendingRecommendation.proposedRoadmap.overview.dailyStudyTime}/day
              </span>
              <span className="px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                ⏳ {pendingRecommendation.proposedRoadmap.overview.totalDuration}
              </span>
            </div>
          </div>

          {/* Month Phases Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Proposed Month-by-Month Roadmap Architecture ({currentMonths.length} Months)
            </h3>

            {currentMonths.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm sm:text-base text-white">
                    {m.title}
                  </span>
                  <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    m.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    m.status === 'active' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {m.weeks.map((w, wIdx) => (
                    <div key={wIdx} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <div className="font-bold text-slate-200">{w.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {w.topics.length > 0 
                          ? w.topics.map(t => t.name).join(' • ') 
                          : 'Milestone project & hands-on evaluation'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={keepCurrentPlan}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Keep Current Plan</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleReviewModal(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors"
            >
              Back to Overview
            </button>
            <button
              onClick={applyRecommendation}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Changes Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
