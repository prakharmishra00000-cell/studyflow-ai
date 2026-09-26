'use client';

import React, { useState } from 'react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { StudyAI } from '@/lib/ai/gemini';
import { QuizQuestion } from '@/lib/types';
import { Brain, HelpCircle, CheckCircle2, XCircle, Sparkles, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizzesPage() {
  const { subjects, topics, addMistake, addTopic } = useStudyStore();

  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.name || 'Thermodynamics');
  const [selectedTopic, setSelectedTopic] = useState<string>(topics[0]?.name || 'Entropy & Second Law');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>('Medium');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[] | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleStartQuiz = async () => {
    setIsGenerating(true);
    setQuizSubmitted(false);
    setUserAnswers({});
    setCurrentQIndex(0);

    try {
      const qList = await StudyAI.generateQuiz(selectedSubject, selectedTopic, questionCount, difficulty);
      setActiveQuiz(qList);
    } catch (e) {
      console.error('Quiz generation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (qId: string, option: string) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    let correct = 0;

    activeQuiz.forEach(q => {
      const uAns = userAnswers[q.id];
      if (uAns && uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correct += 1;
      } else {
        // Save to Mistake Book automatically!
        const matchingTopic = topics.find(t => t.name === selectedTopic) || topics[0];
        addMistake({
          subjectId: matchingTopic.subjectId,
          subjectName: selectedSubject,
          topicId: matchingTopic.id,
          topicName: selectedTopic,
          questionText: q.text,
          userAnswer: uAns || 'Not Answered',
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        });
      }
    });

    setScore(correct);
    setQuizSubmitted(true);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const currentQ = activeQuiz ? activeQuiz[currentQIndex] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span>AI DIAGNOSTIC & QUIZ GENERATOR</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Diagnostic & Practice Quizzes</h1>
        <p className="text-xs text-slate-400 mt-1">
          Test your mastery across subjects. Missed questions automatically save to your Mistake Book.
        </p>
      </div>

      {/* QUIZ SETUP FORM (Only when quiz is not active) */}
      {!activeQuiz && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Configure Diagnostic Quiz
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Select Subject</label>
              <select
                value={selectedSubject}
                onChange={e => {
                  setSelectedSubject(e.target.value);
                  const matching = topics.filter(t => t.subjectName === e.target.value);
                  if (matching.length > 0) setSelectedTopic(matching[0].name);
                }}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Topic Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Select Topic</label>
              <select
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              >
                {topics.filter(t => t.subjectName === selectedSubject).map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Question Count</label>
              <div className="flex gap-2">
                {[5, 10, 20].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => setQuestionCount(cnt)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      questionCount === cnt
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Difficulty</label>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      difficulty === diff
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Generating AI Quiz...' : 'START DIAGNOSTIC QUIZ'}</span>
          </button>
        </div>
      )}

      {/* ACTIVE QUIZ VIEW */}
      {activeQuiz && currentQ && !quizSubmitted && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-scaleUp">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-xs font-extrabold uppercase text-indigo-400">
              Question {currentQIndex + 1} of {activeQuiz.length}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{selectedTopic}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {currentQ.text}
          </h3>

          {/* Options */}
          {currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(currentQ.id, opt)}
                  className={`w-full p-4 rounded-xl border text-left font-medium text-xs sm:text-sm transition-all ${
                    userAnswers[currentQ.id] === opt
                      ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-inner'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold text-indigo-400 mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Numerical Input fallback */}
          {currentQ.type === 'numerical' && (
            <input
              type="text"
              placeholder="Type numerical answer (e.g. 40%)..."
              value={userAnswers[currentQ.id] || ''}
              onChange={e => handleSelectOption(currentQ.id, e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentQIndex(i => Math.max(0, i - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs disabled:opacity-40"
            >
              Previous
            </button>

            {currentQIndex < activeQuiz.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex(i => i + 1)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30"
              >
                SUBMIT QUIZ
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUIZ SCORE & EXPLANATION RESULTS */}
      {quizSubmitted && activeQuiz && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-cyan-400 flex items-center justify-center mx-auto text-2xl font-black">
              {score}/{activeQuiz.length}
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Score: {Math.round((score / activeQuiz.length) * 100)}%
            </h2>
            <p className="text-xs text-slate-400">
              {score === activeQuiz.length ? '🔥 Perfect score! Topic mastery boosted.' : 'Mistakes have been saved to your Mistake Book for active review.'}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-200">Question Explanations</h3>
            {activeQuiz.map((q, idx) => {
              const uAns = userAnswers[q.id];
              const isCorrect = uAns && uAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

              return (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Q{idx + 1}. {q.text}</span>
                    {isCorrect ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Correct</span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1"><XCircle className="w-4 h-4" /> Incorrect</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Your Answer: <span className="font-semibold text-white">{uAns || 'None'}</span> | Correct: <span className="font-semibold text-emerald-400">{q.correctAnswer}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 italic bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    💡 Explanation: {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveQuiz(null)}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
          >
            Take Another Quiz
          </button>
        </div>
      )}
    </div>
  );
}
