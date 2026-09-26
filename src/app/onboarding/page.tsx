'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudyStore } from '@/lib/store/StudyContext';
import { ExamType, PreparationLevel } from '@/lib/types';
import { Sparkles, ArrowRight, ArrowLeft, Check, BookOpen, Calendar, Clock, Target, Plus, Trash2 } from 'lucide-react';

const EXAM_OPTIONS: ExamType[] = [
  'University Exam',
  'GATE',
  'UPSC',
  'JEE',
  'NEET',
  'SSC',
  'Banking',
  'Certification',
  'Other'
];

const PREP_LEVELS: PreparationLevel[] = [
  'Starting from zero',
  'Beginner',
  'Intermediate',
  'Mostly prepared',
  'Revision only'
];

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useStudyStore();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('Student');
  const [examType, setExamType] = useState<ExamType>('University Exam');
  const [customExam, setCustomExam] = useState('');
  const [examDate, setExamDate] = useState('2026-11-07');
  const [dailyHours, setDailyHours] = useState(3);
  const [prepLevel, setPrepLevel] = useState<PreparationLevel>('Intermediate');
  const [subjectsList, setSubjectsList] = useState<{ name: string; topicsCount: number }[]>([
    { name: 'Thermodynamics', topicsCount: 5 },
    { name: 'Strength of Materials', topicsCount: 4 }
  ]);
  const [newSubName, setNewSubName] = useState('');
  const [weakSubjects, setWeakSubjects] = useState<string[]>(['Thermodynamics']);
  const [strongSubjects, setStrongSubjects] = useState<string[]>(['Strength of Materials']);

  const addSubject = () => {
    if (newSubName.trim()) {
      setSubjectsList(prev => [...prev, { name: newSubName.trim(), topicsCount: 4 }]);
      setNewSubName('');
    }
  };

  const removeSubject = (idx: number) => {
    setSubjectsList(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleWeak = (sub: string) => {
    setWeakSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
    setStrongSubjects(prev => prev.filter(s => s !== sub));
  };

  const toggleStrong = (sub: string) => {
    setStrongSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);
    setWeakSubjects(prev => prev.filter(s => s !== sub));
  };

  const handleFinish = () => {
    updateProfile({
      name: name.trim() || 'Prakhar',
      exam: examType === 'Other' && customExam ? customExam : examType,
      examType: examType,
      examDate: examDate,
      dailyStudyHours: dailyHours,
      preparationLevel: prepLevel,
      weakSubjects: weakSubjects,
      strongSubjects: strongSubjects,
      hasCompletedOnboarding: true
    });

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5">
            <div className="w-full h-full bg-[#090d16] rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-extrabold text-sm text-white">STUDYFLOW AI</span>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-cyan-400' : i < step ? 'w-2 bg-indigo-500' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Step Container */}
      <main className="max-w-xl w-full mx-auto my-auto py-8">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          {/* STEP 1: Exam Type */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 1 of 6</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">What are you preparing for?</h2>
                <p className="text-xs text-slate-400 mt-1">Select your exam or target certification.</p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Prakhar)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {EXAM_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setExamType(opt)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                        examType === opt
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-inner'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {examType === 'Other' && (
                  <input
                    type="text"
                    placeholder="Type custom exam name..."
                    value={customExam}
                    onChange={e => setCustomExam(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Exam Date */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 2 of 6</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">When is your exam?</h2>
                <p className="text-xs text-slate-400 mt-1">AI calculates target days to schedule revision cycles.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <input
                    type="date"
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="bg-transparent text-white font-semibold text-sm focus:outline-none w-full"
                  />
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                  ⚡ Target date set for {examDate}. You will have approximately{' '}
                  <span className="font-bold text-cyan-400">
                    {Math.max(1, Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} days
                  </span>{' '}
                  of total preparation time.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Daily Hours */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 3 of 6</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">How much can you study each day?</h2>
                <p className="text-xs text-slate-400 mt-1">Be realistic. AI will distribute tasks fitting this capacity.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[1, 2, 3, 4, 5].map(hrs => (
                  <button
                    key={hrs}
                    onClick={() => setDailyHours(hrs)}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      dailyHours === hrs
                        ? 'bg-indigo-600/30 border-indigo-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Clock className="w-5 h-5 text-cyan-400" />
                    <span className="font-extrabold text-sm">{hrs} {hrs === 5 ? '5+' : ''} hour{hrs > 1 ? 's' : ''}</span>
                    <span className="text-[10px] text-slate-400">per day</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Subjects */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 4 of 6</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Add your target subjects</h2>
                <p className="text-xs text-slate-400 mt-1">List the subjects you need to cover.</p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Subject name (e.g. Thermodynamics)"
                    value={newSubName}
                    onChange={e => setNewSubName(e.target.value)}
                    className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={addSubject}
                    className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-indigo-500"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {subjectsList.map((sub, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold text-white">{sub.name}</span>
                      </div>
                      <button onClick={() => removeSubject(idx)} className="text-rose-400 hover:text-rose-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Preparation Level */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 5 of 6</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Current preparation level</h2>
                <p className="text-xs text-slate-400 mt-1">How far along are you right now?</p>
              </div>

              <div className="space-y-2.5">
                {PREP_LEVELS.map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setPrepLevel(lvl)}
                    className={`w-full p-3.5 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                      prepLevel === lvl
                        ? 'bg-indigo-600/30 border-indigo-500 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{lvl}</span>
                    {prepLevel === lvl && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Weak vs Strong */}
          {step === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Step 6 of 6</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Strong & weak subjects</h2>
                <p className="text-xs text-slate-400 mt-1">Select weak subjects to receive higher initial priority.</p>
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto">
                {subjectsList.map((sub, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{sub.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleWeak(sub.name)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          weakSubjects.includes(sub.name)
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        🔴 Weak
                      </button>
                      <button
                        onClick={() => toggleStrong(sub.name)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          strongSubjects.includes(sub.name)
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        🟢 Strong
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 6 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/30 hover:brightness-110"
              >
                Generate My AI Plan <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="text-center text-[11px] text-slate-500">
        STUDYFLOW AI — Onboarding Setup
      </footer>
    </div>
  );
}
