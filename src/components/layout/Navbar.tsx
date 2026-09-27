'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, Sliders, Calendar, BookOpen, Layers, BarChart3, Settings, Rocket, ArrowRight 
} from 'lucide-react';
import { NexronLogo } from '../common/NexronLogo';
import { useStudyStore } from '@/lib/store/StudyContext';
import { AdjustPlanModal } from '../common/AdjustPlanModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { roadmap } = useStudyStore();
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: '🏠 Dashboard' },
    { href: '/dashboard/roadmap', label: '🗺 Roadmap' },
    { href: '/dashboard/today', label: '📅 Today' },
    { href: '/dashboard/projects', label: '🎯 Projects' },
    { href: '/dashboard/progress', label: '📊 Progress' },
    { href: '/dashboard/settings', label: '⚙️ Settings' }
  ];

  return (
    <>
      <header className="border-b border-slate-800/80 bg-[#060811]/90 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <NexronLogo size="md" />
          </Link>

          {/* Active Skill & Goal Badge */}
          {roadmap && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">{roadmap.overview.skill}</span>
              <span className="text-slate-500">•</span>
              <span className="text-cyan-400 font-medium">{roadmap.overview.careerGoal}</span>
            </div>
          )}
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAdjustOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700/80 text-cyan-300 text-xs font-bold hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>⚙️ Adjust Plan</span>
          </button>

          <Link
            href="/#generator"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>New Roadmap</span>
          </Link>
        </div>
      </header>

      {/* Adjust Plan Modal */}
      <AdjustPlanModal isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} />
    </>
  );
};
