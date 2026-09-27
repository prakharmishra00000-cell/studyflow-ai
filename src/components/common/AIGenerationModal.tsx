'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { NexronLogo } from './NexronLogo';

interface AIGenerationModalProps {
  isOpen: boolean;
  step: number;
}

export const AIGenerationModal: React.FC<AIGenerationModalProps> = ({ isOpen, step }) => {
  if (!isOpen) return null;

  const stepsList = [
    'Analyzing your skill & career goal...',
    'Calculating available daily study time...',
    'Structuring custom curriculum modules...',
    'Selecting level-based portfolio projects...',
    'Curating primary & practice learning resources...',
    'Building your actionable daily plan...',
    'Optimizing priorities (🔴 Essential to 🔵 Optional)...'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060811]/90 backdrop-blur-xl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 text-center space-y-6 relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Logo header */}
          <div className="flex justify-center">
            <NexronLogo size="lg" showText={false} />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
              <span>Building Your Learning Journey...</span>
            </h3>
            <p className="text-xs text-slate-400">
              NEXRON AI is crafting your dynamic adaptive roadmap
            </p>
          </div>

          {/* Step Sequence Checklist */}
          <div className="space-y-3 text-left bg-[#060811]/80 p-4 rounded-2xl border border-slate-800/80">
            {stepsList.map((st, idx) => {
              const currentStepIdx = idx + 1;
              const isDone = currentStepIdx < step;
              const isCurrent = currentStepIdx === step;

              return (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}

                  <span className={`font-medium ${
                    isDone 
                      ? 'text-slate-300' 
                      : isCurrent 
                        ? 'text-cyan-300 font-bold' 
                        : 'text-slate-500'
                  }`}>
                    {st}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 h-full rounded-full"
                animate={{ width: `${(step / 7) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
