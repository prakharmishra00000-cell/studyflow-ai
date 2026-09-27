'use client';

import React, { useState } from 'react';
import { 
  Settings, Sparkles, Sliders, CheckCircle2, RotateCcw, ArrowRight
} from 'lucide-react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AIMentorDrawer } from '@/components/common/AIMentorDrawer';
import { CurrentLevel, GoalType, DurationOption, TimeDedicatedOption, LearningMode } from '@/lib/types';

export default function SettingsPage() {
  const { roadmap, inputs, generateRoadmap, resetRoadmap } = useStudyStore();

  const [skill, setSkill] = useState(inputs.skill || 'Python');
  const [dailyHours, setDailyHours] = useState<TimeDedicatedOption>(inputs.dailyHours || '2 hr');
  const [currentLevel, setCurrentLevel] = useState<CurrentLevel>(inputs.currentLevel || 'Beginner');
  const [goal, setGoal] = useState<GoalType>(inputs.goal || 'Become Job Ready');
  const [duration, setDuration] = useState<DurationOption>(inputs.duration || '3 Months');
  const [learningMode, setLearningMode] = useState<LearningMode>(inputs.learningMode || '💼 Job Ready');

  const [updatePreview, setUpdatePreview] = useState<{
    whatChanged: string;
    whyChanged: string;
    added: string;
    removed: string;
    timeline: string;
  } | null>(null);

  const handlePreviewUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    setUpdatePreview({
      whatChanged: `Changed goal to ${goal}, duration to ${duration}, and study time to ${dailyHours}.`,
      whyChanged: `Adapting curriculum structure to optimize for your updated target schedule.`,
      added: `Added targeted practice modules, updated milestone timelines, and restructured capstone project.`,
      removed: `Removed lower-priority redundant theory topics.`,
      timeline: `Estimated completion target updated for ${duration}.`
    });
  };

  const handleApplyChanges = async () => {
    await generateRoadmap({
      skill,
      dailyHours,
      currentLevel,
      goal,
      duration,
      learningMode
    });
    setUpdatePreview(null);
  };

  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 pb-20 lg:pb-8">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Header */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚙️</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Roadmap Settings & Preferences
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Edit your skill, daily hours, goal, or learning mode anytime.
            </p>
          </div>

          {!updatePreview ? (
            <form onSubmit={handlePreviewUpdate} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="space-y-4">
                {/* Skill */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Skill</label>
                  <input
                    type="text"
                    value={skill}
                    onChange={e => setSkill(e.target.value)}
                    className="w-full bg-[#060811] border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Daily Hours & Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Daily Study Hours</label>
                    <select
                      value={dailyHours}
                      onChange={e => setDailyHours(e.target.value as TimeDedicatedOption)}
                      className="w-full bg-[#060811] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                    >
                      {['30 min', '1 hr', '1.5 hr', '2 hr', '3 hr', '4 hr+'].map(h => (
                        <option key={h} value={h}>{h}/day</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Current Level</label>
                    <select
                      value={currentLevel}
                      onChange={e => setCurrentLevel(e.target.value as CurrentLevel)}
                      className="w-full bg-[#060811] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                    >
                      {['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'].map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Goal & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Career / Learning Goal</label>
                    <input
                      type="text"
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      className="w-full bg-[#060811] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">Target Duration</label>
                    <select
                      value={duration}
                      onChange={e => setDuration(e.target.value as DurationOption)}
                      className="w-full bg-[#060811] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                    >
                      {['30 Days', '2 Months', '3 Months', '6 Months', '9 Months', '1 Year'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Learning Mode */}
                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-300">Learning Mode (Section 13)</label>
                  <select
                    value={learningMode}
                    onChange={e => setLearningMode(e.target.value as LearningMode)}
                    className="w-full bg-[#060811] border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="🎓 Structured Learning">🎓 Structured Learning</option>
                    <option value="⚡ Fast Track">⚡ Fast Track</option>
                    <option value="🧠 Deep Learning">🧠 Deep Learning</option>
                    <option value="💼 Job Ready">💼 Job Ready</option>
                    <option value="🛠 Project First">🛠 Project First</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={resetRoadmap}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-rose-400 text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Roadmap</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Review AI Roadmap Update</span>
                </button>
              </div>
            </form>
          ) : (
            /* Section 18 Roadmap Update Confirmation Card */
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase text-cyan-400 tracking-wider">Section 18 — AI Roadmap Update</span>
                <h2 className="text-xl font-bold text-white">Review Proposed Changes</h2>
              </div>

              <div className="space-y-3 text-xs bg-[#060811] p-5 rounded-2xl border border-slate-800">
                <p><strong>What Changed:</strong> <span className="text-slate-300">{updatePreview.whatChanged}</span></p>
                <p><strong>Why It Changed:</strong> <span className="text-slate-300">{updatePreview.whyChanged}</span></p>
                <p><strong>What Was Added:</strong> <span className="text-emerald-300">{updatePreview.added}</span></p>
                <p><strong>What Was Removed:</strong> <span className="text-amber-300">{updatePreview.removed}</span></p>
                <p><strong>New Completion Timeline:</strong> <span className="text-cyan-300">{updatePreview.timeline}</span></p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setUpdatePreview(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Keep Existing Plan
                </button>

                <button
                  onClick={handleApplyChanges}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 flex items-center gap-2"
                >
                  <span>Apply Changes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      <MobileNav />
      <AIMentorDrawer />
    </div>
  );
}
