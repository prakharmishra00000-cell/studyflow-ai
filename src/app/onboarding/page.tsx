'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudyStore } from '@/lib/store/StudyContext';
import { CurrentLevel, GoalType, DurationOption, TimeDedicatedOption } from '@/lib/types';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Clock, Target, Calendar, BookOpen, Layers, Bot, Zap } from 'lucide-react';
import { StudyFlowLogo } from '@/components/common/StudyFlowLogo';
import { AIGenerationModal } from '@/components/common/AIGenerationModal';

export default function OnboardingPage() {
  const router = useRouter();
  const { generateRoadmap, isGenerating, generationStep } = useStudyStore();
  const [step, setStep] = useState(1);

  // Section 31 Example Journey Defaults: Python | 2 hours | Beginner | Data Analyst | 6 Months
  const [skill, setSkill] = useState('Python');
  const [dailyHours, setDailyHours] = useState<TimeDedicatedOption>('2 hr');
  const [currentLevel, setCurrentLevel] = useState<CurrentLevel>('Beginner');
  const [goal, setGoal] = useState<GoalType>('Data Analyst');
  const [duration, setDuration] = useState<DurationOption>('6 Months');

  const handleFinish = async () => {
    await generateRoadmap({
      skill: skill.trim() || 'Python',
      dailyHours,
      currentLevel,
      goal,
      duration,
      learningMode: '💼 Job Ready'
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between z-10">
        <StudyFlowLogo size="md" />

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span>Step {step} of 3</span>
          <div className="w-24 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto my-auto py-8 z-10 space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Skill & Career Goal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                What do you want to learn?
              </h1>
              <p className="text-sm text-slate-400 font-medium">
                Enter your target skill and the career outcome you want to achieve.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">Main Skill / Subject</label>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g. Python, Machine Learning, Web Development, SQL"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-2xl p-4 text-white font-bold outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">Target Career Goal</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Data Analyst', 'Data Scientist', 'Backend Developer', 'Automation Specialist', 'Full Stack Developer', 'Interview Prep'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGoal(g as GoalType)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                        goal === g 
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' 
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{g}</span>
                      {goal === g && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!skill.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:brightness-110 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Next: Time & Experience Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Schedule & Baseline</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Your Time & Starting Level
              </h1>
              <p className="text-sm text-slate-400 font-medium">
                AI will calibrate pace to fit your life without burning you out.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">Daily Study Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {['30 min', '1 hr', '2 hr', '3 hr'].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setDailyHours(h as TimeDedicatedOption)}
                      className={`p-3.5 rounded-2xl border text-xs font-extrabold transition-all text-center ${
                        dailyHours === h 
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">Current Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCurrentLevel(lvl as CurrentLevel)}
                      className={`p-3.5 rounded-2xl border text-xs font-bold transition-all text-center ${
                        currentLevel === lvl 
                          ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Next: Target Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Target Roadmap Duration</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                How long do you have?
              </h1>
              <p className="text-sm text-slate-400 font-medium">
                Choose your target duration. AI can compress or expand phases dynamically anytime.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {['1 Month', '3 Months', '6 Months', '12 Months'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d as DurationOption)}
                  className={`p-4 rounded-2xl border text-sm font-extrabold transition-all text-left flex items-center justify-between ${
                    duration === d 
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/20' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{d}</span>
                  {duration === d && <CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                </button>
              ))}
            </div>

            {/* Summary card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-400 uppercase tracking-wider">Your Setup Summary:</div>
              <div className="flex flex-wrap gap-2 text-slate-200 font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">Skill: {skill}</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">Time: {dailyHours}/day</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">Level: {currentLevel}</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">Goal: {goal}</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">Duration: {duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep(2)}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Generate Living AI Roadmap</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 z-10">
        STUDYFLOW AI • Learn Anything. Your Way.
      </div>

      {/* AI Generation Modal Overlay */}
      <AIGenerationModal isOpen={isGenerating} step={generationStep} />
    </div>
  );
}
