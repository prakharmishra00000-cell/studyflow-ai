'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Brain, 
  Calendar, 
  RotateCcw, 
  FileText, 
  Target, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useStudyStore } from '@/lib/store/StudyContext';

export default function LandingPage() {
  const { resetToDemo } = useStudyStore();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl sticky top-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white">STUDYFLOW</span>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">AI</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            onClick={resetToDemo}
            className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Launch Demo Mode
          </Link>
          <Link
            href="/onboarding"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
          >
            <span>Start Planning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-16 sm:py-24 space-y-24">
        <section className="text-center space-y-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Know what to study. Know when to study. Never lose track.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Study smarter.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              Let AI decide what to study next.
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            STUDYFLOW AI creates personalized study plans, adapts to your progress, tracks revision decay, analyzes your mistakes, and tells you the single most effective topic to study right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-extrabold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 hover:brightness-110 transition-all active:scale-95"
            >
              <span>Start Planning Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/dashboard"
              onClick={resetToDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 font-semibold text-base hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>See How It Works (Demo)</span>
            </Link>
          </div>
        </section>

        {/* CORE PRODUCT LOOP VISUALIZER */}
        <section className="p-8 sm:p-12 rounded-3xl bg-slate-900/70 border border-slate-800 text-center space-y-8 relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-widest">THE ADAPTIVE ENGINE</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">One AI. Your Entire Study System.</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Not a generic chatbot or static calendar. A continuous adaptive learning loop designed around your exam date.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-4">
            {[
              { label: '1. PLAN', desc: 'AI Study Schedule', icon: Calendar, color: 'text-indigo-400 bg-indigo-500/10' },
              { label: '2. STUDY', desc: 'Distraction-Free Focus', icon: Target, color: 'text-cyan-400 bg-cyan-500/10' },
              { label: '3. TEST', desc: 'AI Diagnostic Quizzes', icon: Brain, color: 'text-purple-400 bg-purple-500/10' },
              { label: '4. ANALYZE', desc: 'Mistake Book & Weakness', icon: FileText, color: 'text-rose-400 bg-rose-500/10' },
              { label: '5. REVISE', desc: 'Spaced Repetition Decay', icon: RotateCcw, color: 'text-amber-400 bg-amber-500/10' },
              { label: '6. ADAPT', desc: 'Auto Redistribution', icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10' },
              { label: '7. STUDY NOW', desc: 'Optimal Next Session', icon: Zap, color: 'text-yellow-400 bg-yellow-500/10' }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 flex flex-col items-center justify-center space-y-2 text-center group hover:border-indigo-500/40 transition-colors">
                  <div className={`p-2.5 rounded-xl border border-white/5 ${step.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-white">{step.label}</span>
                  <span className="text-[10px] text-slate-400">{step.desc}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Feature Grid */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Why STUDYFLOW AI?</h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Built specifically for students preparing for competitive exams, university finals, and professional certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">"What Should I Study Now?"</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single click tells you the exact topic to study based on remaining days, weakness score, importance, and forgetting risk.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Adaptive Plan Redistribution</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Missed a session? Never dumps work onto tomorrow. Automatically rebalances your remaining workload smoothly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Syllabus & PYQ Import</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload PDFs or syllabus text. AI extracts subjects, units, and high-frequency previous year question topics.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] py-8 text-center text-xs text-slate-500">
        <p>STUDYFLOW AI — Your AI-powered study system.</p>
      </footer>
    </div>
  );
}
