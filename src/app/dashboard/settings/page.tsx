'use client';

import React, { useState } from 'react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Settings, Key, RefreshCw, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const { profile, updateProfile, resetToDemo } = useStudyStore();

  const [apiKey, setApiKey] = useState<string>(profile.apiKey || '');
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
      dailyStudyHours: dailyHours,
      apiKey
    });

    if (apiKey) {
      localStorage.setItem('studyflow_api_key', apiKey);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings & AI Configuration</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your student profile, exam parameters, and Google Gemini API integration.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" /> Google Gemini API Key Integration
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Gemini API Key</label>
          <input
            type="password"
            placeholder="AIzaSy... (Leave empty to use Render ENV variable or Demo Heuristics)"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-500">
            If provided, StudyFlow AI will call Gemini 2.5 Flash for custom explanations and quizzes. You can also configure <code className="text-indigo-300">GEMINI_API_KEY</code> directly in your Render deployment environment variables!
          </p>
        </div>

        <div className="border-t border-slate-800 pt-6 space-y-4">
          <h3 className="font-bold text-base text-white">Student Profile Settings</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Student Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Target Exam Name</label>
              <input
                type="text"
                value={exam}
                onChange={e => setExam(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Daily Target Hours</label>
              <input
                type="number"
                value={dailyHours}
                onChange={e => setDailyHours(parseInt(e.target.value) || 1)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={resetToDemo}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Reset Demo State (Prakhar Profile)
          </button>

          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-cyan-300" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
