'use client';

import React, { useState, useEffect } from 'react';
import { StudyAI } from '@/lib/ai/gemini';
import { ProgressiveHint } from '@/lib/types';
import { HelpCircle, X, Sparkles, ChevronRight, CheckCircle2, Lock } from 'lucide-react';

interface Props {
  questionText: string;
  onClose: () => void;
}

export default function ImStuckModal({ questionText, onClose }: Props) {
  const [hints, setHints] = useState<ProgressiveHint | null>(null);
  const [level, setLevel] = useState<number>(1); // 1 = Hint1, 2 = Hint2, 3 = Hint3, 4 = StepByStep, 5 = Answer
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    StudyAI.generateHints(questionText).then(res => {
      if (isMounted) {
        setHints(res);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [questionText]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-6 animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Progressive Assistance</h3>
              <p className="text-[11px] text-slate-400">Hints unlock step-by-step to guide your learning.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Context */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
          <span className="text-[10px] font-bold text-indigo-400 block uppercase">Question:</span>
          <p className="font-semibold text-white mt-0.5">{questionText}</p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400 space-y-2">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
            <p>AI is analyzing problem concept and preparing progressive hints...</p>
          </div>
        ) : hints ? (
          <div className="space-y-3">
            {/* Level 1: Hint 1 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-400 block">💡 Level 1: Conceptual Clue</span>
              <p className="text-xs text-slate-200">{hints.hint1}</p>
            </div>

            {/* Level 2: Hint 2 */}
            {level >= 2 ? (
              <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-1 animate-fadeIn">
                <span className="text-[10px] font-extrabold uppercase text-cyan-400 block">📐 Level 2: Formula & Principle</span>
                <p className="text-xs text-cyan-200 font-mono">{hints.hint2}</p>
              </div>
            ) : (
              <button
                onClick={() => setLevel(2)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-slate-400 text-xs font-semibold flex items-center justify-between hover:text-white hover:border-slate-700"
              >
                <span>Unlock Level 2: Relevant Formula</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            )}

            {/* Level 3: Strategy */}
            {level >= 3 ? (
              <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-1 animate-fadeIn">
                <span className="text-[10px] font-extrabold uppercase text-purple-400 block">🧩 Level 3: Approach & Strategy</span>
                <p className="text-xs text-slate-200">{hints.hint3}</p>
              </div>
            ) : level >= 2 ? (
              <button
                onClick={() => setLevel(3)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-slate-400 text-xs font-semibold flex items-center justify-between hover:text-white hover:border-slate-700"
              >
                <span>Unlock Level 3: Approach Strategy</span>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </button>
            ) : null}

            {/* Level 4: Step-by-Step */}
            {level >= 4 ? (
              <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-1 animate-fadeIn">
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 block">📝 Level 4: Guided Walkthrough</span>
                <p className="text-xs text-slate-200 whitespace-pre-wrap">{hints.stepByStep}</p>
              </div>
            ) : level >= 3 ? (
              <button
                onClick={() => setLevel(4)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-slate-400 text-xs font-semibold flex items-center justify-between hover:text-white hover:border-slate-700"
              >
                <span>Unlock Level 4: Step-by-Step Walkthrough</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
            ) : null}

            {/* Level 5: Full Answer */}
            {level >= 5 ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/60 space-y-1 animate-fadeIn">
                <span className="text-[10px] font-extrabold uppercase text-emerald-300 block">✅ Complete Solution</span>
                <p className="text-xs text-white font-semibold">{hints.answer}</p>
              </div>
            ) : level >= 4 ? (
              <button
                onClick={() => setLevel(5)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Show Complete Solution
              </button>
            ) : null}
          </div>
        ) : null}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
        >
          I Got It — Resume Learning
        </button>
      </div>
    </div>
  );
}
