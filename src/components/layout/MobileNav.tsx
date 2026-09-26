'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Zap, CalendarDays, HelpCircle, MoreHorizontal, BookOpen, RotateCcw, AlertCircle, Target, Bot, Settings, X } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 border-t border-slate-800/80 backdrop-blur-xl px-4 py-2 flex items-center justify-around">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/dashboard' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link
          href="/dashboard/plan"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/dashboard/plan' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <CalendarDays className="w-5 h-5" />
          <span className="text-[10px] font-medium">Plan</span>
        </Link>

        {/* Central Glowing "Study Now" Action */}
        <Link
          href="/dashboard/study-now"
          className="relative -top-5 p-3.5 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white shadow-lg shadow-indigo-500/40 border-2 border-[#090d16]"
        >
          <Zap className="w-6 h-6 fill-current animate-pulse" />
        </Link>

        <Link
          href="/dashboard/quizzes"
          className={`flex flex-col items-center gap-1 ${
            pathname === '/dashboard/quizzes' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium">Quizzes</span>
        </Link>

        <button
          onClick={() => setShowMore(true)}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>

      {/* More Drawer Modal */}
      {showMore && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col justify-end">
          <div className="bg-[#0d1322] border-t border-slate-800 rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-slate-200 text-sm">All Features</h3>
              <button onClick={() => setShowMore(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link href="/dashboard/syllabus" onClick={() => setShowMore(false)} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-slate-300">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Syllabus</span>
              </Link>
              <Link href="/dashboard/revision" onClick={() => setShowMore(false)} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-slate-300">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Revision</span>
              </Link>
              <Link href="/dashboard/mistakes" onClick={() => setShowMore(false)} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-slate-300">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Mistakes</span>
              </Link>
              <Link href="/dashboard/focus" onClick={() => setShowMore(false)} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-slate-300">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Focus Mode</span>
              </Link>
              <Link href="/dashboard/copilot" onClick={() => setShowMore(false)} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-slate-300">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span>AI Copilot</span>
              </Link>
              <Link href="/dashboard/settings" onClick={() => setShowMore(false)} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-slate-300">
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
