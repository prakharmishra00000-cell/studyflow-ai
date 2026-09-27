'use client';

import React from 'react';
import UserControlModal from '@/components/common/UserControlModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060811] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 relative">
      {children}
      <UserControlModal />
    </div>
  );
}
