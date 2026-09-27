'use client';

import React from 'react';

export default function FlameBackground() {
  // Generate 40 continuous rising sparkles distributed across screen width
  const sparkles = Array.from({ length: 40 }).map((_, i) => {
    const left = `${(i * 2.45 + (i % 3) * 0.8) % 98 + 1}%`;
    const delay = `${((i * 0.26) % 5.5).toFixed(2)}s`;
    const duration = `${(4.2 + (i % 5) * 0.8).toFixed(2)}s`;
    const sizePx = 2 + (i % 4); // 2px to 5px
    const colors = [
      'bg-orange-500 shadow-orange-500/90',
      'bg-amber-400 shadow-amber-400/90',
      'bg-orange-400 shadow-orange-400/90',
      'bg-red-500 shadow-red-500/90',
      'bg-yellow-300 shadow-yellow-300/90',
      'bg-cyan-400 shadow-cyan-400/70'
    ];
    const colorClass = colors[i % colors.length];

    return {
      id: i,
      left,
      delay,
      duration,
      sizePx,
      colorClass
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Central Flaming Glow Aura */}
      <div 
        className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.45) 0%, rgba(234, 88, 12, 0.2) 45%, rgba(6, 182, 212, 0.08) 70%, transparent 85%)',
          animation: 'flame-flicker 4s ease-in-out infinite'
        }}
      />

      {/* Secondary Flame Aura */}
      <div 
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, rgba(249, 115, 22, 0.1) 50%, transparent 80%)',
          animation: 'flame-flicker 6s ease-in-out infinite 1s'
        }}
      />

      {/* Upward Continuous Fire Sparkles */}
      <div className="absolute inset-0">
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            className={`absolute rounded-full blur-[0.5px] ${sp.colorClass}`}
            style={{
              left: sp.left,
              width: `${sp.sizePx}px`,
              height: `${sp.sizePx}px`,
              animation: `fire-sparkle-rise ${sp.duration} linear infinite ${sp.delay}`,
              boxShadow: sp.sizePx > 3 ? '0 0 12px rgba(249, 115, 22, 0.9)' : '0 0 7px rgba(251, 146, 60, 0.8)'
            }}
          />
        ))}
      </div>
    </div>
  );
}

