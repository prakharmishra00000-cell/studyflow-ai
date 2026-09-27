'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, X, Send, Sparkles, MessageSquare, HelpCircle, 
  BookOpen, Code2, Zap, AlertTriangle, ArrowRight, Loader2
} from 'lucide-react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { StudyAI } from '@/lib/ai/gemini';

export const AIMentorDrawer: React.FC = () => {
  const { roadmap } = useStudyStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `👋 Hi! I'm your **STUDYFLOW AI Mentor**.\n\nI am continuously monitoring your **${roadmap?.overview?.skill || 'Python'} → ${roadmap?.overview?.careerGoal || 'Data Analyst'}** roadmap.\n\nWhat can I help you master today?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "What should I study today?",
    "I don't understand this topic.",
    "Give me practice questions.",
    "Explain this like I'm a beginner.",
    "Give me a project.",
    "I am falling behind.",
    "Can you shorten my roadmap?",
    "Should I learn SQL before Pandas?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    setInputText('');
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setIsTyping(true);

    try {
      const responseText = await StudyAI.mentorRespond(query, roadmap);
      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'ai', text: "I'm having trouble fetching your update. Let's focus on today's scheduled tasks!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-6 md:bottom-6 md:right-8 z-40 p-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-400 text-slate-950 font-black shadow-2xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <span className="hidden sm:inline text-xs uppercase tracking-wider font-extrabold text-slate-950">
          AI Mentor
        </span>
      </button>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-950 border-l border-cyan-500/30 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20">
                  <div className="w-full h-full bg-[#060811] rounded-[10px] flex items-center justify-center text-cyan-400">
                    <Bot className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span>STUDYFLOW AI Mentor</span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h4>
                  <p className="text-[10px] text-slate-400">Context-Aware Learning Companion</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Badge */}
            <div className="px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20 text-[11px] text-cyan-300 flex items-center justify-between">
              <span className="truncate">🎯 Active Roadmap: <strong>{roadmap?.overview?.skill}</strong> ({roadmap?.overview?.careerGoal})</span>
              <span className="font-bold shrink-0">{roadmap?.dailyPlan?.progressPercentage || 0}% Done</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-semibold rounded-br-none shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-400 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-[11px] text-slate-400">AI Mentor is analyzing your roadmap context...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Chips */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-900/50 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Quick Suggestions</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-[10px] font-medium whitespace-nowrap hover:bg-cyan-500/20 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-950">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Ask your mentor anything..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
