'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStudyStore } from '@/lib/store/StudyContext';
import { Flame, Sparkles, Bell, Trophy, RefreshCw, Key } from 'lucide-react';
import NotificationsDrawer from './NotificationsDrawer';

export default function Header() {
  const { profile, resetToDemo } = useStudyStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                STUDYFLOW
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Know what to study. Know when to study.</p>
          </div>
        </Link>
      </div>

      {/* Stats & Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
          <span>{profile.streak} Days</span>
        </div>

        {/* XP & Level */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Trophy className="w-4 h-4 text-indigo-400" />
          <span>Lvl {profile.level} ({profile.xp} XP)</span>
        </div>

        {/* Notifications Toggle */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
        </button>

        {/* Demo Data Reset Button */}
        <button
          onClick={resetToDemo}
          className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          title="Reset Demo Data (Prakhar Profile)"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Demo Data</span>
        </button>

        {/* Profile Avatar */}
        <Link href="/dashboard/settings" className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-500/30">
            {profile.name.charAt(0)}
          </div>
          <span className="text-xs font-medium text-slate-200 hidden lg:inline">{profile.name}</span>
        </Link>
      </div>

      {/* Notifications Drawer Component */}
      {showNotifications && (
        <NotificationsDrawer onClose={() => setShowNotifications(false)} />
      )}
    </header>
  );
}
