'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStudyStore } from '@/lib/store/StudyContext';
import { StudyAI } from '@/lib/ai/gemini';
import { Bot, Send, Sparkles, Plus } from 'lucide-react';

const QUICK_ACTIONS = [
  'Explain entropy in simple words',
  'Simplify Bernoulli theorem',
  'Give numerical problems on Bending Stress',
  'Generate 3 MCQs on Orthogonal Cutting',
  'Compare First Law vs Second Law',
  'Create flashcards for G-Codes'
];

interface ChatMsg {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

function CopilotContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  const { addTopic } = useStudyStore();

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: '1',
      sender: 'ai',
      text: '### 👋 Welcome to STUDYFLOW AI Copilot\n\nI am your focused academic coach. How can I assist your study session today? Click any quick action below or type a concept.'
    }
  ]);
  const [isSending, setIsSending] = useState<boolean>(false);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (promptText?: string) => {
    const textToSend = promptText || inputPrompt;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMsg = { id: `u-${Date.now()}`, sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsSending(true);

    try {
      const reply = await StudyAI.copilotRespond(textToSend);
      const aiMsg: ChatMsg = { id: `a-${Date.now()}`, sender: 'ai', text: reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const handleAddToPlan = (topicName: string) => {
    addTopic({
      name: topicName,
      subjectName: 'AI Copilot Topic',
      importance: 8,
      difficulty: 3,
      mastery: 20
    });
    alert(`"${topicName}" added to your study plan!`);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-cyan-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">AI Study Copilot</h1>
            <p className="text-xs text-slate-400">Ask definitions, numericals, active recall questions, or explanations.</p>
          </div>
        </div>
      </div>

      {/* Quick Action Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
        {QUICK_ACTIONS.map((action, i) => (
          <button
            key={i}
            onClick={() => handleSend(action)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold hover:border-indigo-500 hover:text-white shrink-0 transition-colors"
          >
            ✨ {action}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white font-medium rounded-br-none'
                  : 'bg-[#090d16] border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {/* "Add to my study plan" Action Pill */}
              {m.sender === 'ai' && (
                <button
                  onClick={() => handleAddToPlan('Entropy & Second Law')}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold text-[11px] inline-flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to my study plan
                </button>
              )}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl bg-[#090d16] border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>AI is crafting your study guide...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask AI Copilot (e.g., Explain entropy simply or give me numericals)..."
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputPrompt.trim() || isSending}
          className="p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CopilotPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading AI Copilot...</div>}>
      <CopilotContent />
    </Suspense>
  );
}
