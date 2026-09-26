'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudyStore } from '@/lib/store/StudyContext';
import { AlertCircle, CheckCircle2, RotateCcw, BookOpen, Trash2 } from 'lucide-react';

export default function MistakesPage() {
  const { mistakes, resolveMistake } = useStudyStore();
  const [retestId, setRetestId] = useState<string | null>(null);
  const [userRetestAns, setUserRetestAns] = useState<string>('');

  const activeMistakes = mistakes.filter(m => !m.resolved);

  const handleRetestSubmit = (mId: string, correctAns: string) => {
    if (userRetestAns.trim().toLowerCase() === correctAns.trim().toLowerCase()) {
      resolveMistake(mId);
      alert('Correct! Mistake marked as resolved 🎉');
    } else {
      alert('Not quite right. Review the explanation again!');
    }
    setRetestId(null);
    setUserRetestAns('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>AUTO-COLLECTED MISTAKE NOTEBOOK</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">My Mistakes Book</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review past quiz errors. Retest yourself to permanently resolve weak conceptual gaps.
        </p>
      </div>

      {activeMistakes.length === 0 ? (
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="font-bold text-white text-base">No Unresolved Mistakes!</h3>
          <p className="text-xs text-slate-400">Take a quiz or diagnostic test to practice and catch errors.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeMistakes.map(m => (
            <div key={m.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-indigo-400">{m.subjectName}</span>
                  <span className="text-[10px] text-slate-400 ml-2">• {m.topicName}</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                  ❌ Incorrect {m.attemptsCount} time{m.attemptsCount > 1 ? 's' : ''}
                </span>
              </div>

              <h3 className="font-bold text-base text-white">{m.questionText}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Your Past Answer:</span>
                  <span className="font-semibold text-rose-400">{m.userAnswer}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Correct Answer:</span>
                  <span className="font-semibold text-emerald-400">{m.correctAnswer}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                💡 Explanation: {m.explanation}
              </p>

              {retestId === m.id ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3">
                  <label className="text-xs font-bold text-indigo-300">Type correct answer to retest:</label>
                  <input
                    type="text"
                    value={userRetestAns}
                    onChange={e => setUserRetestAns(e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRetestSubmit(m.id, m.correctAnswer)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                    >
                      Submit & Resolve
                    </button>
                    <button
                      onClick={() => setRetestId(null)}
                      className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link
                    href={`/dashboard/copilot?query=${encodeURIComponent('Explain mistake: ' + m.questionText)}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:text-white"
                  >
                    <BookOpen className="w-4 h-4 text-cyan-400" /> Review Concept with AI
                  </Link>

                  <button
                    onClick={() => setRetestId(m.id)}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <RotateCcw className="w-4 h-4" /> Try Again
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
