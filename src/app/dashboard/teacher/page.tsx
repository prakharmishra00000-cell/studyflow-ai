'use client';

import React, { useState } from 'react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { StudyAI } from '@/lib/ai/gemini';
import { TeacherMode } from '@/lib/types';
import { UserCheck, Sparkles, Send, Bot, Check, HelpCircle } from 'lucide-react';
import ImStuckModal from '@/components/learning/ImStuckModal';

const TEACHERS: { mode: TeacherMode; title: string; icon: string; desc: string; style: string }[] = [
  {
    mode: 'explainer',
    title: 'THE EXPLAINER',
    icon: '🧑🏫',
    desc: 'Best for understanding difficult concepts.',
    style: 'Simple • Clear • Analogies • Step-by-Step'
  },
  {
    mode: 'examiner',
    title: 'THE EXAMINER',
    icon: '🧪',
    desc: 'Best for exam practice.',
    style: 'Questions First • Minimal Fluff • Exam-Style'
  },
  {
    mode: 'socratic',
    title: 'THE SOCRATIC TUTOR',
    icon: '🧠',
    desc: 'Best for deep conceptual understanding.',
    style: 'Guiding Questions • Self-Discovery'
  },
  {
    mode: 'solver',
    title: 'THE PROBLEM SOLVER',
    icon: '🧮',
    desc: 'Best for numerical calculations.',
    style: 'Given Data • Formula • Units • Steps'
  },
  {
    mode: 'coach',
    title: 'THE EXAM COACH',
    icon: '⚡',
    desc: 'Best for high-pressure preparation.',
    style: 'High Priority • Rapid Recall • Motivating'
  }
];

interface ChatMsg {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function TeacherPage() {
  const { profile, updateProfile } = useStudyStore();
  const [activeTeacher, setActiveTeacher] = useState<TeacherMode>(profile.teacherMode || 'explainer');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: '1',
      sender: 'ai',
      text: '### 👋 Welcome to AI Teacher Mode\n\nSelect a teacher personality above. Ask any question or request a numerical problem!'
    }
  ]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [showStuckModal, setShowStuckModal] = useState<boolean>(false);
  const [stuckQuestion, setStuckQuestion] = useState<string>('');

  const currentTeacherObj = TEACHERS.find(t => t.mode === activeTeacher) || TEACHERS[0];

  const handleSwitchTeacher = (mode: TeacherMode) => {
    setActiveTeacher(mode);
    updateProfile({ teacherMode: mode });
  };

  const handleSend = async (text?: string) => {
    const promptToSend = text || inputPrompt;
    if (!promptToSend.trim() || isSending) return;

    const userMsg: ChatMsg = { id: `u-${Date.now()}`, sender: 'user', text: promptToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsSending(true);

    try {
      const reply = await StudyAI.teacherRespond(promptToSend, activeTeacher);
      const aiMsg: ChatMsg = { id: `a-${Date.now()}`, sender: 'ai', text: reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleLaunchStuckModal = (questionText: string) => {
    setStuckQuestion(questionText);
    setShowStuckModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
          <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>TEACHER PERSONALITY SELECTION</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Choose Your AI Teacher</h1>
        <p className="text-xs text-slate-400 mt-1">
          Switch teaching personalities depending on whether you need simple explanations, numerical solving, or Socratic guidance.
        </p>
      </div>

      {/* Teacher Cards Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {TEACHERS.map(t => {
          const isSelected = activeTeacher === t.mode;
          return (
            <button
              key={t.mode}
              onClick={() => handleSwitchTeacher(t.mode)}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border-indigo-400 ring-2 ring-indigo-500 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-2xl block mb-1">{t.icon}</span>
                <h4 className="font-extrabold text-xs text-white leading-tight">{t.title}</h4>
              </div>
              <span className="text-[9px] text-slate-400 mt-2 block">{t.style}</span>
            </button>
          );
        })}
      </div>

      {/* Active Teacher Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentTeacherObj.icon}</span>
          <div>
            <h3 className="font-extrabold text-sm text-white">{currentTeacherObj.title} Active</h3>
            <p className="text-xs text-indigo-300">{currentTeacherObj.desc}</p>
          </div>
        </div>

        {/* Visible "I'M STUCK" Button (Section 18) */}
        <button
          onClick={() => handleLaunchStuckModal(messages[messages.length - 1]?.text || 'Calculate Entropy Change...')}
          className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" /> I'M STUCK
        </button>
      </div>

      {/* Teacher Chat Area */}
      <div className="h-[420px] flex flex-col justify-between p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-br-none'
                    : 'bg-[#090d16] border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-[#090d16] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>{currentTeacherObj.title} is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            placeholder={`Ask ${currentTeacherObj.title}...`}
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputPrompt.trim() || isSending}
            className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progressive I'm Stuck Modal */}
      {showStuckModal && (
        <ImStuckModal questionText={stuckQuestion} onClose={() => setShowStuckModal(false)} />
      )}
    </div>
  );
}
