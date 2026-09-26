'use client';

import React, { useState } from 'react';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Clock, Plus, Trash2, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CommitmentsPage() {
  const { commitments, addCommitment, removeCommitment } = useStudyStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'college' | 'coaching' | 'work' | 'gym' | 'travel' | 'sleep' | 'other'>('college');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');

  const totalCommittedHours = commitments.reduce((sum, c) => sum + c.durationHours, 0);
  const availableStudyHours = Math.max(0, 24 - totalCommittedHours);

  const handleAdd = () => {
    if (title.trim()) {
      const sH = parseInt(startTime.split(':')[0]);
      const eH = parseInt(endTime.split(':')[0]);
      const dur = Math.max(1, eH - sH);

      addCommitment({
        title: title.trim(),
        category,
        startTime,
        endTime,
        durationHours: dur
      });

      setTitle('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>COMMITMENT & AVAILABLE BLOCK PLANNER</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Calendar & Commitments</h1>
        <p className="text-xs text-slate-400 mt-1">
          Block out your fixed commitments (college, coaching, gym, sleep). AI calculates free study windows.
        </p>
      </div>

      {/* Available Study Time Summary Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase text-indigo-300">FREE STUDY WINDOWS TODAY</span>
          <h2 className="text-3xl font-black text-white mt-0.5">
            Available Study Time: <span className="text-cyan-400">{availableStudyHours} Hours</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total committed time: {totalCommittedHours} hours across college, coaching, gym & sleep.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> AI Auto-Fitted
        </div>
      </div>

      {/* Add Commitment Form */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white">Add New Fixed Commitment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Title (e.g. College Lectures)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value as any)}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
          >
            <option value="college">College</option>
            <option value="coaching">Coaching</option>
            <option value="work">Work</option>
            <option value="gym">Gym</option>
            <option value="travel">Travel</option>
            <option value="sleep">Sleep</option>
            <option value="other">Other</option>
          </select>

          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
          />

          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
          />
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Commitment
        </button>
      </div>

      {/* Commitment List */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-200">Current Fixed Schedule</h3>
        {commitments.map(c => (
          <div key={c.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <div>
                <h4 className="font-bold text-white">{c.title}</h4>
                <span className="text-[10px] text-slate-400 capitalize">{c.category} • {c.startTime} to {c.endTime} ({c.durationHours}h)</span>
              </div>
            </div>
            <button onClick={() => removeCommitment(c.id)} className="text-rose-400 hover:text-rose-300 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
