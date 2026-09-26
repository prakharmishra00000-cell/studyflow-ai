'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Zap, 
  Route, 
  BookOpen, 
  Network, 
  HelpCircle, 
  ShieldCheck, 
  UserCheck, 
  Settings,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'CORE',
    items: [
      { label: 'Home', href: '/dashboard', icon: Home },
      { label: 'Study Now', href: '/dashboard/study-now', icon: Zap, highlight: true },
    ]
  },
  {
    title: 'LEARN',
    items: [
      { label: 'My Learning Path', href: '/dashboard/learn/path', icon: Route },
      { label: 'Study Material', href: '/dashboard/learn/material', icon: BookOpen },
      { label: 'Visual Concept Map', href: '/dashboard/learn/concept-map', icon: Network },
    ]
  },
  {
    title: 'PRACTICE & PROGRESS',
    items: [
      { label: 'Quizzes & Practice', href: '/dashboard/quizzes', icon: HelpCircle },
      { label: 'Exam Readiness (71%)', href: '/dashboard/progress/readiness', icon: ShieldCheck },
      { label: 'Mistakes Book', href: '/dashboard/mistakes', icon: AlertCircle },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Choose AI Teacher', href: '/dashboard/teacher', icon: UserCheck },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-[#090d16] p-4 gap-5 shrink-0 min-h-[calc(100vh-61px)]">
      {/* Primary Action Button */}
      <Link
        href="/dashboard/study-now"
        className="relative group overflow-hidden w-full p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 hover:opacity-95 transition-all active:scale-[0.98]"
      >
        <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
        <span>WHAT SHOULD I STUDY NOW?</span>
      </Link>

      {/* Navigation List */}
      <nav className="flex-1 space-y-4">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 block">
              {group.title}
            </span>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold shadow-inner'
                      : item.highlight
                      ? 'text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : item.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.highlight && !isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Mini AI System Status */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">STUDYFLOW Learning Brain</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Active
          </span>
        </div>
      </div>
    </aside>
  );
}
