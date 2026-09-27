'use client';

import React from 'react';

export default function FlameBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Central Flaming Glow Aura */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.28) 0%, rgba(234, 88, 12, 0.12) 45%, rgba(6, 182, 212, 0.05) 70%, transparent 85%)',
          animation: 'flame-flicker 5s ease-in-out infinite'
        }}
      />

      {/* Secondary Flame Tongue */}
      <div 
        className="absolute top-10 left-1/3 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.22) 0%, rgba(249, 115, 22, 0.08) 50%, transparent 80%)',
          animation: 'flame-flicker 7s ease-in-out infinite 1s'
        }}
      />

      {/* Floating Ember Particles */}
      <div className="absolute inset-0">
        {[
          { left: '15%', delay: '0s', duration: '4s', size: 'w-2 h-2', bg: 'bg-orange-500' },
          { left: '25%', delay: '1.2s', duration: '5s', size: 'w-3 h-3', bg: 'bg-amber-400' },
          { left: '38%', delay: '2.5s', duration: '3.8s', size: 'w-1.5 h-1.5', bg: 'bg-orange-400' },
          { left: '50%', delay: '0.5s', duration: '4.5s', size: 'w-2.5 h-2.5', bg: 'bg-red-500' },
          { left: '62%', delay: '3.1s', duration: '5.2s', size: 'w-2 h-2', bg: 'bg-amber-500' },
          { left: '75%', delay: '1.8s', duration: '4.2s', size: 'w-3 h-3', bg: 'bg-orange-500' },
          { left: '85%', delay: '2.9s', duration: '4.8s', size: 'w-1.5 h-1.5', bg: 'bg-yellow-400' }
        ].map((ember, i) => (
          <div
            key={i}
            className={`absolute bottom-10 ${ember.left} ${ember.size} ${ember.bg} rounded-full blur-[1px] shadow-lg shadow-orange-500/80`}
            style={{
              animation: `ember-float ${ember.duration} ease-in infinite ${ember.delay}`
            }}
          />
        ))}
      </div>
    </div>
  );
}
