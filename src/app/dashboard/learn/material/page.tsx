'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StudyAI } from '@/lib/ai/gemini';
import { SyllabusItem } from '@/lib/types';
import { Upload, Sparkles, BookOpen, Play, CheckCircle2, RotateCcw, HelpCircle, FileText } from 'lucide-react';

export default function MaterialPage() {
  const [rawText, setRawText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [learningPipeline, setLearningPipeline] = useState<{
    subject: string;
    unit: string;
    topics: { name: string; learnSummary: string; practiceCount: number }[];
  } | null>({
    subject: 'Thermodynamics',
    unit: 'Unit 2: Second Law & Entropy',
    topics: [
      { name: 'Entropy Definition & Clausius Inequality', learnSummary: 'Reversible heat transfer over temperature formula derivation.', practiceCount: 8 },
      { name: 'Entropy Change of Ideal Gas', learnSummary: 'Constant pressure and constant volume T-V relations.', practiceCount: 6 },
      { name: 'Free Expansion & Irreversibility', learnSummary: 'Zero work boundary condition with positive entropy generation.', practiceCount: 5 }
    ]
  });

  const handleUpload = async () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    try {
      const syllabus = await StudyAI.extractSyllabus(rawText);
      if (syllabus && syllabus.length > 0) {
        setLearningPipeline({
          subject: syllabus[0].subject,
          unit: syllabus[0].unit,
          topics: syllabus[0].topics.map(t => ({
            name: t,
            learnSummary: `Core theoretical concepts and key mathematical relationships for ${t}.`,
            practiceCount: 5
          }))
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>STUDY MATERIAL TO INTERACTIVE SYSTEM</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Study Material Learning System</h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload PDF notes, slides, or chapter text. AI converts static documents into an interactive LEARN → PRACTICE → RECALL → REVIEW pipeline.
        </p>
      </div>

      {/* Upload Form */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" /> Paste Notes / Chapter Text
        </label>
        <textarea
          rows={4}
          placeholder="Paste course notes, chapter summary, or PDF text here..."
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
        />
        <button
          onClick={handleUpload}
          disabled={isProcessing || !rawText.trim()}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>{isProcessing ? 'AI Transforming Material...' : 'TRANSFORM MATERIAL INTO LEARNING PIPELINE'}</span>
        </button>
      </div>

      {/* INTERACTIVE PIPELINE DISPLAY */}
      {learningPipeline && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider">
              {learningPipeline.unit}
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-0.5">{learningPipeline.subject} Interactive Pipeline</h2>
          </div>

          <div className="space-y-4">
            {learningPipeline.topics.map((t, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#090d16] border border-slate-800 space-y-4">
                <div>
                  <h4 className="font-extrabold text-base text-white">{t.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{t.learnSummary}</p>
                </div>

                {/* 4 Pipeline Stages */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 font-bold text-center">
                    1. LEARN
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 font-bold text-center">
                    2. PRACTICE ({t.practiceCount} Qs)
                  </div>
                  <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-bold text-center">
                    3. RECALL
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 font-bold text-center">
                    4. REVIEW
                  </div>
                </div>

                <Link
                  href={`/focus-session?topic=${encodeURIComponent(t.name)}&subject=${encodeURIComponent(learningPipeline.subject)}&duration=45`}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START LEARNING PIPELINE</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
