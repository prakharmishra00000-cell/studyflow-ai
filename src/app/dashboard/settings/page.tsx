'use client';

import React, { useState } from 'react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Settings, Sparkles, RefreshCw, Save, Check, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { profile, updateProfile, resetToDemo } = useStudyStore();

  const [name, setName] = useState<string>(profile.name);
  const [exam, setExam] = useState<string>(profile.exam);
  const [examDate, setExamDate] = useState<string>(profile.examDate);
  const [dailyHours, setDailyHours] = useState<number>(profile.dailyStudyHours);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    updateProfile({
      name,
      exam,
      examDate,
      dailyStudyHours: dailyHours
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings & System Profile</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your student profile, exam parameters, and daily study capacity.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        {/* System AI Connection Banner */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Vercel AI Serverless Connected</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Powered by Google Gemini API via Vercel Environment Variable (<code className="text-cyan-400">GEMINI_API_KEY</code>). All students get real-time AI recommendations, quizzes, and explanations automatically.
            </p>
          </div>
        </div>

        {/* Student Profile Settings */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white">Student Profile Settings</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Student Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Target Exam Name</label>
              <input
                type="text"
                value={exam}
                onChange={e => setExam(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Daily Target Hours</label>
              <input
                type="number"
                value={dailyHours}
                onChange={e => setDailyHours(parseInt(e.target.value) || 1)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={resetToDemo}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Reset Demo State (Prakhar Profile)
          </button>

          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-cyan-300" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
