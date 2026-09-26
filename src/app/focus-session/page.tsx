'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStudyStore } from '@/lib/store/StudyContext';
import { UnderstandingRating } from '@/lib/types';
import { Play, Pause, RotateCcw, X, CheckCircle2, Mic, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

function FocusSessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { completeTask } = useStudyStore();

  const topicName = searchParams.get('topic') || 'Entropy & Second Law';
  const subjectName = searchParams.get('subject') || 'Thermodynamics';
  const durationMinutes = parseInt(searchParams.get('duration') || '45');

  const [secondsLeft, setSecondsLeft] = useState<number>(durationMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [activePhase, setActivePhase] = useState<'Learn' | 'Practice' | 'Recall'>('Learn');
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [understanding, setUnderstanding] = useState<UnderstandingRating>('good');
  const [completedStatus, setCompletedStatus] = useState<'Yes' | 'Partially' | 'No'>('Yes');

  // Voice Mode state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceReply, setVoiceReply] = useState<string>('');

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(s => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      setShowCompletionModal(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  // Phase tracker logic
  useEffect(() => {
    const elapsedMinutes = durationMinutes - Math.floor(secondsLeft / 60);
    if (elapsedMinutes < durationMinutes * 0.35) {
      setActivePhase('Learn');
    } else if (elapsedMinutes < durationMinutes * 0.80) {
      setActivePhase('Practice');
    } else {
      setActivePhase('Recall');
    }
  }, [secondsLeft, durationMinutes]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleVoiceMode = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setVoiceReply(`AI Voice Coach: "${transcript}" -> Great focus! Entropy increases in irreversible processes.`);
        
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Good response. Keep going!");
          window.speechSynthesis.speak(utterance);
        }
      };

      recognition.onerror = () => setIsListening(false);
    } else {
      setVoiceReply('Voice Speech API simulated: "Describe Second Law in your own words."');
    }
  };

  const handleFinishSession = () => {
    completeTask(`focus-${Date.now()}`, understanding);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">{subjectName}</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-300 font-semibold">{topicName}</span>
        </div>

        <button
          onClick={() => setShowCompletionModal(true)}
          className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Timer Display */}
      <div className="text-center space-y-8 z-10 max-w-2xl mx-auto my-auto py-12">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center justify-center gap-1.5">
            <Target className="w-4 h-4" /> TODAY'S FOCUS GOAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Understand {topicName} & solve core numericals.
          </h2>
        </div>

        {/* Phase Indicator Pills */}
        <div className="flex justify-center gap-3">
          {['Learn', 'Practice', 'Recall'].map(phase => (
            <div
              key={phase}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                activePhase === phase
                  ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
              }`}
            >
              {phase === 'Learn' && '1. Learn Concept'}
              {phase === 'Practice' && '2. Practice Problems'}
              {phase === 'Recall' && '3. Active Recall'}
            </div>
          ))}
        </div>

        {/* Big Countdown Timer */}
        <div className="text-7xl sm:text-9xl font-black tracking-tighter text-white font-mono drop-shadow-2xl">
          {formatTime(secondsLeft)}
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-5 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all"
          >
            {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button
            onClick={() => setSecondsLeft(durationMinutes * 60)}
            className="p-4 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button
            onClick={toggleVoiceMode}
            className={`p-4 rounded-full border transition-all ${
              isListening
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                : 'bg-slate-900 border-slate-800 text-cyan-400 hover:bg-slate-800'
            }`}
            title="Voice Study Mode (Speak to AI)"
          >
            <Mic className="w-6 h-6" />
          </button>
        </div>

        {voiceReply && (
          <div className="p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-xs text-indigo-200 animate-fadeIn">
            {voiceReply}
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="text-center text-xs text-slate-500 z-10">
        Stay focused. Press ESC or click X to complete session early.
      </div>

      {/* POST-SESSION FEEDBACK MODAL */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-8 rounded-3xl border border-slate-700 space-y-6 animate-scaleUp">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-2xl text-white">Session Complete!</h3>
              <p className="text-xs text-slate-400">Great job focusing on {topicName}.</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-200 block">How well did you understand this?</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Poor', icon: '😕', val: 'poor' },
                  { label: 'Okay', icon: '😐', val: 'okay' },
                  { label: 'Good', icon: '🙂', val: 'good' },
                  { label: 'Excellent', icon: '🔥', val: 'excellent' }
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setUnderstanding(opt.val as UnderstandingRating)}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
                      understanding === opt.val
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-[10px] font-bold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-200 block">Did you complete the planned session?</label>
              <div className="grid grid-cols-3 gap-2">
                {['Yes', 'Partially', 'No'].map(st => (
                  <button
                    key={st}
                    onClick={() => setCompletedStatus(st as any)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      completedStatus === st
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinishSession}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:brightness-110 transition-all"
            >
              SAVE FEEDBACK & ADAPT PLAN (+50 XP)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FocusSessionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Focus Session...</div>}>
      <FocusSessionContent />
    </Suspense>
  );
}
