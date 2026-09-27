'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Clock, CalendarX, Zap, Target, BookOpen, AlertCircle, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useStudyStore } from '@/lib/store/StudyContext';

interface AdjustPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdjustPlanModal: React.FC<AdjustPlanModalProps> = ({ isOpen, onClose }) => {
  const { roadmap, adjustPlan } = useStudyStore();
  const [selectedReason, setSelectedReason] = useState<string>('missed_days');
  
  // Custom inputs for options
  const [missedDaysCount, setMissedDaysCount] = useState<number>(3);
  const [newTimeVal, setNewTimeVal] = useState<string>('3 hr');
  const [lessTimeVal, setLessTimeVal] = useState<string>('1 hr');
  const [newDurationVal, setNewDurationVal] = useState<string>('2 Months');
  const [newGoalVal, setNewGoalVal] = useState<string>('Data Scientist');
  const [practiceTopic, setPracticeTopic] = useState<string>('Pandas groupby & aggregations');

  const [previewResult, setPreviewResult] = useState<{
    recommendation: string;
    beforeSummary: string;
    afterSummary: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleApplyReplan = () => {
    let result;
    if (selectedReason === 'missed_days') {
      result = adjustPlan('missed_days', missedDaysCount);
    } else if (selectedReason === 'more_time') {
      result = adjustPlan('more_time', newTimeVal);
    } else if (selectedReason === 'less_time') {
      result = adjustPlan('less_time', lessTimeVal);
    } else if (selectedReason === 'finish_earlier') {
      result = adjustPlan('finish_earlier', newDurationVal);
    } else if (selectedReason === 'change_goal') {
      result = adjustPlan('change_goal', newGoalVal);
    } else if (selectedReason === 'need_practice') {
      result = adjustPlan('need_practice', practiceTopic);
    }

    if (result) {
      setPreviewResult(result);
    }
  };

  const handleDone = () => {
    setPreviewResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060811]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 relative overflow-hidden space-y-6"
        >
          {/* Top header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">⚙️ Adjust Plan — AI Replanning Engine</h3>
                <p className="text-xs text-slate-400">Your life changed? AI will adapt your learning journey dynamically.</p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!previewResult ? (
            <div className="space-y-6">
              {/* Reason Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">What's changed?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'missed_days', label: 'I missed some days', icon: CalendarX, desc: `Missed ${missedDaysCount} days? Rebalance schedule` },
                    { id: 'more_time', label: 'I have more time', icon: Clock, desc: 'Increase daily hours & add practice' },
                    { id: 'less_time', label: 'I have less time', icon: AlertCircle, desc: 'Prune optional (🔵) topics; keep essentials (🔴)' },
                    { id: 'finish_earlier', label: 'I want to finish earlier', icon: Zap, desc: 'Activate Fast Track ⚡ mode' },
                    { id: 'need_practice', label: 'I need more practice', icon: BookOpen, desc: 'Schedule revision for weak topic' },
                    { id: 'change_goal', label: 'I want to change my goal', icon: Target, desc: 'Transform future curriculum path' }
                  ].map(opt => {
                    const Icon = opt.icon;
                    const isSelected = selectedReason === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedReason(opt.id)}
                        className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10'
                            : 'bg-[#060811]/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{opt.label}</p>
                          <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Inputs based on selected reason */}
              <div className="p-4 rounded-2xl bg-[#060811]/90 border border-slate-800/80 space-y-3">
                {selectedReason === 'missed_days' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-300">How many days did you miss?</span>
                      <span className="font-bold text-cyan-400 text-sm">{missedDaysCount} Days</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="14"
                      value={missedDaysCount}
                      onChange={e => setMissedDaysCount(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                    <p className="text-[11px] text-slate-400">
                      💡 AI will recalculate remaining workload without forcing an impossible catchup day.
                    </p>
                  </div>
                )}

                {selectedReason === 'more_time' && (
                  <div className="space-y-2 text-xs">
                    <span className="font-semibold text-slate-300">Select new daily time:</span>
                    <div className="flex gap-2">
                      {['2.5 hr', '3 hr', '4 hr+'].map(h => (
                        <button
                          key={h}
                          onClick={() => setNewTimeVal(h)}
                          className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                            newTimeVal === h ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          {h}/day
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReason === 'less_time' && (
                  <div className="space-y-2 text-xs">
                    <span className="font-semibold text-slate-300">Select reduced daily time:</span>
                    <div className="flex gap-2">
                      {['30 min', '1 hr', '1.5 hr'].map(h => (
                        <button
                          key={h}
                          onClick={() => setLessTimeVal(h)}
                          className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                            lessTimeVal === h ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          {h}/day
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReason === 'finish_earlier' && (
                  <div className="space-y-2 text-xs">
                    <span className="font-semibold text-slate-300">Target completion timeline:</span>
                    <div className="flex gap-2">
                      {['30 Days', '2 Months', '3 Months'].map(d => (
                        <button
                          key={d}
                          onClick={() => setNewDurationVal(d)}
                          className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                            newDurationVal === d ? 'bg-purple-500 text-white border-purple-400' : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReason === 'change_goal' && (
                  <div className="space-y-2 text-xs">
                    <span className="font-semibold text-slate-300">Select your new career goal:</span>
                    <select
                      value={newGoalVal}
                      onChange={e => setNewGoalVal(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Automation Specialist">Automation Specialist</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Full Stack Engineer">Full Stack Engineer</option>
                    </select>
                  </div>
                )}

                {selectedReason === 'need_practice' && (
                  <div className="space-y-2 text-xs">
                    <span className="font-semibold text-slate-300">Topic you are struggling with:</span>
                    <input
                      type="text"
                      value={practiceTopic}
                      onChange={e => setPracticeTopic(e.target.value)}
                      placeholder="e.g. Pandas groupby, SQL joins, Recursion..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Keep Original Schedule
                </button>
                <button
                  onClick={handleApplyReplan}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>✨ Automatically Replan</span>
                </button>
              </div>
            </div>
          ) : (
            /* Replanning Result Overview */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Your Roadmap Has Been Optimized!</span>
                </div>
                <p className="leading-relaxed text-slate-300">{previewResult.recommendation}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-[#060811] border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Before</span>
                  <p className="font-semibold text-slate-300">{previewResult.beforeSummary}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#060811] border border-cyan-500/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">After (AI Optimized)</span>
                  <p className="font-bold text-white">{previewResult.afterSummary}</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleDone}
                  className="px-8 py-3 rounded-2xl bg-cyan-500 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all flex items-center gap-2"
                >
                  <span>Apply Changes & Go to Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
