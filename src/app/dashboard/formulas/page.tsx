'use client';

import React, { useState } from 'react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { FileCode, Sparkles, Copy, Check, BookOpen, Zap } from 'lucide-react';

interface CheatSheetData {
  topic: string;
  subject: string;
  formulas: { title: string; eq: string; desc: string }[];
  keyNotes: string[];
}

const CHEAT_SHEETS: Record<string, CheatSheetData> = {
  'Entropy & Second Law': {
    topic: 'Entropy & Second Law',
    subject: 'Thermodynamics',
    formulas: [
      { title: 'Entropy Definition (Reversible Process)', eq: '\\Delta S = \\int \\frac{dQ_{rev}}{T}', desc: 'Change in entropy for a reversible heat transfer process at absolute temperature T.' },
      { title: 'Clausius Inequality', eq: '\\oint \\frac{dQ}{T} \\le 0', desc: '= 0 for reversible cycle, < 0 for irreversible cycle.' },
      { title: 'Entropy Change of Ideal Gas', eq: 'S_2 - S_1 = C_v \\ln\\left(\\frac{T_2}{T_1}\\right) + R \\ln\\left(\\frac{V_2}{V_1}\\right)', desc: 'General T-V relation for constant specific heat ideal gas.' }
    ],
    keyNotes: [
      'Entropy of the universe always increases for spontaneous natural processes (ΔS_univ > 0).',
      'For an adiabatic reversible process (Isentropic), ΔS = 0.',
      'Third Law of Thermodynamics: Entropy of a pure crystalline solid is zero at 0 K.'
    ]
  },
  'Bending Stress in Beams': {
    topic: 'Bending Stress in Beams',
    subject: 'Strength of Materials (SOM)',
    formulas: [
      { title: 'Flexure Formula', eq: '\\frac{M}{I} = \\frac{\\sigma}{y} = \\frac{E}{R}', desc: 'Relates bending moment M, moment of inertia I, stress σ, neutral axis distance y, elastic modulus E, and radius of curvature R.' },
      { title: 'Section Modulus (Z)', eq: 'Z = \\frac{I}{y_{max}} \\quad \\Rightarrow \\quad \\sigma_{max} = \\frac{M}{Z}', desc: 'Geometric parameter representing beam bending resistance.' },
      { title: 'Rectangular Section Modulus', eq: 'Z = \\frac{b d^2}{6}', desc: 'Section modulus for rectangular beam of width b and depth d.' }
    ],
    keyNotes: [
      'Bending stress is ZERO at the neutral axis and MAXIMUM at the extreme top/bottom fibers.',
      'Assuming material is homogenous, isotropic, and obeys Hooke\'s Law.',
      'Cross sections remain plane before and after bending (Bernoulli-Euler theory).'
    ]
  },
  'Orthogonal Metal Cutting': {
    topic: 'Orthogonal Metal Cutting',
    subject: 'Manufacturing Tech',
    formulas: [
      { title: 'Shear Angle Formula (Merchant)', eq: '\\tan \\phi = \\frac{r \\cos \\alpha}{1 - r \\sin \\alpha}', desc: 'Relates shear angle φ, chip thickness ratio r, and rake angle α.' },
      { title: 'Cutting Ratio (r)', eq: 'r = \\frac{t_1}{t_2}', desc: 'Uncut chip thickness t1 divided by cut chip thickness t2 (r < 1).' },
      { title: 'Merchant Minimum Energy Equation', eq: '2\\phi + \\beta - \\alpha = 90^\\circ', desc: 'Optimal shear angle relationship for minimum cutting power.' }
    ],
    keyNotes: [
      'Orthogonal cutting: Cutting edge is perpendicular to the direction of tool travel.',
      'Continuous chips are formed when machining ductile metals at high speeds with positive rake angles.',
      'Built-up edge (BUE) decreases surface finish quality.'
    ]
  }
};

export default function FormulaPage() {
  const { topics } = useStudyStore();
  const [selectedTopicName, setSelectedTopicName] = useState<string>('Entropy & Second Law');
  const [copied, setCopied] = useState<boolean>(false);

  const sheet = CHEAT_SHEETS[selectedTopicName] || CHEAT_SHEETS['Entropy & Second Law'];

  const handleCopy = () => {
    const text = `${sheet.topic} (${sheet.subject})\n\nFormulas:\n` +
      sheet.formulas.map(f => `${f.title}: ${f.eq} - ${f.desc}`).join('\n') +
      `\n\nKey Concepts:\n` + sheet.keyNotes.join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>INSTANT AI CHEAT SHEET GENERATOR</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Formula & Revision Cheat Sheets</h1>
        <p className="text-xs text-slate-400 mt-1">
          Select any topic for instant 1-click access to core formulas, equations, definitions, and active recall summaries.
        </p>
      </div>

      {/* Topic Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {topics.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTopicName(t.name)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
              selectedTopicName === t.name
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* CHEAT SHEET CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider">
              {sheet.subject}
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-0.5">{sheet.topic} Formula Sheet</h2>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Copied!' : 'Copy Formulas'}</span>
          </button>
        </div>

        {/* Formulas Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4" /> Essential Formulas & Equations
          </h3>

          <div className="space-y-3">
            {sheet.formulas.map((f, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-indigo-300">{f.title}</h4>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-cyan-300 font-bold text-xs sm:text-sm">
                  <code>{f.eq}</code>
                </div>
                <p className="text-[11px] text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Concepts */}
        <div className="space-y-3 border-t border-slate-800 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> High-Yield Exam Notes
          </h3>

          <div className="space-y-2">
            {sheet.keyNotes.map((note, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0" />
                <span className="leading-relaxed">{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
