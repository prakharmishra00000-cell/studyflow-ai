'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const StudyFlowLogo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7 rounded-lg', svg: 'w-4 h-4', text: 'text-base', badge: 'text-[9px] px-1 py-0.2' },
    md: { box: 'w-10 h-10 rounded-xl', svg: 'w-5 h-5', text: 'text-xl', badge: 'text-xs px-2 py-0.5' },
    lg: { box: 'w-14 h-14 rounded-2xl', svg: 'w-8 h-8', text: 'text-2xl', badge: 'text-xs px-2.5 py-1' },
    xl: { box: 'w-20 h-20 rounded-3xl', svg: 'w-12 h-12', text: 'text-4xl', badge: 'text-sm px-3 py-1' }
  };

  const dim = sizeMap[size];

  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative ${dim.box} bg-slate-900/90 border border-cyan-500/30 p-0.5 shadow-lg shadow-cyan-500/20 group hover:border-cyan-400/60 transition-all duration-300`}>
        {/* Glow halo behind */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 opacity-30 blur-md rounded-xl group-hover:opacity-60 transition-opacity" />
        
        {/* Inner container */}
        <div className="relative w-full h-full bg-[#060811] rounded-[9px] flex items-center justify-center overflow-hidden">
          {/* Abstract SVG path forming S + Infinity + Learning Flow */}
          <svg className={`${dim.svg} text-cyan-400`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8C12 10.2091 13.7909 12 16 12C18.2091 12 20 13.7909 20 16C20 18.2091 18.2091 20 16 20C13.7909 20 12 18.2091 12 16C12 13.7909 10.2091 12 8 12C5.79086 12 4 10.2091 4 8Z"
              stroke="url(#studyflow-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Sparkle node dot */}
            <circle cx="16" cy="16" r="2" fill="#10B981" />
            <circle cx="8" cy="8" r="2" fill="#38BDF8" />
            <defs>
              <linearGradient id="studyflow-grad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="0.5" stopColor="#818CF8" />
                <stop offset="1" stopColor="#34D399" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight text-white ${dim.text}`}>
            STUDYFLOW
          </span>
          <span className={`font-extrabold uppercase tracking-wider rounded-md bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 ${dim.badge}`}>
            AI
          </span>
        </div>
      )}
    </div>
  );
};
