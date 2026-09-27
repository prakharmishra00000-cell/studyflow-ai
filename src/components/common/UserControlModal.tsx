'use client';

import React from 'react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Sparkles, CheckCircle2, Eye, ShieldCheck, ArrowRight, X, AlertCircle } from 'lucide-react';
import ReviewChangesModal from './ReviewChangesModal';

export default function UserControlModal() {
  const { 
    pendingRecommendation, 
    applyRecommendation, 
    keepCurrentPlan, 
    showReviewModal, 
    toggleReviewModal 
  } = useStudyStore();

  if (!pendingRecommendation) return null;

  const { title, recommendationText, reasons, beforeSummary, afterSummary, removedModules, addedModules, compressedModules } = pendingRecommendation;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
        <div className="w-full max-w-2xl bg-[#0d1322] border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-950/80 overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-[#0d1322] p-6 border-b border-indigo-500/20 relative">
            <button 
              onClick={keepCurrentPlan}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
              title="Keep Current Plan"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Section 30 — AI Recommendation</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              The AI recommends these adjustments to keep your roadmap on track. You remain in control.
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-5 text-slate-200">
            
            {/* AI Recommendation Quote Box */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <AlertCircle className="w-4 h-4 text-cyan-400" />
                <span>AI Recommendation</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-100 italic leading-relaxed">
                &ldquo;{recommendationText}&rdquo;
              </p>
            </div>

            {/* Before / After Summary comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Before</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">{beforeSummary}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-indigo-900/30 border border-indigo-500/30">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Proposed</span>
                <p className="text-xs sm:text-sm font-bold text-white mt-1">{afterSummary}</p>
              </div>
            </div>

            {/* Key Rationale List */}
            {reasons && reasons.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Adaptation Rationale:</span>
                <ul className="space-y-1.5">
                  {reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                      <span className="text-indigo-400 font-bold mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Module Changes Tags */}
            {(removedModules.length > 0 || addedModules.length > 0 || compressedModules.length > 0) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {addedModules.map((m, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    + Added: {m}
                  </span>
                ))}
                {removedModules.map((m, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                    - Streamlined: {m}
                  </span>
                ))}
                {compressedModules.map((m, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                    ⚡ Compressed: {m}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Action Buttons (Section 30 Requirements: Apply | Review Changes | Keep Current Plan) */}
          <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={keepCurrentPlan}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-all border border-slate-700/80 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Keep Current Plan</span>
            </button>

            <button
              onClick={() => toggleReviewModal(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-200 font-semibold text-xs sm:text-sm transition-all border border-indigo-500/40 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Review Changes</span>
            </button>

            <button
              onClick={applyRecommendation}
              className="w-full sm:w-auto px-6 py-3 rounded-xl btn-orange text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95"
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-slate-950" />
              <span>Apply Changes</span>
            </button>
          </div>

        </div>
      </div>

      {/* Review Changes Detail Breakdown Modal */}
      {showReviewModal && <ReviewChangesModal />}
    </>
  );
}
