'use client';

import React, { useState } from 'react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { StudyAI } from '@/lib/ai/gemini';
import { 
  Sparkles, Send, Bot, Clock, Target, Calendar, 
  RefreshCw, CheckCircle2, Zap, ArrowRight, HelpCircle 
} from 'lucide-react';

export default function AIMentorWidget() {
  const { roadmap, requestPlanChange, loadScenario } = useStudyStore();
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [aiReply, setAiReply] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);

  const handleAskAI = async (promptToUse?: string) => {
    const question = promptToUse || userPrompt;
    if (!question.trim()) return;

    setIsAsking(true);
    try {
      const reply = await StudyAI.mentorRespond(question, roadmap);
      setAiReply(reply);
    } catch (err) {
      setAiReply("I'm here to help adjust your roadmap and answer study questions anytime!");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="bg-[#0d1322] border border-indigo-500/30 rounded-3xl p-6 shadow-xl shadow-indigo-950/40 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Personal AI Mentor</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Live Adaptive</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Managing your journey from beginner ➔ skilled ➔ project-ready ➔ job-ready.
            </p>
          </div>
        </div>
      </div>

      {/* Section 36 Quality Bar Test Scenarios */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider">⚡ Adaptive Lifecycle Scenarios (Quality Bar):</span>
          <span className="text-[11px] text-indigo-400 font-medium">Section 36 Verification</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => requestPlanChange('more_time', '3 hr')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/40 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>2h ➔ 3h / day</span>
          </button>

          <button
            onClick={() => requestPlanChange('less_time', '1 hr')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/40 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>3h ➔ 1h / day</span>
          </button>

          <button
            onClick={() => requestPlanChange('missed_days', 3)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/40 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>I Missed 3 Days</span>
          </button>

          <button
            onClick={() => requestPlanChange('change_goal', 'Data Scientist')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/40 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>Goal ➔ Data Scientist</span>
          </button>

          <button
            onClick={() => requestPlanChange('finish_earlier', '3 Months')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/40 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>6m ➔ 3m Compression</span>
          </button>

          <button
            onClick={() => {
              setUserPrompt('What should I study today?');
              handleAskAI('What should I study today?');
            }}
            className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>What should I study today?</span>
          </button>
        </div>
      </div>

      {/* Question Form */}
      <div className="space-y-3">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAI();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ask AI: 'What should I study today?' or 'How do I learn faster?'"
              className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs sm:text-sm placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isAsking || !userPrompt.trim()}
            className="px-5 py-3 rounded-2xl btn-orange disabled:opacity-50 text-slate-950 font-black text-xs flex items-center gap-2 active:scale-95 transition-all"
          >
            {isAsking ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <>
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5 text-slate-950" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* AI Reply Output */}
      {aiReply && (
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/30 space-y-2 animate-fade-in text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Mentor Response</span>
          </div>
          <div>{aiReply}</div>
        </div>
      )}
    </div>
  );
}
