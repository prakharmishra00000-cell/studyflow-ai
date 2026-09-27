'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const mobileItems = [
    { href: '/dashboard', label: 'Home', icon: '🏠' },
    { href: '/dashboard/roadmap', label: 'Roadmap', icon: '🗺' },
    { href: '/dashboard/today', label: 'Today', icon: '📅' },
    { href: '/dashboard/progress', label: 'Progress', icon: '📊' },
    { href: '/dashboard/projects', label: 'Projects', icon: '🎯' }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#060811]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2">
      <div className="grid grid-cols-5 gap-1 text-center">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                isActive 
                  ? 'text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
